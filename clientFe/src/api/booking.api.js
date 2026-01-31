import api from './axios';

/**
 * Create a new booking
 * @param {Object} data
 *   - serviceId: string
 *   - bookingDate: Date
 *   - bookingTime: string (e.g., "10:30 AM")
 *   - duration: number (in minutes)
 *   - notes: string (optional)
 */
export const createBookingApi = async (data) => {
  const res = await api.post('/bookings', data);
  return res.data;
};

/**
 * Get provider's upcoming bookings
 * @returns { success, bookings[], total }
 */
export const getMyBookingsApi = async () => {
  const res = await api.get('/bookings/me');
  return res.data;
};

/**
 * Get bookings filtered by status
 * @param {string} status - 'pending' | 'confirmed' | 'completed' | 'cancelled'
 * @returns { success, status, bookings[], total }
 */
export const getBookingsByStatusApi = async (status) => {
  const res = await api.get('/bookings', { params: { status } });
  return res.data;
};

/**
 * Get specific booking details
 * @param {string} bookingId
 */
export const getBookingByIdApi = async (bookingId) => {
  const res = await api.get(`/bookings/${bookingId}`);
  return res.data;
};

/**
 * Update booking status (provider action)
 * @param {string} bookingId
 * @param {Object} data
 *   - status: 'confirmed' | 'completed' | 'cancelled'
 *   - reason: string (optional, for cancellation)
 */
export const updateBookingStatusApi = async (bookingId, data) => {
  const res = await api.patch(`/bookings/${bookingId}/status`, data);
  return res.data;
};

/**
 * Accept a pending booking (shorthand)
 */
export const acceptBookingApi = async (bookingId) => {
  return updateBookingStatusApi(bookingId, { status: 'confirmed' });
};

/**
 * Reject/Cancel a booking
 */
export const rejectBookingApi = async (bookingId, reason = '') => {
  return updateBookingStatusApi(bookingId, { status: 'cancelled', reason });
};

/**
 * Mark booking as completed
 */
export const completeBookingApi = async (bookingId) => {
  return updateBookingStatusApi(bookingId, { status: 'completed' });
};