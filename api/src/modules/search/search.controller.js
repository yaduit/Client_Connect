import serviceProviderModel from "../services/serviceProvider.model.js";
import mongoose from 'mongoose'

export const searchProviders = async(req,res)=>{
    try{
        const{
            lat,
            lng,
            radius = 10,
            categoryId,
            subCategorySlug,
            page = 1,
            limit = 10,
            sort = 'distance'
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
          const maxRadius = 50;
          const maxDistance = Math.min(radiusKm ,maxRadius)* 1000;

        const pageNumber = Number.isNaN(parseInt(page)) ? 1 : Math.max(parseInt(page),1);
        const limitNumber = Number.isNaN(parseInt(limit)) ? 10 : Math.min(Math.max(parseInt(limit),1),50);
        const skip = (pageNumber - 1) * limitNumber ;          

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

        let sortStage = null;
        if(sort === 'rating'){
          sortStage = {ratingAverage: -1};
        };

       const pipeline =[
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
    ];

    if(sortStage){
      pipeline.push({$sort : sortStage});
    }
    pipeline.push({$skip: skip});
    pipeline.push({$limit: limitNumber});

    const providers = await serviceProviderModel.aggregate(pipeline);
        return res.status(200).json({page: pageNumber,
          limit: limitNumber,
          results: providers.length,
          providers
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({message: 'Internal server error'});
    }
};