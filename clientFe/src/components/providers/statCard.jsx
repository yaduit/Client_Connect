const StatCard = ({ stat }) => {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      trend: "text-emerald-600 bg-emerald-50",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      trend: "text-blue-600 bg-blue-50",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      trend: "text-amber-600 bg-amber-50",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      trend: "text-purple-600 bg-purple-50",
    },
  };

  const colors = colorMap[stat.color] || colorMap.emerald;
  const IconComponent = stat.icon;

  return (
    <div
      className={`${colors.bg} rounded-2xl shadow-sm border ${colors.border} p-5 sm:p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default`}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-white ${colors.icon}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        {stat.trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-lg ${colors.trend} whitespace-nowrap`}
          >
            {stat.trend}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <p className="text-3xl sm:text-4xl font-bold text-slate-900">
          {stat.value}
        </p>
        {stat.suffix && (
          <span className="text-2xl">{stat.suffix}</span>
        )}
      </div>

      {/* Reviews Count (for rating only) */}
      {stat.reviews && (
        <p className="text-xs text-slate-600 mt-2">
          {stat.reviews} {stat.reviews === "1" ? "review" : "reviews"}
        </p>
      )}
    </div>
  );
};

export default StatCard;
