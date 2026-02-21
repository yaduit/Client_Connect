import { useState, useEffect } from 'react';
import { getProviderContactRequestsApi } from '../api/contactRequest.api.js';

export const useContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProviderContactRequestsApi();
      
      setRequests(data.requests);
      setStats({
        total: data.total,
        pending: data.pending,
        accepted: data.requests.filter(r => r.status === 'accepted').length,
        rejected: data.requests.filter(r => r.status === 'rejected').length
      });
    } catch (err) {
      console.error('Error fetching contact requests:', err);
      setError(err.response?.data?.message || 'Failed to load contact requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const refetch = () => {
    fetchRequests();
  };

  return {
    requests,
    setRequests,
    loading,
    error,
    stats,
    refetch
  };
};
