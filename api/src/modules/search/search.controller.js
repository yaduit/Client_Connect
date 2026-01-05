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
        const maxDistance = parseFloat(radius) * 1000;

        if(isNaN(latitude) || isNaN(longitude)){
           return res.status(400).json({message: 'invalid coordinates'})
        }

        //Build query//

        const query = {
            isActive: true,
            'location.geo':{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates: [longitude,latitude]
                    },
                    $maxDistance: maxDistance
                }
            }
        };

        if(categoryId){
            if(!mongoose.Types.ObjectId.isValid(categoryId)){
                return res.status(400).json({message: 'Invalid categoryId'})
            }
            query.categoryId = categoryId;
        }

        if(subCategorySlug){
            query.subCategorySlug = subCategorySlug.trim().toLowerCase();
        }

        const providers = await serviceProviderModel.find(query)
        .select('businessName description location.city location.state ratingAverage totalReviews')
        .populate('categoryId', 'name slug')
        .limit(50);
        return res.status(200).json({count: providers.length, providers});

    }catch(error){
        console.log(error)
        return res.status(500).json({message: 'Internal server error'});
    }
};