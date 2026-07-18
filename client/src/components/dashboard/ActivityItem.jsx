const ActivityItem = ({ title, description, time, icon: Icon, accent, isLast }) => {
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
          accent,
        ].join(" ")}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <time className="shrink-0 text-xs text-slate-400">{time}</time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
