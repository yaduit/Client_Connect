import api from "./axios";

// ============ EXISTING ENDPOINTS ============

export const registerProviderApi = async (data) => {
  const res = await api.post("/providers/register", data);
  return res.data;
};

export const getProviderByIdApi = async (id) => {
  const res = await api.get(`/providers/${id}`);
  return res.data;
};

export const getMyProviderApi = async () => {
  const res = await api.get("/providers/me");
  return res.data;
};

// ============ NEW ENDPOINTS ============

/**
 * Toggle provider service active status
 * @param {boolean} isActive - New status
 * @returns {Promise} - Updated provider object
 */
export const toggleProviderStatusApi = async (isActive) => {
  const res = await api.patch("/providers/me/status", { isActive });
  return res.data;
};

/**
 * Update provider profile (businessName, description, location)
 * @param {Object} data - Fields to update
 * @returns {Promise} - Updated provider object
 */
export const updateProviderApi = async (data) => {
  const res = await api.patch("/providers/me", data);
  return res.data;
};

/**
 * Deactivate provider service
 * @returns {Promise} - Updated provider object
 */
export const deactivateProviderApi = async () => {
  const res = await api.put("/providers/deactivate");
  return res.data;
};

/**
 * Activate provider service
 * @returns {Promise} - Updated provider object
 */
export const activateProviderApi = async () => {
  const res = await api.put("/providers/activate");
  return res.data;
};