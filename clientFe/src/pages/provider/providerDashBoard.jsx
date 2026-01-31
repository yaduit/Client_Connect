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
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";
import { useMyServices } from "../../hooks/useMyServices.jsx";
import {useMyBookings} from "../../hooks/useMyBookings.js"
import { toggleProviderStatusApi } from "../../api/provider.api.js";

// Components
import EditProviderModal from "../../components/providers/editProviderModel.jsx";
import ServiceModal from "../../components/services/serviceModal.jsx";
import ServiceCard from "../../components/services/serviceCard.jsx";
import BookingCard from "../../components/bookings/bookingCard.jsx";

const ProviderDashboard = () => {
  // ============ HOOKS ============
  const { provider, loading, error, setProvider, refetch } = useMyProviderService();
  const { services, setServices, loading: servicesLoading, refetch: refetchServices } = useMyServices();
  const { bookings, setBookings, loading: bookingsLoading, refetch: refetchBookings } = useMyBookings();

  // ============ MODAL STATES ============
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("services"); // services | bookings | analytics

  // ============ ACTION STATES ============
  const [statusLoading, setStatusLoading] = useState(false);

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

  // ============ HELPER FUNCTIONS ============
  const images = provider?.images || [];
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;

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
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
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
                {provider.location?.city}, {provider.location?.state}
              </p>
            </div>
            {provider ? (
              <Link
                to={`/providers/${provider._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition font-medium text-sm"
              >
                <Eye className="w-4 h-4" />
                View Public Profile
              </Link>
            ) : null}
          </div>

          {/* Status Badge & Info */}
          <div className="flex flex-wrap items-center gap-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                provider.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${provider.isActive ? "bg-emerald-600" : "bg-gray-400"}`}></span>
              {provider.isActive ? "Active & Visible" : "Inactive"}
            </span>

            <button
              onClick={handleStatusToggle}
              disabled={statusLoading}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                provider.isActive
                  ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              {statusLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Power className="w-4 h-4" />
              )}
              {provider.isActive ? "Disable Service" : "Enable Service"}
            </button>
          </div>
        </div>

        {/* ============ METRICS SECTION ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active listings</p>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Power className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.isActive).length}</p>
            <p className="text-xs text-gray-500 mt-1">Live & visible</p>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Upcoming</p>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Views</p>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.totalViews || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Profile views</p>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-pink-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{provider.totalInquiries || 0}</p>
            <p className="text-xs text-gray-500 mt-1">Requests</p>
          </div>
        </div>

        {/* ============ PENDING BOOKINGS ALERT ============ */}
        {pendingBookings > 0 && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Pending Bookings</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have {pendingBookings} booking{pendingBookings > 1 ? 's' : ''} waiting for your response.
              </p>
            </div>
          </div>
        )}

        {/* ============ TABS ============ */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-4 font-medium transition-colors border-b-2 ${
                activeTab === "services"
                  ? "text-emerald-600 border-emerald-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              My Services
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-4 font-medium transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "bookings"
                  ? "text-emerald-600 border-emerald-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Upcoming Bookings
              {pendingBookings > 0 && (
                <span className="bg-yellow-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingBookings}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-4 font-medium transition-colors border-b-2 ${
                activeTab === "analytics"
                  ? "text-emerald-600 border-emerald-600"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* ============ SERVICES TAB ============ */}
        {activeTab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">My Services</h3>
              <button
                onClick={() => {
                  setIsCreateServiceOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            {servicesLoading ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h4>
                <p className="text-gray-600 mb-6">Start by creating your first service to begin receiving customer inquiries</p>
                <button
                  onClick={() => {
                    setIsCreateServiceOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <ServiceCard
                    key={svc._id}
                    service={svc}
                    onEdit={() => {
                      setIsCreateServiceOpen(true);
                    }}
                    onDelete={(serviceId) => {
                      setServices((prev) => prev.filter(s => s._id !== serviceId));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============ BOOKINGS TAB ============ */}
        {activeTab === "bookings" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Bookings</h3>

            {bookingsLoading ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Bookings</h4>
                <p className="text-gray-600">Bookings will appear here when seekers request your services</p>
              </div>
            ) : (
              <>
                {/* Booking Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-700 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingBookings}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-700 font-medium">Confirmed</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{confirmedBookings}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-emerald-700 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">{completedBookings}</p>
                  </div>
                </div>

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onStatusChange={(updatedBooking) => {
                        setBookings((prev) =>
                          prev.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
                        );
                        refetchBookings();
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============ ANALYTICS TAB ============ */}
        {activeTab === "analytics" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overview Cards */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.ratingAverage || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.totalReviews || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.completionRate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Time</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.avgResponseTime || "—"}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Service Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Services</span>
                    <span className="text-2xl font-bold text-gray-900">{services.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Active Services</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {services.filter(s => s.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.totalBookings || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Profile Views</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {provider.totalViews || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Tips to Improve Performance</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>✓ Keep your profile updated with recent photos</li>
                <li>✓ Respond quickly to booking requests (within 2 hours)</li>
                <li>✓ Maintain a 4.5+ star rating by providing excellent service</li>
                <li>✓ Add detailed descriptions to each service</li>
                <li>✓ Keep your service prices competitive</li>
              </ul>
            </div>
          </div>
        )}
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

      <ServiceModal
        isOpen={isCreateServiceOpen}
        onClose={() => setIsCreateServiceOpen(false)}
        onSuccess={(created) => {
          setServices((prev) => [created, ...prev]);
          setIsCreateServiceOpen(false);
          refetchServices();
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