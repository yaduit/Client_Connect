import { Link } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  Star,
  Clock,
  Edit3,
  EyeOff,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import ProviderServiceCard from "../../components/providers/providerServiceCard.jsx";
import ProviderEmptyState from "../../components/providers/providerEmptyState.jsx";
import StatCard from "../../components/providers/statCard.jsx";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";

const ProviderDashboard = () => {
  const { provider, loading, error } = useMyProviderService();

  /* ============ LOADING STATE ============ */
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

  /* ============ ERROR STATE ============ */
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

  /* ============ EMPTY STATE ============ */
  if (!provider) {
    return <ProviderEmptyState/>;
  }

  // Mock stats - replace with real data from API
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
            <Link
              to="/provider/edit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg active:scale-95 font-medium text-sm sm:text-base whitespace-nowrap"
            >
              <Edit3 className="w-4 h-4" />
              Edit Service
            </Link>
          </div>
        </div>

        {/* ============ STATS GRID ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* ============ SERVICE CARD SECTION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Service Card - Full Width on Mobile */}
          <div className="lg:col-span-2">
            <ProviderServiceCard provider={provider} />
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
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  provider.isActive
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {provider.isActive ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Reactivate
                  </>
                )}
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
                  Services with complete profiles get 3x more inquiries. Consider adding more details!
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
                  Add high-quality photos to boost views
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
    </div>
  );
};

export default ProviderDashboard;