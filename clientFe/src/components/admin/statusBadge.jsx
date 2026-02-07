const StatusBadge = ({ status, type = 'booking' }) => {
  const getStyles = () => {
    if (type === 'booking') {
      switch (status) {
        case 'pending':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'confirmed':
          return 'bg-sky-100 text-sky-700 border-sky-200';
        case 'completed':
          return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'cancelled':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }

    if (type === 'provider') {
      return status
        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
        : 'bg-gray-100 text-gray-700 border-gray-200';
    }

    if (type === 'role') {
      switch (status) {
        case 'admin':
          return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'provider':
          return 'bg-sky-100 text-sky-700 border-sky-200';
        case 'seeker':
          return 'bg-gray-100 text-gray-700 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  const getLabel = () => {
    if (type === 'provider') {
      return status ? 'Active' : 'Inactive';
    }
    return status;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStyles()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;