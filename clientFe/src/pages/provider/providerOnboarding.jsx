import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth.js";
import ProviderForm from "../../components/providers/providerForm.jsx";
const ProviderOnboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login?redirect=/provider/onboarding");
      return;
    }

    if (user.role === "provider") {
      navigate("/provider/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Become a Service Provider
      </h1>

      <ProviderForm/>
    </div>
  );
};

export default ProviderOnboarding;
