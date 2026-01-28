import serviceProviderModel from "./serviceProvider.model.js";
import categoryModel from "../categories/category.model.js";
import userModel from "../users/user.model.js";
import mongoose from 'mongoose';

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
 * Update provider profile (basic example)
 * @route PUT /api/provider/me
 * @access Private (requires authentication)
 * @requires req.user.id from auth middleware
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

    // Fields that can be updated
    const allowedFields = ['businessName', 'description', 'location'];
    const updates = {};

    // Filter to only allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Validate coordinates if location is being updated
    if (updates.location?.geo?.coordinates) {
      const coordinates = updates.location.geo.coordinates;
      
      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        return res.status(400).json({
          success: false,
          message: 'Coordinates must be [longitude, latitude]'
        });
      }

      if (coordinates[0] < -180 || coordinates[0] > 180) {
        return res.status(400).json({
          success: false,
          message: 'Longitude must be between -180 and 180'
        });
      }

      if (coordinates[1] < -90 || coordinates[1] > 90) {
        return res.status(400).json({
          success: false,
          message: 'Latitude must be between -90 and 90'
        });
      }
    }

    // Find and update provider
    const provider = await serviceProviderModel
      .findOneAndUpdate(
        { userId },
        updates,
        { 
          new: true, // Return updated document
          runValidators: true // Run model validators
        }
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
      message: 'Provider updated successfully',
      provider
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