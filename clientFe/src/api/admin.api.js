import axios from './axios.js';

// ============ DASHBOARD ============

export const getDashboardStatsApi = async () => {
  const { data } = await axios.get('/admin/stats');
  return data;
};

// ============ USER MANAGEMENT ============

export const getAllUsersApi = async (params) => {
  const { data } = await axios.get('/admin/users', { params });
  return data;
};

export const updateUserRoleApi = async (userId, role) => {
  const { data } = await axios.patch(`/admin/users/${userId}/role`, { role });
  return data;
};

export const deleteUserApi = async (userId) => {
  const { data } = await axios.delete(`/admin/users/${userId}`);
  return data;
};

// ============ PROVIDER MANAGEMENT ============

export const getAllProvidersApi = async (params) => {
  const { data } = await axios.get('/admin/providers', { params });
  return data;
};

export const updateProviderStatusApi = async (providerId, isActive) => {
  const { data } = await axios.patch(`/admin/providers/${providerId}/status`, { isActive });
  return data;
};

export const deleteProviderApi = async (providerId) => {
  const { data } = await axios.delete(`/admin/providers/${providerId}`);
  return data;
};

// ============ BOOKING MANAGEMENT ============

export const getAllBookingsApi = async (params) => {
  const { data } = await axios.get('/admin/bookings', { params });
  return data;
};

// ============ CATEGORY MANAGEMENT ============

export const getAdminCategoriesApi = async () => {
  const { data } = await axios.get('/admin/categories');
  return data;
};

export const updateCategoryApi = async (categoryId, name) => {
  const { data } = await axios.put(`/admin/categories/${categoryId}`, { name });
  return data;
};

export const deleteCategoryApi = async (categoryId) => {
  const { data } = await axios.delete(`/admin/categories/${categoryId}`);
  return data;
};

export const updateSubCategoryApi = async (categoryId, subId, name) => {
  const { data } = await axios.put(`/admin/categories/${categoryId}/subcategories/${subId}`, { name });
  return data;
};

export const deleteSubCategoryApi = async (categoryId, subId) => {
  const { data } = await axios.delete(`/admin/categories/${categoryId}/subcategories/${subId}`);
  return data;
};