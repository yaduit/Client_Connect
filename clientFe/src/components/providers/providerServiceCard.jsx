import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  MapPin,
  Sparkles,
  Loader,
} from "lucide-react";
import { toggleProviderStatusApi } from "../../api/provider.api";

const ProviderServiceCard = ({ provider, onStatusChange, onEditClick }) => {
  // ============ STATE ============
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [toggleError, setToggleError] = useState("");
  const [localIsActive, setLocalIsActive] = useState(provider?.isActive);

  const images = provider.images || [];
  const coverImage =
    images.length > 0
      ? images[0]
      : "https://via.placeholder.com/600x400?text=Service+Image";

  // ============ HANDLERS ============
  const handleToggleStatus = async () => {
    setIsTogglingStatus(true);
    setToggleError("");

    try {
      // Optimistic update
      const newStatus = !localIsActive;
      setLocalIsActive(newStatus);

      // Call API
      const response = await toggleProviderStatusApi(newStatus);

      if (response.success) {
        // Call parent callback if provided
        onStatusChange?.(response.provider);
      } else {
        // Revert on error
        setLocalIsActive(!newStatus);
        setToggleError(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      // Revert on error
      setLocalIsActive(provider?.isActive);
      setToggleError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update service status",
      );
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-slate-300">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 sm:h-56 lg:h-64 bg-linear-to-br from-slate-200 to-slate-300">
        <img
          src={coverImage}
          alt={provider.businessName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
              localIsActive
                ? "bg-emerald-500/90 text-white"
                : "bg-slate-500/90 text-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                localIsActive ? "bg-white" : "bg-slate-300"
              }`}
            ></div>
            {localIsActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Premium Badge (if applicable) */}
        {provider.isPremium && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/90 text-white backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Premium
            </div>
          </div>
        )}

        {/* Image Count Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-md">
            {images.length} Photos
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 lg:p-7">
        {/* Service Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 line-clamp-2">
          {provider.businessName}
        </h3>

        {/* Category & Subcategory */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg">
            {provider.categoryId?.name || "Service"}
          </span>
          {provider.subCategorySlug && (
            <span className="text-xs sm:text-sm text-slate-600">
              • {provider.subCategorySlug}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-600 mb-5 text-sm sm:text-base">
          <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
          <span>
            {provider.location?.city}, {provider.location?.state}
          </span>
        </div>

        {/* Rating Section */}
        {provider.ratingAverage && (
          <div className="mb-5 pb-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.round(provider.ratingAverage)
                          ? "text-amber-400"
                          : "text-slate-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-bold text-slate-900 ml-2">
                  {provider.ratingAverage}
                </span>
              </div>
              {provider.totalReviews && (
                <span className="text-sm text-slate-600">
                  {provider.totalReviews}{" "}
                  {provider.totalReviews === 1 ? "review" : "reviews"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats Mini Row */}
        <div className="grid grid-cols-3 gap-3 mb-6 py-5 border-t border-b border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Views
            </p>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">
              {provider.totalViews || "0"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Inquiries
            </p>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">
              {provider.totalInquiries || "0"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Bookings
            </p>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-1">
              {provider.totalBookings || "0"}
            </p>
          </div>
        </div>

        {/* Toggle Error Alert */}
        {toggleError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-700">{toggleError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          <button
            onClick={() => onEditClick?.()}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <a
            href={`/service/${provider.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </a>

          <button
            onClick={handleToggleStatus}
            disabled={isTogglingStatus}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              localIsActive
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            {isTogglingStatus ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>
              {isTogglingStatus
                ? "..."
                : localIsActive
                  ? "Deactivate"
                  : "Reactivate"}
            </span>
          </button>
        </div>

        {/* Last Updated Info */}
        <p className="text-xs text-slate-500 mt-4 text-center">
          Last updated{" "}
          {provider.updatedAt
            ? new Date(provider.updatedAt).toLocaleDateString()
            : "recently"}
        </p>
      </div>
    </div>
  );
};

export default ProviderServiceCard;
