import { useEffect, useState } from "react";
import { getProviderByIdApi } from "../api/provider.api.js";

export const useMyProviderService = () => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderByIdApi();
        setProvider(data.provider);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, []);

  return { provider, loading, error };
};
