const StatsCard = ({ title, value, icon: Icon, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    sky: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-2xl font-semibold text-slate-800">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;