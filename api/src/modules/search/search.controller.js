import serviceProviderModel from "../services/serviceProvider.model.js";
import mongoose from 'mongoose'

export const searchProviders = async(req,res)=>{
    try{
        const{
            lat,
            lng,
            radius = 10,
            categoryId,
            subCategorySlug
        } = req.query;
       
        if(!lat||!lng){
           return res.status(400).json({message: 'Latitude and longitude are required'})
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if(isNaN(latitude) || isNaN(longitude)){
           return res.status(400).json({message: 'invalid coordinates'})
        }

         const radiusKm = parseFloat(radius);
            if (isNaN(radiusKm) || radiusKm <= 0) {
            return res.status(400).json({ message: 'Invalid radius' });
            }
            const maxDistance = radiusKm * 1000;

        const filters = {isActive: true};
        

        if(categoryId){
            if(!mongoose.Types.ObjectId.isValid(categoryId)){
                return res.status(400).json({message: 'Invalid categoryId'})
            }
            filters.categoryId = new mongoose.Types.ObjectId(categoryId);
        }

        if(subCategorySlug){
            filters.subCategorySlug = subCategorySlug.trim().toLowerCase();
        }

       const providers = await serviceProviderModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          distanceField: 'distanceMeters',
          maxDistance,
          spherical: true,
          query: filters
        }
      },
      {
        $addFields: {
          distanceKm: {
            $round: [{ $divide: ['$distanceMeters', 1000] }, 2]
          }
        }
      },
      {
        $project: {
          businessName: 1,
          description: 1,
          location: {
            city: 1,
            state: 1
          },
          ratingAverage: 1,
          totalReviews: 1,
          categoryId: 1,
          distanceKm: 1
        }
      },
      { $limit: 50 }
    ]);
        return res.status(200).json({count: providers.length, providers});

    }catch(error){
        console.log(error)
        return res.status(500).json({message: 'Internal server error'});
    }
};