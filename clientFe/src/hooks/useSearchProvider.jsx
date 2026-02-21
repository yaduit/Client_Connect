import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchProvidersApi } from "../api/search.api.js";

export const useSearchProviders = () => {
  const location = useLocation();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(null);

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

    let lat = params.get('lat');
    let lng = params.get('lng');
    if (!lat || !lng) {
      const saved = JSON.parse(localStorage.getItem("lastLocation"));
      if (saved) {
        lat = saved.lat;
        lng = saved.lng;
      }
    }

    const filters = {
      lat,
      lng,
      radius: params.get("radius") || 10,
      categoryId: params.get("categoryId"),
      subCategorySlug: params.get("subCategorySlug"),
      sort: params.get("sort")
    };

    if (!hasValidFilters(filters)) {
      setError('Please provide a location or select a category/subcategory');
      setProviders([]);
      return;
    }

    // Save filters for pagination use
    setFilters(filters);
    setPage(1);
    search(filters, 1, true);

  }, [location.search]);

  // Fetch additional pages when `page` changes
  useEffect(() => {
    if (page === 1) return;
    if (!filters) return;
    search(filters, page, false);
  }, [page]);

  return {
    providers,
    loading,
    error,
    page,
    setPage,
    search
  };

}
