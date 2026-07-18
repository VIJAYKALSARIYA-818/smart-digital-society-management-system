import { ANNOUNCEMENT_ICON } from "@/constants/dashboardData";

const AnnouncementCard = ({ title, description, date, tag }) => {
  const Icon = ANNOUNCEMENT_ICON;

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-indigo-200 hover:bg-white">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 ring-1 ring-slate-200">
          <Icon className="h-4 w-4" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
              {tag}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
          <p className="mt-2 text-xs text-slate-400">{date}</p>
        </div>
      </div>
    </article>
  );
};

export default AnnouncementCard;
