import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import MaintenanceBillCard from "@/components/maintenance/MaintenanceBillCard";
import { ROUTES } from "@/constants/routes";
import { formatBillDate, formatCurrency, getMonthLabel, getStatusStyles } from "@/utils/maintenanceHelpers";

const MaintenanceBillTable = ({ bills, onView, onEdit, onDelete, onMarkPaid }) => {
  const navigate = useNavigate();

  if (bills.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-medium text-slate-900">No maintenance bills found</p>
        <p className="mt-2 text-sm text-slate-500">Try different filters or add a new bill.</p>
        <div className="mt-5">
          <Button type="button" onClick={() => navigate(ROUTES.MAINTENANCE_NEW)}>Add bill</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {bills.map((bill) => (
          <MaintenanceBillCard
            key={bill.id}
            bill={bill}
            actions={
              <>
                <Button type="button" variant="outline" onClick={() => onView(bill)}>View</Button>
                <Button type="button" variant="outline" onClick={() => onEdit(bill)}>Edit</Button>
                {bill.status !== "Paid" ? <Button type="button" variant="outline" onClick={() => onMarkPaid(bill)}>Mark Paid</Button> : null}
                <Button type="button" onClick={() => onDelete(bill)}>Delete</Button>
              </>
            }
          />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Resident</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Flat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Period</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{bill.residentName}</p>
                      <p className="text-sm text-slate-500">{bill.resident}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{bill.flatNumber}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{getMonthLabel(bill.billMonth)} {bill.billYear}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatCurrency(bill.amount)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatBillDate(bill.dueDate)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyles(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => onView(bill)}>View</Button>
                      <Button type="button" variant="outline" onClick={() => onEdit(bill)}>Edit</Button>
                      {bill.status !== "Paid" ? <Button type="button" variant="outline" onClick={() => onMarkPaid(bill)}>Mark Paid</Button> : null}
                      <Button type="button" onClick={() => onDelete(bill)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBillTable;