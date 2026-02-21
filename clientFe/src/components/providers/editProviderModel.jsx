import { useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";
import { updateProviderApi, uploadProviderImagesApi, deleteProviderImageApi } from "../../api/provider.api.js";
import ImageUploadSection from "./imageUploadSection.jsx";

/**
 * EditProviderModal - Now supports both EDIT and CREATE modes
 * - CREATE mode: Opens with empty provider data for new service
 * - EDIT mode: Opens with existing provider data for editing
 */
const EditProviderModal = ({ provider, isOpen, onClose, onSuccess, mode = "edit" }) => {
  // ============ STATE ============
  const [formData, setFormData] = useState({
    businessName: provider?.businessName || "",
    description: provider?.description || "",
    city: provider?.location?.city || "",
    state: provider?.location?.state || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState({});

  // ============ IMAGE STATE ============
  const [existingImages, setExistingImages] = useState(provider?.images || []);
  const [selectedNewImages, setSelectedNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // ============ VALIDATION ============
  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters";
    } else if (formData.businessName.trim().length > 100) {
      newErrors.businessName = "Business name must be less than 100 characters";
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be 500 characters or less";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ HANDLERS ============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // ============ IMAGE HANDLERS ============
  const handleDeleteExistingImage = (publicId) => {
    setImagesToDelete((prev) => [...prev, publicId]);
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleUndoDelete = (publicId) => {
    const originalImage = provider?.images.find((img) => img.publicId === publicId);
    if (originalImage) {
      setImagesToDelete((prev) => prev.filter((id) => id !== publicId));
      setExistingImages((prev) => [...prev, originalImage]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      // Step 1: Update provider details
      const updateData = {
        businessName: formData.businessName.trim(),
        description: formData.description.trim(),
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
        },
      };

      console.log("📤 Updating provider with:", updateData);
      const response = await updateProviderApi(updateData);

      if (!response.success) {
        console.error("❌ Update failed:", response.message);
        setSubmitError(response.message || "Failed to update provider");
        setLoading(false);
        return;
      }

      console.log("✅ Provider updated successfully");

      // Step 2: Delete images if marked for deletion
      if (imagesToDelete.length > 0) {
        console.log(`🗑️ Deleting ${imagesToDelete.length} images`);
        for (const publicId of imagesToDelete) {
          try {
            await deleteProviderImageApi(publicId);
            console.log(`✅ Deleted image: ${publicId}`);
          } catch (deleteError) {
            console.error(`❌ Failed to delete image ${publicId}:`, deleteError);
            setSubmitError("Failed to delete some images. Please try again.");
          }
        }
      }

      // Step 3: Upload new images if selected
      if (selectedNewImages.length > 0) {
        console.log(`📸 Uploading ${selectedNewImages.length} new images`);
        try {
          const uploadResponse = await uploadProviderImagesApi(selectedNewImages);
          console.log("✅ Images uploaded successfully:", uploadResponse);
          
          if (!uploadResponse.success) {
            console.error("❌ Image upload failed:", uploadResponse.message);
            setSubmitError("Images uploaded but with issues. Please try again.");
          }
        } catch (uploadError) {
          console.error("❌ Image upload error:", uploadError);
          setSubmitError("Provider updated but image upload failed. Please try uploading images separately.");
        }
      }

      // Success - call parent callback
      onSuccess(response.provider);
      resetForm();
      onClose();
    } catch (error) {
      console.error("❌ Error updating provider:", error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        "An error occurred while updating your profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      businessName: provider?.businessName || "",
      description: provider?.description || "",
      city: provider?.location?.city || "",
      state: provider?.location?.state || "",
    });
    setErrors({});
    setTouched({});
    setSubmitError("");
    setExistingImages(provider?.images || []);
    setSelectedNewImages([]);
    setImagesToDelete([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const maxImages = 4;
  const totalCurrentImages = existingImages.length + selectedNewImages.length;

  // ✅ Determine modal title based on mode
  const modalTitle = mode === "create" ? "Create New Service" : "Edit Service Details";

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {modalTitle}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Submit Error Alert */}
            {submitError && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Business Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="Enter your business name"
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-sm disabled:bg-slate-50 disabled:cursor-not-allowed ${
                  touched.businessName && errors.businessName
                    ? "border-red-300 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {touched.businessName && errors.businessName && (
                <p className="text-xs text-red-600 mt-1.5">{errors.businessName}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {formData.businessName.length}/100 characters
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                placeholder="Describe your service..."
                rows="4"
                className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-sm disabled:bg-slate-50 disabled:cursor-not-allowed resize-none ${
                  touched.description && errors.description
                    ? "border-red-300 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  placeholder="City"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-sm disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    touched.city && errors.city
                      ? "border-red-300 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {touched.city && errors.city && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  placeholder="State"
                  className={`w-full px-4 py-2.5 rounded-lg border transition-colors text-sm disabled:bg-slate-50 disabled:cursor-not-allowed ${
                    touched.state && errors.state
                      ? "border-red-300 bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {touched.state && errors.state && (
                  <p className="text-xs text-red-600 mt-1.5">{errors.state}</p>
                )}
              </div>
            </div>

            {/* ============ IMAGE MANAGEMENT SECTION ============ */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Manage Images ({totalCurrentImages}/{maxImages})
              </h3>

              {/* Existing Images with Delete */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Current Images ({existingImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {existingImages.map((image) => (
                      <div
                        key={image.publicId}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-200 bg-blue-50 group"
                      >
                        <img
                          src={image.url}
                          alt="Service"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", image.url);
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3C/svg%3E";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(image.publicId)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-600/20 transition-colors flex items-center justify-center">
                          <span className="text-xs text-white font-medium bg-gray-800/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to delete
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Images Pending Deletion */}
              {imagesToDelete.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-3">
                    Pending Deletion ({imagesToDelete.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {provider?.images
                      .filter((img) => imagesToDelete.includes(img.publicId))
                      .map((image) => (
                        <div
                          key={image.publicId}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-red-300 bg-red-100 opacity-75 group"
                        >
                          <img
                            src={image.url}
                            alt="Pending deletion"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleUndoDelete(image.publicId)}
                            className="absolute inset-0 flex items-center justify-center bg-gray-700/40 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Undo delete"
                          >
                            <span className="text-xs text-white font-medium bg-gray-800/70 px-2 py-1 rounded">
                              Click to restore
                            </span>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              {totalCurrentImages < maxImages && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Add New Images ({selectedNewImages.length}/{maxImages - existingImages.length} remaining)
                  </p>
                  <ImageUploadSection
                    onImagesChange={setSelectedNewImages}
                    maxImages={maxImages}
                    maxFileSize={5}
                    existingImages={existingImages}
                  />
                </div>
              )}

              {/* Max Images Reached */}
              {totalCurrentImages >= maxImages && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ℹ️ You've reached the maximum of {maxImages} images. Delete some to add more.
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProviderModal;
