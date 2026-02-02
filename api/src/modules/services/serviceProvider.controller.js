import serviceProviderModel from "./serviceProvider.model.js";
import categoryModel from "../categories/category.model.js";
import userModel from "../users/user.model.js";
import mongoose from 'mongoose';
import cloudinary from '../../config/cloudinary.config.js'
import jwt from 'jsonwebtoken' 

/**
 * Get provider by ID (public endpoint)
 * @route GET /api/providers/:id
 * @access Public
 */
export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid provider ID format' 
      });
    }

    const provider = await serviceProviderModel
      .findById(id)
      .populate('categoryId', 'name slug');

    // Check if provider exists and is active
    if (!provider || !provider.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'Service provider not found' 
      });
    }

    return res.status(200).json({ 
      success: true,
      provider 
    });

  } catch (error) {
    console.error('Error in getProviderById:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

/**
 * Get current user's provider profile
 * @route GET /api/provider/me
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 */
export const getMyProvider = async (req, res) => {
  try {
    // userId from auth middleware
    const userId = req.user.id;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Find provider by userId and populate category details
    const provider = await serviceProviderModel
      .findOne({ userId })
      .populate('categoryId', 'name slug');

    // Check if provider exists
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
    console.error('Error in getMyProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Register a new service provider
 * @route POST /api/provider/register
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 * 
 * @body {
 *   businessName: string (required),
 *   categoryId: ObjectId (required),
 *   subCategorySlug: string (required),
 *   description: string (optional),
 *   location: {
 *     city: string (required),
 *     state: string (required),
 *     geo: {
 *       coordinates: [longitude, latitude] (required)
 *     }
 *   }
 * }
 */
export const registerServiceProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Destructure and validate request body
    const {
      categoryId,
      subCategorySlug,
      businessName,
      description,
      location
    } = req.body;

    // ============ VALIDATION ============

    // 1. Check required fields
    if (!categoryId || !subCategorySlug || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: businessName, categoryId, subCategorySlug'
      });
    }

    // 2. Validate location object
    if (!location || typeof location !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Location object is required'
      });
    }

    // 3. Validate location fields
    const { city, state, geo } = location;
    if (!city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Location must include city and state'
      });
    }

    // 4. Validate geo coordinates
    if (!geo || !Array.isArray(geo.coordinates)) {
      return res.status(400).json({
        success: false,
        message: 'Location.geo.coordinates must be an array'
      });
    }

    const { coordinates } = geo;
    
    // Coordinates must be [longitude, latitude]
    if (coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates must be [longitude, latitude] array with 2 elements'
      });
    }

    // Validate coordinate values are numbers
    if (!coordinates.every(coord => typeof coord === 'number')) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates must contain valid numbers'
      });
    }

    // Longitude must be between -180 and 180
    if (coordinates[0] < -180 || coordinates[0] > 180) {
      return res.status(400).json({
        success: false,
        message: 'Longitude must be between -180 and 180'
      });
    }

    // Latitude must be between -90 and 90
    if (coordinates[1] < -90 || coordinates[1] > 90) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90'
      });
    }

    // ============ CHECK EXISTING PROVIDER ============

    // One provider per user - check if user already has a provider
    const existingProvider = await serviceProviderModel.findOne({ userId });
    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered as a service provider'
      });
    }

    // ============ VALIDATE CATEGORY ============

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // ============ VALIDATE SUBCATEGORY ============

    const subCategoryExists = category.subCategories?.find(
      sub => sub.slug === subCategorySlug.toLowerCase()
    );

    if (!subCategoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory does not belong to selected category'
      });
    }

    // ============ CREATE PROVIDER ============

    const provider = await serviceProviderModel.create({
      userId,
      categoryId,
      subCategorySlug: subCategorySlug.toLowerCase(),
      businessName: businessName.trim(),
      description: description?.trim() || '',
      location: {
        city: city.trim(),
        state: state.trim(),
        geo: {
          type: 'Point',
          coordinates: coordinates // [longitude, latitude]
        }
      },
      isActive: true
    });

    // ============ UPDATE USER ROLE ============

    // Update user role to "provider"
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { role: 'provider' },
      { new: true } // Return updated user
    );

    if (!updatedUser) {
      // Rollback: delete provider if user update fails
      await serviceProviderModel.findByIdAndDelete(provider._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }

    // REISSUE JWT so the cookie contains the new role
    const isProd = process.env.NODE_ENV === 'production';
    const token = jwt.sign({ id: updatedUser._id, role: updatedUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ============ SUCCESS RESPONSE ============

    return res.status(201).json({
      success: true,
      message: 'Service provider registered successfully',
      provider: {
        id: provider._id,
        businessName: provider.businessName,
        categoryId: provider.categoryId,
        subCategorySlug: provider.subCategorySlug,
        location: provider.location,
        isActive: provider.isActive
      },
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error('Error in registerServiceProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
/**
 * Update provider profile (businessName, description, location city/state)
 * @route PATCH /api/providers/me
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 * 
 * @body {
 *   businessName: string (optional),
 *   description: string (optional),
 *   location: {
 *     city: string (optional),
 *     state: string (optional)
 *   }
 * }
 */
export const updateMyProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get current provider first
    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // ============ PREPARE UPDATES ============

    const updates = {};

    // Update businessName if provided
    if (req.body.businessName !== undefined) {
      const businessName = req.body.businessName.trim();
      
      if (!businessName) {
        return res.status(400).json({
          success: false,
          message: 'Business name cannot be empty'
        });
      }
      
      if (businessName.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Business name must be at least 3 characters'
        });
      }
      
      if (businessName.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Business name must be less than 100 characters'
        });
      }
      
      updates.businessName = businessName;
    }

    // Update description if provided
    if (req.body.description !== undefined) {
      const description = req.body.description.trim();
      
      if (description.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Description must be 500 characters or less'
        });
      }
      
      updates.description = description;
    }

    // Update location city/state if provided
    if (req.body.location) {
      const { city, state } = req.body.location;
      
      // Update city if provided
      if (city !== undefined) {
        const trimmedCity = city.trim();
        if (!trimmedCity) {
          return res.status(400).json({
            success: false,
            message: 'City cannot be empty'
          });
        }
        updates['location.city'] = trimmedCity;
      }
      
      // Update state if provided
      if (state !== undefined) {
        const trimmedState = state.trim();
        if (!trimmedState) {
          return res.status(400).json({
            success: false,
            message: 'State cannot be empty'
          });
        }
        updates['location.state'] = trimmedState;
      }

      // Ensure at least one location field is being updated
      if (!city && !state) {
        return res.status(400).json({
          success: false,
          message: 'Please provide city or state to update'
        });
      }
    }

    // Check if there are any updates to make
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // ============ APPLY UPDATES ============

    // Use updateOne with dot notation to avoid geo validation
    await serviceProviderModel.updateOne(
      { userId },
      { $set: updates }
    );

    // Fetch updated provider
    const updatedProvider = await serviceProviderModel
      .findOne({ userId })
      .populate('categoryId', 'name slug');

    return res.status(200).json({
      success: true,
      message: 'Provider updated successfully',
      provider: updatedProvider
    });

  } catch (error) {
    console.error('Error in updateMyProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Toggle provider service active status
 * @route PATCH /api/providers/me/status
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 * 
 * @body {
 *   isActive: boolean (required)
 * }
 */
export const toggleProviderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isActive } = req.body;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Validate isActive is boolean
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    // Find and update provider
    const provider = await serviceProviderModel
      .findOneAndUpdate(
        { userId },
        { isActive },
        { new: true }
      )
      .populate('categoryId', 'name slug');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Provider ${isActive ? 'activated' : 'deactivated'} successfully`,
      provider
    });

  } catch (error) {
    console.error('Error in toggleProviderStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Deactivate provider (soft delete)
 * @route PUT /api/provider/deactivate
 * @access Private (requires authentication)
 */
export const deactivateProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const provider = await serviceProviderModel.findOneAndUpdate(
      { userId },
      { isActive: false },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Provider deactivated successfully',
      provider
    });

  } catch (error) {
    console.error('Error in deactivateProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Reactivate provider
 * @route PUT /api/provider/activate
 * @access Private (requires authentication)
 */
export const activateProvider = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const provider = await serviceProviderModel.findOneAndUpdate(
      { userId },
      { isActive: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Provider activated successfully',
      provider
    });

  } catch (error) {
    console.error('Error in activateProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Upload multiple service images to Cloudinary
 * @route POST /api/providers/me/images
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 * @requires req.files from multer middleware (max 4 files)
 * 
 * @returns {
 *   success: boolean,
 *   message: string,
 *   provider: object (with updated images array)
 * }
 */
export const uploadServiceImages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Get current provider
    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // ============ VALIDATION ============

    // Check current image count
    const currentImageCount = provider.images?.length || 0;
    const maxImages = 4;
    const allowedNewImages = maxImages - currentImageCount;

    if (currentImageCount >= maxImages) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxImages} images allowed. Please delete existing images to add new ones.`
      });
    }

    if (req.files.length > allowedNewImages) {
      return res.status(400).json({
        success: false,
        message: `You can only add ${allowedNewImages} more image(s). Maximum is ${maxImages} total.`
      });
    }

    // ============ UPLOAD TO CLOUDINARY ============

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
      console.error('Cloudinary credentials missing. Aborting image upload.');
      return res.status(500).json({ success: false, message: 'Cloudinary not configured. Please set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET and CLOUDINARY_CLOUD_NAME.' });
    }

    const uploadedImages = [];
    const failedUploads = [];

    for (const file of req.files) {
      try {
        // Convert buffer to base64 string
        const base64 = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: `marketplace/providers/${userId}`,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        });

        uploadedImages.push({ url: result.secure_url, publicId: result.public_id });

      } catch (uploadError) {
        console.error(`Failed to upload file ${file.originalname}:`, uploadError);
        failedUploads.push(file.originalname);
      }
    }

    // ============ CHECK UPLOAD RESULTS ============

    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload images. Please try again.'
      });
    }

    // ============ UPDATE PROVIDER WITH NEW IMAGES ============

    const updatedProvider = await serviceProviderModel.findByIdAndUpdate(
      provider._id,
      {
        $push: {
          images: {
            $each: uploadedImages
          }
        }
      },
      { new: true }
    ).populate('categoryId', 'name slug');

    // ============ RESPONSE ============

    let message = `${uploadedImages.length} image(s) uploaded successfully`;
    if (failedUploads.length > 0) {
      message += `. Failed to upload: ${failedUploads.join(', ')}`;
    }

    return res.status(200).json({
      success: true,
      message: message,
      provider: updatedProvider
    });

  } catch (error) {
    console.error('Error in uploadServiceImages:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete a service image from Cloudinary and MongoDB
 * @route DELETE /api/providers/me/images/:publicId
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
 * @param {string} publicId - Cloudinary public_id of the image
 * 
 * @returns {
 *   success: boolean,
 *   message: string,
 *   provider: object (with updated images array)
 * }
 */
export const deleteServiceImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { publicId } = req.params;

    // Validate userId exists
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Validate publicId provided
    if (!publicId || publicId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Image ID (publicId) is required'
      });
    }

    // ============ GET PROVIDER ============

    const provider = await serviceProviderModel.findOne({ userId });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found'
      });
    }

    // ============ VERIFY IMAGE OWNERSHIP ============

    const imageExists = provider.images?.some(img => img.publicId === publicId);
    if (!imageExists) {
      return res.status(404).json({
        success: false,
        message: 'Image not found in your provider profile'
      });
    }

    // ============ DELETE FROM CLOUDINARY ============

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error(`Failed to delete from Cloudinary: ${publicId}`, cloudinaryError);
      // Continue with DB deletion even if Cloudinary deletion fails
      // The image won't be served from DB, but it's cleaner to remove the reference
    }

    // ============ DELETE FROM MONGODB ============

    const updatedProvider = await serviceProviderModel.findByIdAndUpdate(
      provider._id,
      {
        $pull: {
          images: { publicId: publicId }
        }
      },
      { new: true }
    ).populate('categoryId', 'name slug');

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      provider: updatedProvider
    });

  } catch (error) {
    console.error('Error in deleteServiceImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};