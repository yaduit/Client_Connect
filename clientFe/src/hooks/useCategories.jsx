import { useState, useEffect } from "react";
import { getCategoriesApi } from "../api/categories.api.js";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ CHANGED: true instead of false
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategoriesApi();
        setCategories(data);
        setError(null); // ✅ ADDED: Clear errors on success
      } catch (err) {
        console.error('Failed to load categories:', err); // ✅ FIXED: Proper error logging
        setError('Failed to load categories');
        setCategories([]); // ✅ ADDED: Clear categories on error
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};
