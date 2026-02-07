import userModel from '../users/user.model.js';
import serviceModel from '../services/serviceProvider.model.js';
import bookingModel from '../booking/booking.model.js';
import categoryModel from '../categories/category.model.js';

// ============================================
// DASHBOARD STATS
// ============================================

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProviders,
      totalBookings,
      totalCategories,
      pendingBookings,
      activeProviders,
      inactiveProviders,
      recentUsers
    ] = await Promise.all([
      userModel.countDocuments(),
      serviceModel.countDocuments(),
      bookingModel.countDocuments(),
      categoryModel.countDocuments(),
      bookingModel.countDocuments({ status: 'pending' }),
      serviceModel.countDocuments({ isActive: true }),
      serviceModel.countDocuments({ isActive: false }),
      userModel.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt')
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        totalBookings,
        totalCategories,
        pendingBookings,
        activeProviders,
        inactiveProviders
      },
      recentUsers
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};

    // Filter by role
    if (role && ['seeker', 'provider', 'admin'].includes(role)) {
      query.role = role;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      userModel
        .find(query)
        .select('name email role phoneNum location isVerified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      userModel.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * PATCH /api/admin/users/:id/role
 * Update user role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['seeker', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: seeker, provider, or admin'
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user (soft delete by setting isVerified to false)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete
    user.isVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ============================================
// PROVIDER MANAGEMENT
// ============================================

/**
 * GET /api/admin/providers
 * Get all providers with pagination and filters
 */
export const getAllProviders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;

    const query = {};

    // Filter by status
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Filter by category
    if (category) {
      query.categoryId = category;
    }

    // Search by business name
    if (search) {
      query.businessName = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [providers, total] = await Promise.all([
      serviceModel
        .find(query)
        .populate('userId', 'name email phoneNum')
        .populate('categoryId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      serviceModel.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      providers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllProviders:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * PATCH /api/admin/providers/:id/status
 * Activate or deactivate a provider
 */
export const updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }

    const provider = await serviceModel.findById(id);

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
      provider: {
        id: provider._id,
        businessName: provider.businessName,
        isActive: provider.isActive
      }
    });
  } catch (error) {
    console.error('Error in updateProviderStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE /api/admin/providers/:id
 * Delete a provider
 */
export const deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await serviceModel.findByIdAndDelete(id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Provider deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProvider:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ============================================
// BOOKING MANAGEMENT
// ============================================

/**
 * GET /api/admin/bookings
 * Get all bookings with pagination and filters
 */
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const query = {};

    // Filter by status
    if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      query.status = status;
    }

    // Search by seeker name or email
    if (search) {
      query.$or = [
        { seekerName: { $regex: search, $options: 'i' } },
        { seekerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      bookingModel
        .find(query)
        .populate('serviceId', 'title price')
        .populate('providerId', 'businessName')
        .populate('seekerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      bookingModel.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// ============================================
// CATEGORY MANAGEMENT
// ============================================

/**
 * GET /api/admin/categories
 * Get all categories (already exists in category.controller.js)
 * This is just for admin view with additional stats
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });

    // Get provider count for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const providerCount = await serviceModel.countDocuments({
          categoryId: category._id
        });

        return {
          ...category.toObject(),
          providerCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      categories: categoriesWithStats
    });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * PUT /api/admin/categories/:id
 * Update category name
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    name = name.trim();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if slug already exists (excluding current category)
    const existing = await categoryModel.findOne({ slug, _id: { $ne: id } });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    category.name = name;
    category.slug = slug;
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE /api/admin/categories/:id
 * Delete a category
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any providers use this category
    const providerCount = await serviceModel.countDocuments({ categoryId: id });

    if (providerCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${providerCount} provider(s) are using this category.`
      });
    }

    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * PUT /api/admin/categories/:categoryId/subcategories/:subId
 * Update subcategory
 */
export const updateSubCategory = async (req, res) => {
  try {
    const { categoryId, subId } = req.params;
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name is required'
      });
    }

    name = name.trim();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subCategory = category.subCategories.id(subId);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Check for duplicate slug (excluding current subcategory)
    const duplicate = category.subCategories.find(
      (sub) => sub.slug === slug && sub._id.toString() !== subId
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'Subcategory with this name already exists'
      });
    }

    subCategory.name = name;
    subCategory.slug = slug;
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      category
    });
  } catch (error) {
    console.error('Error in updateSubCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * DELETE /api/admin/categories/:categoryId/subcategories/:subId
 * Delete subcategory
 */
export const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subId } = req.params;

    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subCategory = category.subCategories.id(subId);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Check if any providers use this subcategory
    const providerCount = await serviceModel.countDocuments({
      categoryId,
      subCategorySlug: subCategory.slug
    });

    if (providerCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete subcategory. ${providerCount} provider(s) are using it.`
      });
    }

    category.subCategories.pull(subId);
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteSubCategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};