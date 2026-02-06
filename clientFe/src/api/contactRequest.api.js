import api from './axios.js';

/**
 * Create a new contact request
 * @param {Object} data - { providerId, message, contactDetails: { name, email, phone } }
 */
export const createContactRequestApi = async (data) => {
  const response = await api.post('/contact-requests', data);
  return response.data;
};

/**
 * Get all contact requests for the logged-in provider
 */
export const getProviderContactRequestsApi = async () => {
  const response = await api.get('/contact-requests/provider');
  return response.data;
};

/**
 * Accept a contact request
 * @param {string} requestId - Contact request ID
 */
export const acceptContactRequestApi = async (requestId) => {
  const response = await api.patch(`/contact-requests/${requestId}/accept`);
  return response.data;
};

/**
 * Reject a contact request
 * @param {string} requestId - Contact request ID
 */
export const rejectContactRequestApi = async (requestId) => {
  const response = await api.patch(`/contact-requests/${requestId}/reject`);
  return response.data;
};