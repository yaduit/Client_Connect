import { useState, useEffect } from "react";
import { getCategoryBySlugApi } from "../api/categories.api.js";

/**
 * Hook to fetch a single category by slug with subcategories
 * @param {string} slug - Category slug
 * @returns {object} { category, loading, error, refetch }
 */
export const useCategoryDetails = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!slug) {
      setError("Category slug is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCategoryBySlugApi(slug);
      setCategory(data);
    } catch (err) {
      setError(err.message || "Failed to load category");
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
    refetch: fetchCategory
  };
};