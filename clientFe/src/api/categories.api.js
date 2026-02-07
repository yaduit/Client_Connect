import api from './axios.js'

/**
 * Get all categories with subcategories
 * Used on: Homepage, filter dropdowns
 */
export const getCategoriesApi = async () => {
    const res = await api.get('/categories')
    return res.data ;
};

/**
 * Get single category by slug with subcategories
 * Used on: Category detail page
 * @param {string} slug - Category slug (e.g., "cleaning", "home-repair")
 * @returns {object} Category with subcategories
 */
export const getCategoryBySlugApi = async (slug) => {
    const res = await api.get(`/categories/${slug}`);
    return res.data;
};

// Add to existing categories.api.js

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data;
};

export const addSubCategory = async (categoryId, payload) => {
  const { data } = await api.post(`/categories/${categoryId}/subcategories`, payload);
  return data;
};