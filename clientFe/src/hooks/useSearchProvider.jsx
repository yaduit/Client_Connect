import { useState } from "react";
import { searchProvidersApi } from "../api/search.api.js";

export const useSearchProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const search = async (filters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchProvidersApi({
        ...filters,
        page
      });

      setProviders(prev =>
        page === 1 ? data.providers : [...prev, ...data.providers]
      );

    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    providers,
    loading,
    error,
    search,
    page,
    setPage
  };
};
