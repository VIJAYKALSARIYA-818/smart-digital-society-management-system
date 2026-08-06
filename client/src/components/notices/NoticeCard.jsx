import { formatNoticeDate, getNoticeInitials } from "@/utils/noticeHelpers";

const NoticeCard = ({ notice, actions }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700">
          {getNoticeInitials(notice.title)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{notice.title}</h3>
              <p className="text-xs text-slate-500">{notice.category}</p>
            </div>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                notice.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {notice.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Priority</dt>
              <dd className="mt-0.5 text-slate-700">{notice.priority}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Publish / Expiry</dt>
              <dd className="mt-0.5 text-slate-700">
                {formatNoticeDate(notice.publishDate)} • {formatNoticeDate(notice.expiryDate)}
              </dd>
            </div>
          </dl>

          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
            {notice.description}
          </p>

          {notice.attachment ? (
            <a href={notice.attachment} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View attachment
            </a>
          ) : null}

          {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
};

export default NoticeCard;