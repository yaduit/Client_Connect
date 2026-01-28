import { Link } from "react-router-dom";
import { Zap, CheckCircle, Star, ArrowRight } from "lucide-react";

const ProviderEmptyState = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Main Container */}
        <div className="text-center mb-12">
          {/* Illustration */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full blur-2xl opacity-60"></div>
            <div className="relative bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl w-full h-full flex items-center justify-center border border-emerald-200 shadow-lg">
              <Zap className="w-16 h-16 text-emerald-600 animate-bounce" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Ready to earn?
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
            Publish your first service and start receiving customers. Your journey to success begins here.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Easy Setup</h3>
            <p className="text-sm text-slate-600">
              Fill out a simple form and publish your service in minutes.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Build Trust</h3>
            <p className="text-sm text-slate-600">
              Get reviews and ratings to build your professional reputation.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Earn Money</h3>
            <p className="text-sm text-slate-600">
              Start earning from customer bookings immediately.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Link
            to="/provider/onboarding"
            className="block w-full py-4 px-6 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
          >
            Publish Your First Service
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => {
              // Could open help modal or scroll to FAQ
              console.log("Help clicked");
            }}
            className="block w-full py-4 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 font-semibold text-lg"
          >
            Learn More
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-2xl border border-blue-200 p-6 sm:p-8">
          <h4 className="font-semibold text-slate-900 mb-3">✨ Pro Tips</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Use clear, professional photos to attract more customers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Write a detailed service description with pricing</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span>Enable notifications to respond quickly to inquiries</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProviderEmptyState;