import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  Star,
  Clock,
  Edit3,
  Plus,
  TrendingUp,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";
import ProviderServiceCard from "../../components/providers/providerServiceCard.jsx";
import ProviderEmptyState from "../../components/providers/providerEmptyState.jsx";
import StatCard from "../../components/providers/statCard.jsx";
import EditProviderModal from "../../components/providers/editProviderModel.jsx";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";
import { deleteProviderImageApi } from "../../api/provider.api.js";

const ProviderDashboard = () => {
  // ============ STATE ============
  const { provider, loading, error, setProvider, refetch } = useMyProviderService();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ============ ERROR STATE ============
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============ EMPTY STATE ============
  if (!provider) {
    return <ProviderEmptyState />;
  }

  // ============ HANDLERS ============
  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = (updatedProvider) => {
    setProvider(updatedProvider);
    setIsEditModalOpen(false);
    // Refetch to get latest data
    refetch();
  };

  const handleStatusChange = (updatedProvider) => {
    setProvider(updatedProvider);
  };

  // Handle delete image
  const handleDeleteImage = async (publicId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setDeletingImageId(publicId);
      setDeleteError(null);

      const response = await deleteProviderImageApi(publicId);

      // Update provider with new images
      setProvider(response.provider);

      // Show success toast or message
      alert("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      setDeleteError(err.message || "Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  // ============ STATS DATA ============
  const stats = [
    {
      icon: Eye,
      label: "Total Views",
      value: provider.totalViews || "0",
      color: "emerald",
      trend: provider.viewsTrend || "+12%",
    },
    {
      icon: MessageSquare,
      label: "Inquiries",
      value: provider.totalInquiries || "0",
      color: "blue",
      trend: provider.inquiriesTrend || "+5%",
    },
    {
      icon: Star,
      label: "Rating",
      value: provider.ratingAverage || "0",
      suffix: "⭐",
      color: "amber",
      reviews: provider.totalReviews || "0",
    },
    {
      icon: TrendingUp,
      label: "Bookings",
      value: provider.totalBookings || "0",
      color: "purple",
      trend: provider.bookingsTrend || "+8%",
    },
  ];

  const images = provider.images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* ============ HEADER SECTION ============ */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {provider.businessName}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                You're all set! Manage your service, track performance, and grow your business.
              </p>
            </div>
            <button
              onClick={handleEditModalOpen}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              Edit Service
            </button>
          </div>
        </div>

        {/* ============ STATS GRID ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* ============ IMAGE GALLERY SECTION ============ */}
        {hasImages && (
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                  Service Images ({images.length}/4)
                </h3>
                {images.length < 4 && (
                  <button
                    onClick={handleEditModalOpen}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Image
                  </button>
                )}
              </div>

              {/* Delete Error */}
              {deleteError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{deleteError}</p>
                </div>
              )}

              {/* Image Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, idx) => (
                  <div
                    key={image.publicId}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-50 group cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setShowImageModal(true);
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Service image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-center">
                        <p className="text-xs font-medium mb-2">Click to view</p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.publicId);
                      }}
                      disabled={deletingImageId === image.publicId}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                      title="Delete image"
                    >
                      {deletingImageId === image.publicId ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Image Number Badge */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-2 py-2">
                      <p className="text-xs text-white font-medium">{idx + 1}/{images.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============ SERVICE CARD SECTION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Service Card - Full Width on Mobile */}
          <div className="lg:col-span-2">
            <ProviderServiceCard 
              provider={provider}
              onStatusChange={handleStatusChange}
              onEditClick={handleEditModalOpen}
            />
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
              Quick Actions
            </h3>

            {/* Service Status */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-sm text-slate-600 font-medium mb-2">Service Status</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    provider.isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                ></div>
                <span className="font-semibold text-slate-900">
                  {provider.isActive ? "Active & Visible" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {provider.isActive
                  ? "Your service is live and discoverable"
                  : "Your service is hidden from customers"}
              </p>
            </div>

            {/* Performance Insights */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-sm text-slate-600 font-medium mb-3">Performance</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Response Time</span>
                  <span className="font-semibold text-emerald-600">
                    {provider.avgResponseTime || "2h"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-semibold text-emerald-600">
                    {provider.completionRate || "98%"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleEditModalOpen}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  provider.isActive
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit Details
              </button>

              <Link
                to="/provider/services/new"
                className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </Link>
            </div>

            {/* Help Tip */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-xs font-medium text-blue-900 mb-1">💡 Tip</p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Services with {images.length < 4 ? '4 high-quality photos' : 'complete profiles'} get 3x more inquiries!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ============ ADDITIONAL INFO SECTION ============ */}
        <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              Recent Activity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">New inquiry from Sarah M.</span>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">5-star review added</span>
                <span className="text-xs text-slate-500">1d ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Service view spike</span>
                <span className="text-xs text-slate-500">3d ago</span>
              </div>
            </div>
          </div>

          {/* Growth Tips */}
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-sm border border-emerald-200 p-6 sm:p-7">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Grow Your Business
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-slate-700">
                  Respond to inquiries within 2 hours
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-slate-700">
                  {images.length < 4 ? 'Add more high-quality photos' : 'Keep your photos updated'}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-slate-700">
                  Maintain 5-star service quality
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ EDIT MODAL ============ */}
      <EditProviderModal
        provider={provider}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditSuccess}
      />

      {/* ============ IMAGE PREVIEW MODAL ============ */}
      {showImageModal && images[selectedImageIndex] && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={images[selectedImageIndex].url}
              alt={`Service image ${selectedImageIndex + 1}`}
              className="w-full h-auto max-h-96 object-cover rounded-lg"
            />

            {/* Image Counter */}
            <div className="text-center mt-4 text-slate-600">
              {selectedImageIndex + 1} of {images.length}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 justify-center mt-4 mb-4">
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;