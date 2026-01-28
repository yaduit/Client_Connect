import { useEffect, useState } from "react";
import { getMyProviderApi } from "../api/provider.api.js";

/**
 * Hook to fetch authenticated user's provider profile
 * 
 * @returns {Object} { provider, loading, error, refetch }
 * 
 * @example
 * const { provider, loading, error } = useMyProviderService();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * if (!provider) return <EmptyState />;
 * 
 * return <ProviderDashboard provider={provider} />;
 */
export const useMyProviderService = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch provider data from API
   */
  const fetchProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMyProviderApi();
      
      // Validate response data
      if (!response || !response.provider) {
        setProvider(null);
        setError("Invalid response from server");
        return;
      }
      
      setProvider(response.provider);
    } catch (err) {
      console.error("Error fetching provider:", err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("Provider profile not found");
        setProvider(null);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to load provider profile");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch provider data on component mount
   */
  useEffect(() => {
    fetchProvider();
  }, []);

  /**
   * Return hook state and refetch function
   */
  return {
    provider,
    loading,
    error,
    refetch: fetchProvider, // Allow manual refetch
  };
};