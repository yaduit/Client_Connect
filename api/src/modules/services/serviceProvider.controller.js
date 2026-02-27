import serviceProviderModel from './serviceProvider.model.js';
import reviewModel from '../reviews/review.model.js';
import cloudinary from '../../config/cloudinary.config.js';
import mongoose from 'mongoose';

/**
 * Register a new service provider
 */
export const registerProvider = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      businessName, 
      description, 
      categoryId, 
      subCategorySlug,
      location,
      phone,
      email,
      website
    } = req.body;

    if (!businessName || !categoryId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Business name and category are required' 
      });
    }

    // Check if provider already exists
    const existingProvider = await serviceProviderModel.findOne({ userId });
    if (existingProvider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider profile already exists' 
      });
    }

    // Create provider
    const provider = await serviceProviderModel.create({
      userId,
      businessName,
      description: description || '',
      categoryId,
      subCategorySlug: subCategorySlug || '',
      location: location || {},
      phone: phone || '',
      email: email || '',
      website: website || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Provider registered successfully',
      provider
    });
  } catch (error) {
    console.error('Error registering provider:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register provider'
    });
  }
};

/**
 * Get provider by ID or slug
 */
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's a valid ObjectId or slug
    let provider;
    if (mongoose.Types.ObjectId.isValid(id)) {
      provider = await serviceProviderModel
        .findById(id)
        .populate('userId', 'name email')
        .populate('categoryId', 'name slug');
    } else {
      provider = await serviceProviderModel
        .findOne({ slug: id })
        .populate('userId', 'name email')
        .populate('categoryId', 'name slug');
    }

    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    // Increment view count
    provider.totalViews += 1;
    await provider.save();

    return res.status(200).json({
      success: true,
      provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch provider'
    });
  }
};

/**
 * Get current user's provider profile
 */
export const getMyProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    const provider = await serviceProviderModel
      .findOne({ userId })
      .populate('categoryId', 'name slug');

    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider profile not found' 
      });
    }

    return res.status(200).json({
      success: true,
      provider
    });
  } catch (error) {
    console.error('Error fetching provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch provider'
    });
  }
};

/**
 * Update provider profile
 */
export const updateProvider = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    // Update allowed fields
    const allowedFields = [
      'businessName',
      'description',
      'categoryId',
      'subCategorySlug',
      'location',
      'phone',
      'email',
      'website',
      'businessHours'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        provider[field] = updates[field];
      }
    });

    await provider.save();

    return res.status(200).json({
      success: true,
      message: 'Provider updated successfully',
      provider
    });
  } catch (error) {
    console.error('Error updating provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update provider'
    });
  }
};

/**
 * Toggle provider status (active/inactive)
 */
export const toggleProviderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isActive } = req.body;

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    provider.isActive = isActive;
    await provider.save();

    return res.status(200).json({
      success: true,
      message: `Provider ${isActive ? 'activated' : 'deactivated'} successfully`,
      provider
    });
  } catch (error) {
    console.error('Error toggling provider status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle provider status'
    });
  }
};

/**
 * Upload provider images
 */
export const uploadProviderImages = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images provided' 
      });
    }

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        const base64 = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: `providers/${userId}`,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        });

        uploadedImages.push({ 
          url: result.secure_url, 
          publicId: result.public_id 
        });
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to upload images' 
      });
    }

    provider.images.push(...uploadedImages);
    await provider.save();

    return res.status(200).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded`,
      provider
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
};

/**
 * Delete provider image
 */
export const deleteProviderImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { publicId } = req.params;

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Failed to delete from Cloudinary:', err);
    }

    // Remove from array
    provider.images = provider.images.filter(img => img.publicId !== publicId);
    await provider.save();

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      provider
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};

/**
 * Get related providers by category and proximity
 * NEW ENDPOINT FOR RELATED PROVIDERS FEATURE
 */
export const getRelatedProviders = async (req, res) => {
  try {
    const { categoryId, excludeId, lat, lng, limit = 6 } = req.query;

    // Validate required params
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'categoryId is required'
      });
    }

    // Validate categoryId format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid categoryId format'
      });
    }

    const limitNum = parseInt(limit) || 6;
    const hasLocation = lat && lng;

    let providers = [];

    if (hasLocation) {
      // Geospatial query with distance sorting
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid lat/lng values'
        });
      }

      const matchQuery = {
        categoryId: new mongoose.Types.ObjectId(categoryId),
        isActive: true
      };

      if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
        matchQuery._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
      }

      providers = await serviceProviderModel.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            distanceField: 'distanceMeters',
            spherical: true,
            query: matchQuery,
            maxDistance: 100000, // 100km max
            limit: limitNum
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryDetails'
          }
        },
        {
          $project: {
            _id: 1,
            businessName: 1,
            slug: 1,
            description: 1,
            subCategorySlug: 1,
            location: 1,
            images: 1,
            ratingAverage: 1,
            totalReviews: 1,
            distanceMeters: 1,
            'categoryId.name': { $arrayElemAt: ['$categoryDetails.name', 0] },
            'categoryId.slug': { $arrayElemAt: ['$categoryDetails.slug', 0] },
            'categoryId._id': { $arrayElemAt: ['$categoryDetails._id', 0] },
            updatedAt: 1
          }
        }
      ]);
    } else {
      // Regular query sorted by rating
      const query = {
        categoryId: new mongoose.Types.ObjectId(categoryId),
        isActive: true
      };

      if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
        query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
      }

      providers = await serviceProviderModel
        .find(query)
        .populate('categoryId', 'name slug')
        .select('businessName slug description subCategorySlug location images ratingAverage totalReviews updatedAt')
        .sort({ ratingAverage: -1, updatedAt: -1 })
        .limit(limitNum)
        .lean();
    }

    // Format response
    const formattedProviders = providers.map(provider => ({
      id: provider._id,
      businessName: provider.businessName,
      slug: provider.slug,
      subCategorySlug: provider.subCategorySlug,
      description: provider.description,
      location: {
        city: provider.location?.city,
        state: provider.location?.state,
        geo: provider.location?.geo
      },
      images: provider.images || [],
      avgRating: provider.ratingAverage || 0,
      totalReviews: provider.totalReviews || 0,
      distanceMeters: provider.distanceMeters || null,
      categoryId: provider.categoryId
    }));

    return res.status(200).json({
      success: true,
      providers: formattedProviders,
      total: formattedProviders.length
    });
  } catch (error) {
    console.error('Error fetching related providers:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch related providers'
    });
  }
};

/**
 * Deactivate provider (legacy endpoint)
 */
export const deactivateProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    provider.isActive = false;
    await provider.save();

    return res.status(200).json({
      success: true,
      message: 'Provider deactivated successfully',
      provider
    });
  } catch (error) {
    console.error('Error deactivating provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate provider'
    });
  }
};

/**
 * Activate provider (legacy endpoint)
 */
export const activateProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: 'Provider not found' 
      });
    }

    provider.isActive = true;
    await provider.save();

    return res.status(200).json({
      success: true,
      message: 'Provider activated successfully',
      provider
    });
  } catch (error) {
    console.error('Error activating provider:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to activate provider'
    });
  }
};