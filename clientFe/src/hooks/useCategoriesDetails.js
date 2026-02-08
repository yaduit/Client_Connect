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
      
      // ✅ IMPROVED: Handle different response formats
      if (data && typeof data === 'object') {
        setCategory(data);
      } else {
        throw new Error('Invalid category data received');
      }
    } catch (err) {
      console.error('Category fetch error:', err);
      
      // ✅ IMPROVED: Better error message extraction
      let errorMessage = 'Failed to load category';
      
      if (err.response) {
        // API returned an error response
        if (err.response.status === 404) {
          errorMessage = 'Category not found';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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