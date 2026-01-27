import ProviderServiceCard from "../../components/providers/providerServiceCard.jsx";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";

const ProviderDashBoard = () => {
  const { provider, loading, error } = useMyProviderService();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You haven’t published a service yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Provider Dashboard</h1>
      <ProviderServiceCard provider={provider} />
    </div>
  );
};

export default ProviderDashBoard;
