import { formatBillDate, formatCurrency, getBillInitials, getMonthLabel, getStatusStyles } from "@/utils/maintenanceHelpers";

const MaintenanceBillCard = ({ bill, actions }) => {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {getBillInitials(bill.residentName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{bill.residentName}</h3>
              <p className="text-xs text-slate-500">Flat {bill.flatNumber}</p>
            </div>

            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyles(bill.status)}`}>
              {bill.status}
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Bill Period</dt>
              <dd className="mt-0.5 text-slate-700">{getMonthLabel(bill.billMonth)} {bill.billYear}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Amount</dt>
              <dd className="mt-0.5 text-slate-700">{formatCurrency(bill.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Due Date</dt>
              <dd className="mt-0.5 text-slate-700">{formatBillDate(bill.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Payment Date</dt>
              <dd className="mt-0.5 text-slate-700">{formatBillDate(bill.paymentDate)}</dd>
            </div>
          </dl>

          {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </article>
  );
};

export default MaintenanceBillCard;