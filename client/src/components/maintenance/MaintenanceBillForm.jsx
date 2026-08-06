import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import Input from "@/components/ui/Input";
import { fetchResidents } from "@/services/residentService";
import { BILL_MONTHS, BILL_STATUSES, PAYMENT_METHODS } from "@/utils/maintenanceHelpers";

const MaintenanceBillForm = ({
  initialValues = {},
  submitLabel = "Save bill",
  isSubmitting = false,
  error = null,
  onSubmit,
}) => {
  const resolveResidentId = (resident) => {
    const rawId = resident?.id ?? resident?._id ?? resident?.residentId;
    return rawId ? String(rawId) : "";
  };

  const normalizeResidentOption = (resident) => ({
    ...resident,
    normalizedId: resolveResidentId(resident),
  });

  const initialResidentId = initialValues.resident ? String(initialValues.resident) : "";
  const initialResidentName = initialValues.residentName || "";
  const initialFlatNumber = initialValues.flatNumber || "";
  const initialStatus = initialValues.status || "Pending";

  const [residentOptions, setResidentOptions] = useState([]);
  const [residentLoading, setResidentLoading] = useState(true);
  const [selectedResidentId, setSelectedResidentId] = useState(initialResidentId);
  const [residentName, setResidentName] = useState(initialResidentName);
  const [flatNumber, setFlatNumber] = useState(initialFlatNumber);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const loadResidents = async () => {
      setResidentLoading(true);

      try {
        const { data } = await fetchResidents({ page: 1, limit: 100 });
        const residents = Array.isArray(data?.data?.residents) ? data.data.residents : [];
        const normalizedResidents = residents.map(normalizeResidentOption).filter((resident) => resident.normalizedId);
        setResidentOptions(normalizedResidents);

        if (import.meta.env.DEV) {
          console.log("[MaintenanceBillForm] fetched residents:", normalizedResidents);
          console.log(
            "[MaintenanceBillForm] option values:",
            normalizedResidents.map((resident) => resident.normalizedId),
          );
        }
      } catch (fetchError) {
        setResidentOptions([]);

        if (import.meta.env.DEV) {
          console.error("[MaintenanceBillForm] failed to fetch residents:", fetchError);
        }
      } finally {
        setResidentLoading(false);
      }
    };

    loadResidents();
  }, []);

  useEffect(() => {
    setSelectedResidentId(initialResidentId);
    setResidentName(initialResidentName);
    setFlatNumber(initialFlatNumber);
    setStatus(initialStatus);
  }, [initialResidentId, initialResidentName, initialFlatNumber, initialStatus]);

  const residentLookup = useMemo(() => {
    const lookup = new Map();

    residentOptions.forEach((resident) => {
      const residentId = resident.normalizedId;
      if (residentId) {
        lookup.set(residentId, resident);
      }
    });

    if (import.meta.env.DEV) {
      console.log("[MaintenanceBillForm] residentLookup keys:", Array.from(lookup.keys()));
    }

    return lookup;
  }, [residentOptions]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[MaintenanceBillForm] selected resident value:", selectedResidentId);
    }
  }, [selectedResidentId]);

  const handleResidentChange = (value) => {
    setSelectedResidentId(value);

    const resident = residentLookup.get(value);
    setResidentName(resident?.fullName || "");
    setFlatNumber(resident?.flatNumber || "");

    if (import.meta.env.DEV) {
      console.log("[MaintenanceBillForm] resident found after selection:", resident);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      resident: selectedResidentId,
      residentName,
      flatNumber,
      billMonth: formData.get("billMonth"),
      billYear: formData.get("billYear"),
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate"),
      paymentDate: formData.get("paymentDate"),
      status,
      paymentMethod: formData.get("paymentMethod"),
      transactionId: formData.get("transactionId"),
      remarks: formData.get("remarks"),
    };

    if (import.meta.env.DEV) {
      console.log("[MaintenanceBillForm] payload sent to backend:", payload);
    }

    onSubmit(payload);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {error && (error.message || error.errors?.length > 0) ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Resident</label>
          <select
            name="resident"
            value={selectedResidentId}
            onChange={(event) => handleResidentChange(event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting || residentLoading}
          >
            <option value="">{residentLoading ? "Loading residents..." : "Select resident"}</option>
            {residentOptions.map((resident) => (
              <option key={resident.normalizedId} value={resident.normalizedId}>
                {resident.fullName} - Flat {resident.flatNumber}
              </option>
            ))}
          </select>
        </div>

        <Input label="Resident Name" name="residentName" type="text" value={residentName} readOnly disabled className="bg-slate-50" />
        <Input label="Flat Number" name="flatNumber" type="text" value={flatNumber} readOnly disabled className="bg-slate-50" />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Bill Month</label>
          <select name="billMonth" defaultValue={initialValues.billMonth || ""} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting}>
            <option value="">Select month</option>
            {BILL_MONTHS.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
          </select>
        </div>

        <Input label="Bill Year" name="billYear" type="number" min="2000" step="1" defaultValue={initialValues.billYear || new Date().getFullYear()} required disabled={isSubmitting} />

        <Input label="Amount" name="amount" type="number" min="0.01" step="0.01" defaultValue={initialValues.amount || ""} required disabled={isSubmitting} />

        <Input label="Due Date" name="dueDate" type="date" defaultValue={initialValues.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0, 10) : ""} required disabled={isSubmitting} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select name="status" value={status} onChange={(event) => setStatus(event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting}>
            {BILL_STATUSES.map((statusValue) => <option key={statusValue} value={statusValue}>{statusValue}</option>)}
          </select>
        </div>

        {status === "Paid" ? (
          <Input label="Payment Date" name="paymentDate" type="date" defaultValue={initialValues.paymentDate ? new Date(initialValues.paymentDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)} required disabled={isSubmitting} />
        ) : (
          <Input label="Payment Date" name="paymentDate" type="date" defaultValue={initialValues.paymentDate ? new Date(initialValues.paymentDate).toISOString().slice(0, 10) : ""} disabled={isSubmitting} />
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Payment Method</label>
          <select name="paymentMethod" defaultValue={initialValues.paymentMethod || ""} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting}>
            <option value="">Select method</option>
            {PAYMENT_METHODS.map((method) => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>

        <Input label="Transaction ID" name="transactionId" type="text" placeholder="Optional" defaultValue={initialValues.transactionId || ""} disabled={isSubmitting} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Remarks</label>
        <textarea name="remarks" rows={4} defaultValue={initialValues.remarks || ""} placeholder="Optional remarks" className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting} />
      </div>

      <Button type="submit" disabled={isSubmitting || residentLoading}>{isSubmitting ? "Saving..." : submitLabel}</Button>
    </form>
  );
};

export default MaintenanceBillForm;