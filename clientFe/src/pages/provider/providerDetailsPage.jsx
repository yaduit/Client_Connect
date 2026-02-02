import{ useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProviderByIdApi } from "../../api/provider.api.js";
import ProviderDetailsSkeleton from "../../components/providers/providerDetailsSkeleton.jsx";
import ProviderHeader from "../../components/providers/providerHeader.jsx";
import ProviderHero from "../../components/providers/providerHero.jsx";
import ReviewSection from "../../components/providers/reviewSection.jsx";
import ServicePackages from "../../components/providers/servicePackage.jsx";
import ContactSection from "../../components/providers/contactSection.jsx";
import { AlertCircle } from "lucide-react";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderByIdApi(id);
        setProvider(data.provider);
      } catch (err) {
        console.error(err);
        setError("Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <ProviderDetailsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <ProviderHeader />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Provider Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProviderHeader onNavigate={() => navigate(-1)} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ProviderHero
          provider={provider}
          onContactClick={() => setShowContact(true)}
        />

        {/* About Section */}
        {provider.description && (
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {provider.description}
            </p>
          </section>
        )}

        {/* Services Section */}
        {provider.services && provider.services.length > 0 && (
          <ServicePackages services={provider.services} />
        )}

        {/* Reviews Section */}
        {provider.reviews && provider.reviews.length > 0 && (
          <ReviewSection reviews={provider.reviews} />
        )}

        {/* CTA Section */}
        <section className="py-12 text-center border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to book?
          </h2>
          <p className="text-gray-600 mb-6">
            Get started with {provider.businessName} today
          </p>
          <button
            onClick={() => setShowContact(true)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Contact & Book
          </button>
        </section>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactSection
          provider={provider}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
};

export default ProviderDetails;