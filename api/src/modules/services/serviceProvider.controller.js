import serviceProviderModel from "./serviceProvider.model.js";
import categoryModel from "../categories/category.model.js";
import mongoose from 'mongoose';

export const getProviderById = async (req,res) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: 'invalid provider id'});
    }
    const provider = await serviceProviderModel.findById(id).populate('categoryId', 'name slug');
    if(!provider || !provider.isActive){
      return res.status(404).json({message: 'service provider not found'});
    }
    return res.status(200).json({provider});

  }catch(error){
    console.log(error) //remove later
    return res.status(500).json({message: 'internal server error'});
  }
};

export const registerServiceProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      categoryId,
      subCategorySlug,
      businessName,
      city,
      state,
      description,
      coordinates
    } = req.body;

    if (
      !categoryId ||
      !subCategorySlug ||
      !businessName ||
      !city ||
      !state ||
      !coordinates
    ) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // one provider per user
    const existing = await serviceProviderModel.findOne({ userId });
    if (existing) {
      return res.status(409).json({ message: 'Provider already registered' });
    }

    // validate category
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Invalid category' });
    }

    // validate subcategory
    const subExists = category.subCategories?.find(
      sub => sub.slug === subCategorySlug.toLowerCase()
    );

    if (!subExists) {
      return res.status(400).json({
        message: 'Subcategory does not belong to selected category'
      });
    }

    // validate coordinates
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        message: 'Coordinates must be [lng, lat]'
      });
    }

    const provider = await serviceProviderModel.create({
      userId,
      categoryId,
      subCategorySlug: subCategorySlug.toLowerCase(),
      businessName,
      description,
      location: {
        city,
        state,
        geo: {
          coordinates
        }
      }
    });

    return res.status(201).json({
      message: 'Service provider registered successfully',
      provider:{
        id: provider._id,
        businessName: provider.businessName,
        categoryId: provider.categoryId,
        subCategorySlug: provider.subCategorySlug
      }
    });

  } catch (error) {
    console.error(error); //should remove
    return res.status(500).json({ message: 'Internal server error' });
  }
};
