import { formatVisitorDate, getVisitorInitials } from "@/utils/visitorHelpers";

const VisitorCard = ({ visitor, actions }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
          {getVisitorInitials(visitor.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{visitor.fullName}</h3>
              <p className="text-xs text-slate-500">{visitor.purpose}</p>
            </div>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                visitor.status === "Inside"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {visitor.status}
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Resident</dt>
              <dd className="mt-0.5 text-slate-700">{visitor.residentName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Flat / Block</dt>
              <dd className="mt-0.5 text-slate-700">
                {visitor.flatNumber} {visitor.block ? `• ${visitor.block}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Phone</dt>
              <dd className="mt-0.5 text-slate-700">{visitor.phone}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Check-in</dt>
              <dd className="mt-0.5 text-slate-700">{formatVisitorDate(visitor.checkInTime)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Check-out</dt>
              <dd className="mt-0.5 text-slate-700">{formatVisitorDate(visitor.checkOutTime)}</dd>
            </div>
          </dl>

          {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
};

export default VisitorCard;