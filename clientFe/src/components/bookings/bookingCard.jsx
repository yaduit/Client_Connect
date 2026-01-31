import { useState } from 'react';
import {
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  MessageSquare
} from 'lucide-react';
import {
  acceptBookingApi,
  rejectBookingApi,
  completeBookingApi
} from '../../api/booking.api.js';

/**
 * BookingCard - Display booking with status and action buttons
 * Shows: service, seeker info, date/time, status, and provider actions
 * 
 * @param {Object} props
 *   - booking: Booking object
 *   - onStatusChange: Callback after status updated
 */
const BookingCard = ({ booking, onStatusChange }) => {
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState('');

  // Format date and time
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Duration display
  const hours = Math.floor(booking.duration / 60);
  const minutes = booking.duration % 60;
  const durationDisplay = hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m`;

  // Status badge colors
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: AlertCircle,
      label: 'Pending Response'
    },
    confirmed: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: CheckCircle,
      label: 'Confirmed'
    },
    completed: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800',
      icon: CheckCircle,
      label: 'Completed'
    },
    cancelled: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      icon: XCircle,
      label: 'Cancelled'
    }
  };

  const config = statusConfig[booking.status];
  const StatusIcon = config.icon;

  // Handle accept
  const handleAccept = async () => {
    setIsActing(true);
    setActionError('');

    try {
      const response = await acceptBookingApi(booking._id);

      if (response.success) {
        onStatusChange?.(response.booking);
      } else {
        setActionError(response.message || 'Failed to accept booking');
      }
    } catch (error) {
      console.error('Accept error:', error);
      setActionError(
        error.response?.data?.message ||
        error.message ||
        'Failed to accept booking'
      );
    } finally {
      setIsActing(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    setIsActing(true);
    setActionError('');

    try {
      const response = await rejectBookingApi(booking._id, reason);

      if (response.success) {
        onStatusChange?.(response.booking);
      } else {
        setActionError(response.message || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Reject error:', error);
      setActionError(
        error.response?.data?.message ||
        error.message ||
        'Failed to reject booking'
      );
    } finally {
      setIsActing(false);
    }
  };

  // Handle complete
  const handleComplete = async () => {
    if (!window.confirm('Mark this booking as completed?')) return;

    setIsActing(true);
    setActionError('');

    try {
      const response = await completeBookingApi(booking._id);

      if (response.success) {
        onStatusChange?.(response.booking);
      } else {
        setActionError(response.message || 'Failed to complete booking');
      }
    } catch (error) {
      console.error('Complete error:', error);
      setActionError(
        error.response?.data?.message ||
        error.message ||
        'Failed to complete booking'
      );
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-6 transition-all duration-300`}
    >
      {/* Header with Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="w-5 h-5" />
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
              {config.label}
            </span>
          </div>
          <h4 className="text-lg font-bold text-gray-900">
            {booking.serviceId?.title}
          </h4>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-xs text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">
            ₹{booking.totalAmount}
          </p>
        </div>
      </div>

      {/* Seeker Info */}
      <div className="space-y-3 mb-4 pb-4 border-b border-gray-300 border-opacity-50">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-xs text-gray-600">Requested by</p>
            <p className="font-medium text-gray-900">{booking.seekerName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-600" />
          <a
            href={`mailto:${booking.seekerEmail}`}
            className="text-sm text-blue-600 hover:underline"
          >
            {booking.seekerEmail}
          </a>
        </div>

        {booking.seekerPhone && (
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-600" />
            <a
              href={`tel:${booking.seekerPhone}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {booking.seekerPhone}
            </a>
          </div>
        )}
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Date & Time</p>
          <p className="font-semibold text-gray-900">{bookingDate}</p>
          <p className="text-sm text-gray-700">{booking.bookingTime}</p>
        </div>

        <div className="bg-white/50 rounded-lg p-3">
          <p className="text-xs text-gray-600">Duration</p>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-900">{durationDisplay}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="mb-4 p-3 bg-white/50 rounded-lg">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Seeker's Message</p>
              <p className="text-sm text-gray-700">{booking.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {actionError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-sm text-red-800">{actionError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {booking.status === 'pending' && (
          <>
            <button
              onClick={handleAccept}
              disabled={isActing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActing ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {isActing ? 'Confirming...' : 'Accept'}
            </button>

            <button
              onClick={handleReject}
              disabled={isActing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition font-medium text-sm border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActing ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </button>
          </>
        )}

        {booking.status === 'confirmed' && (
          <button
            onClick={handleComplete}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isActing ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isActing ? 'Completing...' : 'Mark as Completed'}
          </button>
        )}

        {(booking.status === 'completed' || booking.status === 'cancelled') && (
          <div className="w-full text-center py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
            No actions available
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;