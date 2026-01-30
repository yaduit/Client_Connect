import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Eye,
  MessageSquare,
  TrendingUp,
  Plus,
  AlertCircle,
  Loader2,
  Edit3,
  Power,
  Trash2,
  X,
} from "lucide-react";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";
import { toggleProviderStatusApi, deleteProviderImageApi } from "../../api/provider.api.js";
import EditProviderModal from "../../components/providers/editProviderModel.jsx";

const ProviderDashboard = () => {
  const { provider, loading, error, setProvider, refetch } = useMyProviderService();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Action states
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteImageLoading, setDeleteImageLoading] = useState(null);

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ============ ERROR STATE ============
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-sm w-full text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============ EMPTY STATE ============
  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Provider Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please complete your provider registration</p>
          <Link
            to="/provider/onboarding"
            className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            Complete Registration
          </Link>
        </div>
      </div>
    );
  }

  // ============ HANDLERS ============
  const handleStatusToggle = async () => {
    setStatusLoading(true);
    try {
      const response = await toggleProviderStatusApi(!provider.isActive);
      if (response.success) {
        setProvider(response.provider);
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    if (!window.confirm("Delete this image? This action cannot be undone.")) return;

    setDeleteImageLoading(publicId);
    try {
      const response = await deleteProviderImageApi(publicId);
      if (response.success) {
        setProvider(response.provider);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image. Please try again.");
    } finally {
      setDeleteImageLoading(null);
    }
  };

  const images = provider.images || [];
  const hasServices = !!provider;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ NAVBAR ============ */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition font-medium text-sm"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-gray-900">Provider Dashboard</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ============ HEADER SECTION ============ */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{provider.businessName}</h2>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's your service overview.
              </p>
            </div>
            <Link
              to={`/providers/${provider._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition font-medium text-sm"
            >
              <Eye className="w-4 h-4" />
              View Public Profile
            </Link>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                provider.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${provider.isActive ? "bg-emerald-600" : "bg-gray-400"}`}></span>
              {provider.isActive ? "Active & Visible" : "Inactive"}
            </span>
            <p className="text-sm text-gray-600">
              {provider.location?.city}, {provider.location?.state}
            </p>
          </div>
        </div>

        {/* ============ STATS ROW ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500 mt-1">Your active listing</p>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Power className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.isActive ? 1 : 0}</p>
            <p className="text-xs text-gray-500 mt-1">{provider.isActive ? "Live and visible" : "Currently disabled"}</p>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Views</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.totalViews || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Total profile views</p>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.totalInquiries || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Customer requests</p>
          </div>
        </div>

        {/* ============ ACTIONS ROW ============ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* ✅ FIXED: Enable Add New Service button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
            <button
              onClick={handleStatusToggle}
              disabled={statusLoading}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition font-medium ${
                provider.isActive
                  ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {statusLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Power className="w-5 h-5" />
              )}
              {provider.isActive ? "Disable Service" : "Enable Service"}
            </button>
          </div>
        </div>

        {/* ============ MY SERVICES SECTION ============ */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">My Services</h3>

          {!hasServices ? (
            // Empty State
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h4>
              <p className="text-gray-600 mb-6">Start by creating your first service to begin receiving customer inquiries</p>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Service
              </button>
            </div>
          ) : (
            // Service Grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {/* Cover Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden group cursor-pointer">
                  {images.length > 0 ? (
                    <img
                      src={images[0].url}
                      alt={provider.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onClick={() => {
                        setSelectedImageIndex(0);
                        setShowImageModal(true);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Plus className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900">{provider.businessName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {provider.categoryId?.name} • {provider.subCategorySlug}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      provider.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {provider.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Location */}
                  {provider.location && (
                    <p className="text-sm text-gray-600 mb-4">
                      📍 {provider.location.city}, {provider.location.state}
                    </p>
                  )}

                  {/* Description */}
                  {provider.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{provider.description}</p>
                  )}

                  {/* Images Count */}
                  {images.length > 0 && (
                    <div className="mb-4 pb-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Images ({images.length}/4)
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, idx) => (
                          <div
                            key={image.publicId}
                            className="relative aspect-square rounded overflow-hidden border border-gray-200 group/img"
                          >
                            <img
                              src={image.url}
                              alt={`Service ${idx + 1}`}
                              className="w-full h-full object-cover group-hover/img:opacity-75 transition cursor-pointer"
                              onClick={() => {
                                setSelectedImageIndex(idx);
                                setShowImageModal(true);
                              }}
                            />
                            <button
                              onClick={() => handleDeleteImage(image.publicId)}
                              disabled={deleteImageLoading === image.publicId}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition opacity-0 hover:opacity-100 group-hover/img:opacity-100"
                              title="Delete image"
                            >
                              {deleteImageLoading === image.publicId ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5 text-white" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Views</p>
                      <p className="text-lg font-bold text-gray-900">{provider.totalViews || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Inquiries</p>
                      <p className="text-lg font-bold text-gray-900">{provider.totalInquiries || 0}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Rating</p>
                      <p className="text-lg font-bold text-gray-900">{provider.ratingAverage || "—"}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <Link
                      to={`/providers/${provider._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center justify-center gap-1 border border-gray-300"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-4">
                {/* Rating Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Rating</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${
                          i < Math.round(provider.ratingAverage || 0)
                            ? "text-amber-400"
                            : "text-gray-300"
                        }`}>★</span>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-gray-900">{provider.ratingAverage || "—"}</span>
                  </div>
                  <p className="text-sm text-gray-600">{provider.totalReviews || 0} reviews</p>
                </div>

                {/* Performance Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">Performance</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium text-gray-900">{provider.avgResponseTime || "—"}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium text-gray-900">{provider.completionRate || 0}%</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-medium text-gray-900">{provider.totalBookings || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                  <h5 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h5>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Keep your profile updated and professional</li>
                    <li>✓ Add high-quality service photos</li>
                    <li>✓ Respond quickly to inquiries</li>
                    <li>✓ Maintain excellent service quality</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ MODALS ============ */}
      <EditProviderModal
        provider={provider}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          setProvider(updated);
          setIsEditModalOpen(false);
          refetch();
        }}
      />

      {/* Image Preview Modal */}
      {showImageModal && images[selectedImageIndex] && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={images[selectedImageIndex].url}
              alt={`Service image ${selectedImageIndex + 1}`}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />

            <div className="flex gap-3 justify-center mt-4 mb-4 px-4">
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600 py-2">
                {selectedImageIndex + 1} / {images.length}
              </span>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;