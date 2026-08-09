const ActivityItem = ({ type, title, subtitle, metadata, createdAt, isLast }) => {
  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "Just now";
    }
  };

  const getActivityIcon = (activityType) => {
    const iconMap = {
      "New Resident": "👤",
      "Complaint": "📝",
      "Visitor": "🚶",
      "Parking": "🚗",
      "Booking": "📅",
      "Package": "📦",
    };
    return iconMap[activityType] || "📌";
  };

  const getActivityAccent = (activityType) => {
    const accentMap = {
      "New Resident": "bg-blue-50 text-blue-600",
      "Complaint": "bg-red-50 text-red-600",
      "Visitor": "bg-green-50 text-green-600",
      "Parking": "bg-purple-50 text-purple-600",
      "Booking": "bg-emerald-50 text-emerald-600",
      "Package": "bg-orange-50 text-orange-600",
    };
    return accentMap[activityType] || "bg-slate-50 text-slate-600";
  };

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          className="absolute left-5 top-11 h-[calc(100%-1.75rem)] w-px bg-slate-200"
          aria-hidden
        />
      )}

      <div
        className={[
          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white",
          getActivityAccent(type),
        ].join(" ")}
      >
        <span className="text-lg" aria-hidden>{getActivityIcon(type)}</span>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <time className="shrink-0 text-xs text-slate-400">{formatTime(createdAt)}</time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {subtitle}
        </p>
        {metadata && (
          <p className="mt-1 text-xs text-slate-400">{metadata}</p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
