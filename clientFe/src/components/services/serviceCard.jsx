import { useState } from 'react';
import { Edit3, Trash2, Eye, Loader, Power } from 'lucide-react';
import { deleteServiceApi } from '../../api/services.api.js';

/**
 * ServiceCard - Reusable service display component
 * Shows: image, title, description, stats, and action buttons
 * 
 * @param {Object} props
 *   - service: Service object
 *   - onEdit: Callback when edit clicked
 *   - onDelete: Callback after successful delete
 *   - showActions: boolean (default: true)
 */
const ServiceCard = ({ 
  service, 
  onEdit, 
  onDelete,
  showActions = true 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Cover image or placeholder
  const coverImage = service?.images?.[0]?.url || 
    'https://via.placeholder.com/400x300?text=Service+Image';

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Delete this service? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await deleteServiceApi(service._id);
      
      if (response.success) {
        if (onDelete) {
          onDelete(service._id);
        }
      } else {
        setDeleteError(response.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setDeleteError(
        error.response?.data?.message || 
        error.message || 
        'Failed to delete service'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <img
          src={coverImage}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Service+Image';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              service.isActive
                ? 'bg-emerald-500/90 text-white'
                : 'bg-gray-500/90 text-white'
            }`}
          >
            {service.isActive ? '● Active' : '● Inactive'}
          </span>
        </div>

        {/* Image Count */}
        {service.images && service.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
            {service.images.length} photos
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & Description */}
        <div>
          <h4 className="text-lg font-bold text-gray-900 line-clamp-1">
            {service.title}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {service.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">Views</p>
            <p className="text-lg font-bold text-gray-900">
              {service.totalViews || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Bookings</p>
            <p className="text-lg font-bold text-gray-900">
              {service.totalBookings || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Rating</p>
            <p className="text-lg font-bold text-gray-900">
              {service.ratingAverage ? service.ratingAverage.toFixed(1) : '—'}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Price</span>
          <span className="text-lg font-bold text-emerald-600">
            ₹{service.price || 0}
          </span>
        </div>

        {/* Delete Error Alert */}
        {deleteError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">{deleteError}</p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onEdit?.(service)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-medium text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;