import serviceModel from './service.model.js';
import cloudinary from '../../config/cloudinary.config.js';

/**
 * Create a new service
 */
export const createService = async (req, res) => {
  try {
    const { title, description, price, categoryId, subcategoryName } = req.body;
    const providerId = req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (!categoryId || !subcategoryName) {
      return res.status(400).json({ success: false, message: 'Category and subcategory are required' });
    }

    const service = await serviceModel.create({
      providerId,
      title,
      description: description || '',
      price: price || 0,
      categoryId,
      subcategoryName
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create service'
    });
  }
};

/**
 * Get my services (authenticated user)
 */
export const getMyServices = async (req, res) => {
  try {
    const providerId = req.user.id;

    const services = await serviceModel.find({ providerId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceModel.findById(id).populate('providerId', 'businessName');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
};

/**
 * Update service
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, isActive, categoryId, subcategoryName } = req.body;
    const providerId = req.user.id;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providerId.toString() !== providerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (title) service.title = title;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (isActive !== undefined) service.isActive = isActive;
    if (categoryId) service.categoryId = categoryId;
    if (subcategoryName) service.subcategoryName = subcategoryName;

    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
};

/**
 * Delete service
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providerId.toString() !== providerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete images from Cloudinary
    if (service.images && service.images.length > 0) {
      for (const img of service.images) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error('Failed to delete image from Cloudinary:', err);
        }
      }
    }

    await serviceModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};

/**
 * Upload service images
 */
export const uploadServiceImages = async (req, res) => {
  try {
    const { id } = req.params;
    const providerId = req.user.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providerId.toString() !== providerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      try {
        const base64 = file.buffer.toString('base64');
        const dataURI = `data:${file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: `services/${id}`,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto'
        });

        uploadedImages.push({ url: result.secure_url, publicId: result.public_id });
      } catch (err) {
        console.error('Failed to upload image:', err);
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to upload images' });
    }

    service.images.push(...uploadedImages);
    await service.save();

    return res.status(200).json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded`,
      service
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
 * Delete service image
 */
export const deleteServiceImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;
    const providerId = req.user.id;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.providerId.toString() !== providerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Failed to delete from Cloudinary:', err);
    }

    // Remove from array
    service.images = service.images.filter(img => img.publicId !== publicId);
    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
};
