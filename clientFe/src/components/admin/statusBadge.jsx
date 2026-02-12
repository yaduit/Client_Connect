const StatusBadge = ({ status, type = 'booking' }) => {
  const statusConfig = {
    booking: {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmed' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
      cancelled: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Cancelled' }
    },
    provider: {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
      inactive: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Inactive' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' }
    },
    role: {
      admin: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Admin' },
      provider: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Provider' },
      seeker: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Seeker' }
    }
  };

  const config = statusConfig[type]?.[status] || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    label: status
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;