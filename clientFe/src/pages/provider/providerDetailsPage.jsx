import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProviderByIdApi } from "../../api/provider.api.js";
import ProviderDetailsSkeleton from "../../components/providers/providerDetailsSkeleton.jsx";
import ProviderHeader from "../../components/providers/providerHeader.jsx";
import ProviderHero from "../../components/providers/providerHero.jsx";
import ImageCarousel from "../../components/common/imageCarousel.jsx";
import ReviewSection from "../../components/providers/reviewSection.jsx";
import ServicePackages from "../../components/providers/servicePackage.jsx";
import ContactModal from "../../components/providers/contactSection.jsx";
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
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <ProviderHero provider={provider} />

        {/* Image Carousel Gallery */}
        {provider.images && provider.images.length > 0 && (
          <ImageCarousel images={provider.images} title="Portfolio & Photos" />
        )}

        {/* About Section */}
        {provider.description && (
          <section className="py-12 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
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

        {/* CTA Section - SINGLE BUTTON */}
        <section className="py-12 text-center border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ready to get started?
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Contact {provider.businessName} today
          </p>
          <button
            onClick={() => setShowContact(true)}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors inline-block"
          >
            Contact & Book
          </button>
        </section>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactModal
          provider={provider}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
};

export default ProviderDetails;
