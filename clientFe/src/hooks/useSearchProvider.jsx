import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchProvidersApi } from "../api/search.api.js";

export const useSearchProviders = () => {
  const location = useLocation();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchProviders = async (filters, resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchProvidersApi({
        ...filters,
        page
      });

      setProviders(prev =>
        resetPage || page === 1 ? data.providers : [...prev, ...data.providers]
      );

    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const filters = {
      lat: params.get("lat"),
      lng: params.get("lng"),
      radius: params.get("radius"),
      categoryId: params.get("categoryId"),
      subCategorySlug: params.get("subCategorySlug"),
      sort: params.get("sort")
    };

    // reset providers when filters change
    setPage(1);
    fetchProviders(filters, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return {
    providers,
    loading,
    error,
    page,
    setPage,
    fetchProviders
  };
};
