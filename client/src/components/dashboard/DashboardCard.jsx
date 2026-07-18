const DashboardCard = ({ title, value, description, icon: Icon, accent }) => {
  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accent,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
};

export default DashboardCard;
