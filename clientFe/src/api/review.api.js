import api from "./axios";

/**
 * Create a new review for a provider
 * @param {Object} data - { providerId, rating, title, description }
 */
export const createReviewApi = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

/**
 * Get all reviews for a provider
 * @param {string} providerId - Provider ID
 */
export const getProviderReviewsApi = async (providerId) => {
  const response = await api.get(`/providers/${providerId}/reviews`);
  return response.data;
};

/**
 * Get all reviews by the logged-in user
 */
export const getMyReviewsApi = async () => {
  const response = await api.get("/reviews/me");
  return response.data;
};

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {Object} data - { rating, title, description }
 */
export const updateReviewApi = async (reviewId, data) => {
  const response = await api.patch(`/reviews/${reviewId}`, data);
  return response.data;
};

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 */
export const deleteReviewApi = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};
