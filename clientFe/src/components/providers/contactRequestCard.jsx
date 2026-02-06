import { useState } from "react";
import { 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Check, 
  X, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { 
  acceptContactRequestApi, 
  rejectContactRequestApi 
} from "../../api/contactRequest.api.js";

const ContactRequestCard = ({ request, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(request.status === 'accepted');

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await acceptContactRequestApi(request.id);
      setShowContactDetails(true);
      onStatusChange({ ...request, status: 'accepted', respondedAt: response.contactRequest.respondedAt });
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await rejectContactRequestApi(request.id);
      onStatusChange({ ...request, status: 'rejected', respondedAt: response.contactRequest.respondedAt });
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{request.seeker.name}</h3>
            <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
          </div>
        </div>

        {/* Status Badge */}
        {request.status === 'pending' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        )}
        {request.status === 'accepted' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Accepted
          </span>
        )}
        {request.status === 'rejected' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        )}
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        </div>
      )}

      {/* Contact Details (shown only after acceptance) */}
      {showContactDetails && request.status === 'accepted' && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-blue-900 mb-2">Contact Details</p>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-blue-600" />
            <a 
              href={`mailto:${request.contactDetails.email}`}
              className="text-blue-700 hover:underline"
            >
              {request.contactDetails.email}
            </a>
          </div>
          {request.contactDetails.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-blue-600" />
              <a 
                href={`tel:${request.contactDetails.phone}`}
                className="text-blue-700 hover:underline"
              >
                {request.contactDetails.phone}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Actions (only for pending requests) */}
      {request.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <X className="w-4 h-4" />
                Reject
              </>
            )}
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Accept
              </>
            )}
          </button>
        </div>
      )}

      {/* Responded Date */}
      {request.respondedAt && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Responded on {formatDate(request.respondedAt)}
        </p>
      )}
    </div>
  );
};

export default ContactRequestCard;