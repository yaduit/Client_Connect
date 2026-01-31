import { useEffect, useState } from 'react';
import { getMyBookingsApi } from '../api/booking.api.js';

/**
 * Hook to fetch provider's upcoming bookings
 * 
 * @returns {Object} {
 *   bookings: Booking[],
 *   loading: boolean,
 *   error: string | null,
 *   refetch: () => Promise<void>
 * }
 * 
 * @example
 * const { bookings, loading, error } = useMyBookings();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return (
 *   <div>
 *     {bookings.map(booking => (
 *       <BookingCard key={booking._id} booking={booking} />
 *     ))}
 *   </div>
 * );
 */
export const useMyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch bookings from API
   */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMyBookingsApi();

      if (!response || !response.bookings) {
        setBookings([]);
        setError('Invalid response from server');
        return;
      }

      setBookings(response.bookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);

      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Provider profile not found');
        setBookings([]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch on component mount
   */
  useEffect(() => {
    fetchBookings();
  }, []);

  /**
   * Return state and refetch function
   */
  return {
    bookings,
    setBookings,
    loading,
    error,
    refetch: fetchBookings
  };
};