import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import FormAlert from "@/components/common/FormAlert";
import Toast from "@/components/common/Toast";
import { ROUTES } from "@/constants/routes";
import { deleteMaintenanceBill, fetchMaintenanceBill, markMaintenanceBillPaid } from "@/services/maintenanceService";
import { getApiError } from "@/utils/apiError";
import { formatBillDate, formatCurrency, getMonthLabel, getPaymentHistoryLabel, getStatusStyles } from "@/utils/maintenanceHelpers";

const MaintenanceBillDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [toastMessage, setToastMessage] = useState(location.state?.successMessage || "");

  useEffect(() => {
    const loadBill = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchMaintenanceBill(billId);
        setBill(data.data.bill);
      } catch (fetchError) {
        setError(getApiError(fetchError));
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [billId]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeout = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const handleMarkPaid = async () => {
    setIsMarkingPaid(true);
    setError(null);

    try {
      const { data } = await markMaintenanceBillPaid(billId);
      setBill(data.data.bill);
      setToastMessage("Bill marked as paid successfully");
    } catch (markError) {
      setError(getApiError(markError));
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleDelete = async () => {
    if (!billToDelete) return;

    setIsDeleting(true);

    try {
      await deleteMaintenanceBill(billToDelete.id);
      navigate(ROUTES.MAINTENANCE, { replace: true, state: { successMessage: "Bill deleted successfully" } });
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-center text-sm text-slate-500">Loading bill details...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error?.message || "Bill not found"} errors={error?.errors || []} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.MAINTENANCE)}>Back to bills</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance bill details</h1>
          <p className="mt-1 text-sm text-slate-500">Review billing history and payment information.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.MAINTENANCE)}>Back</Button>
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.MAINTENANCE_EDIT.replace(":billId", bill.id))}>Edit</Button>
          {bill.status !== "Paid" ? (
            <Button type="button" variant="outline" onClick={handleMarkPaid} disabled={isMarkingPaid}>
              {isMarkingPaid ? "Updating..." : "Mark Paid"}
            </Button>
          ) : null}
          <Button type="button" onClick={() => setBillToDelete(bill)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{bill.residentName}</h2>
              <p className="text-sm text-slate-500">Flat {bill.flatNumber}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(bill.status)}`}>{bill.status}</span>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Bill Period</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{getMonthLabel(bill.billMonth)} {bill.billYear}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Amount</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatCurrency(bill.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Due Date</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatBillDate(bill.dueDate)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Payment Date</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{formatBillDate(bill.paymentDate)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Payment Method</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{bill.paymentMethod || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-400">Transaction ID</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{bill.transactionId || "-"}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Remarks</h3>
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{bill.remarks || "No remarks provided."}</p>
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Payment History</h3>
          {bill.paymentHistory?.length > 0 ? (
            <div className="mt-4 space-y-3">
              {bill.paymentHistory.map((entry, index) => (
                <div key={`${entry.paymentDate}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-900">{getPaymentHistoryLabel(entry)}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.paymentMethod || "-"} {entry.transactionId ? `• ${entry.transactionId}` : ""}</p>
                  {entry.remarks ? <p className="mt-2 text-xs text-slate-600">{entry.remarks}</p> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No payment history yet.</p>
          )}
        </aside>
      </div>

      <DeleteModal
        isOpen={Boolean(billToDelete)}
        entityLabel="bill"
        entityName={billToDelete?.residentName}
        title="Delete bill"
        description={`This will permanently delete ${billToDelete?.residentName || "this bill"} from the system.`}
        confirmLabel="Delete bill"
        isDeleting={isDeleting}
        onCancel={() => setBillToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MaintenanceBillDetails;