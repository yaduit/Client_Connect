import { useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";
import { updateProviderApi } from "../../api/provider.api.js";

const EditProviderModal = ({ provider, isOpen, onClose, onSuccess }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      // Prepare update payload
      const updateData = {
        businessName: formData.businessName.trim(),
        description: formData.description.trim(),
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
        },
      };

      // Call API
      const response = await updateProviderApi(updateData);

      if (response.success) {
        // Call success callback with updated provider
        onSuccess(response.provider);
        
        // Reset form and close modal
        resetForm();
        onClose();
      } else {
        setSubmitError(response.message || "Failed to update provider");
      }
    } catch (error) {
      console.error("Error updating provider:", error);
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Edit Service Details
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