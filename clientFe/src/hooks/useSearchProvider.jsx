import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchProvidersApi } from "../api/search.api.js";

export const useSearchProviders = () => {
  const location = useLocation();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const hasValidFilters = (filters) => {
    return (
      (filters.lat && filters.lng) ||
      filters.categoryId ||
      filters.subCategorySlug
    );
  };

  const search = async (filters, pageNumber = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const data = await searchProvidersApi({
        ...filters,
        page: pageNumber
      });

      setProviders((prev) =>
        reset || pageNumber === 1
          ? data.providers
          : [...prev, ...data.providers]
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

    if (!hasValidFilters(filters)) return;

    setPage(1);
    search(filters, 1, true);
  }, [location.search]);

  return {
    providers,
    loading,
    error,
    page,
    setPage,
    search
  };
};
