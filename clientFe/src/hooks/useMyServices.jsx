import { useEffect, useState } from 'react';
import { getMyServicesApi } from '../api/services.api.js';

export const useMyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyServicesApi();
      if (!res || !res.services) {
        setServices([]);
        return;
      }
      setServices(res.services);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    setServices,
    loading,
    error,
    refetch: fetchServices
  };
};