import { useState } from "react";
import { MapPin, Loader2, Building2, FileText, MapPinned, X } from "lucide-react";
import ImageUploadSection from "./imageUploadSection.jsx";
import { updateProviderApi, uploadProviderImagesApi, deleteProviderImageApi } from "../../api/provider.api.js";

/**
 * EditProviderForm - Edit existing provider with image management
 * Features:
 * - Edit business name, description, location
 * - Add new images (up to max total)
 * - Delete existing images
 * - Show existing images with delete capability
 */
const EditProviderForm = ({ provider, onSuccess, onCancel }) => {

  const [businessName, setBusinessName] = useState(provider?.businessName || "");
  const [description, setDescription] = useState(provider?.description || "");
  const [city, setCity] = useState(provider?.location?.city || "");
  const [state, setState] = useState(provider?.location?.state || "");

  // Image management
  const [existingImages, setExistingImages] = useState(provider?.images || []);
  const [selectedNewImages, setSelectedNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Handle delete existing image
  const handleDeleteExistingImage = (publicId) => {
    // Add to deletion queue
    setImagesToDelete((prev) => [...prev, publicId]);
    // Remove from display
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  // Handle undo delete
  const handleUndoDelete = (publicId) => {
    const originalImage = provider?.images.find((img) => img.publicId === publicId);
    if (originalImage) {
      setImagesToDelete((prev) => prev.filter((id) => id !== publicId));
      setExistingImages((prev) => [...prev, originalImage]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    if (!city.trim()) {
      errors.city = "City is required";
    }
    if (!state.trim()) {
      errors.state = "State is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});
      setSuccessMessage("");

      // Step 1: Update provider details
      const updateData = {
        businessName: businessName.trim(),
        description: description.trim(),
        location: {
          city: city.trim(),
          state: state.trim(),
        },
      };

      await updateProviderApi(updateData);

      // Step 2: Delete images if any marked for deletion
      if (imagesToDelete.length > 0) {
        for (const publicId of imagesToDelete) {
          try {
            await deleteProviderImageApi(publicId);
          } catch (deleteError) {
            console.error(`Failed to delete image ${publicId}:`, deleteError);
            setError(`Failed to delete some images. Please try again.`);
          }
        }
      }

      // Step 3: Upload new images if any selected
      if (selectedNewImages.length > 0) {
        try {
          await uploadProviderImagesApi(selectedNewImages);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setError("Provider updated but image upload failed. Please try again.");
        }
      }

      setSuccessMessage("Provider updated successfully!");
      
      // Clear state
      setImagesToDelete([]);
      setSelectedNewImages([]);

      // Notify parent and close
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update provider");
    } finally {
      setLoading(false);
    }
  };

  const maxImages = 4;
  const totalCurrentImages = existingImages.length + selectedNewImages.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Your Service
          </h2>
          <p className="text-gray-600">
            Update your service details and manage images
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-800 ${
                  fieldErrors.businessName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>
            {fieldErrors.businessName && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.businessName}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Service Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-800 resize-none ${
                  fieldErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows={4}
              />
            </div>
            {fieldErrors.description && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.description}
              </p>
            )}
          </div>

          {/* ============ IMAGE MANAGEMENT SECTION ============ */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
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

          {/* Location Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MapPinned className="w-5 h-5 text-green-600" />
              Service Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-800 ${
                    fieldErrors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.city && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span>•</span> {fieldErrors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-800 ${
                    fieldErrors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.state && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span>•</span> {fieldErrors.state}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProviderForm;
