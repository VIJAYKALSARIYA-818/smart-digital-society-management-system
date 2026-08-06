import { useMemo } from "react";
import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import Input from "@/components/ui/Input";
import { toVisitorDateTimeInputValue } from "@/utils/visitorHelpers";

const VISITOR_STATUSES = ["Inside", "Exited"];

const VisitorForm = ({
  initialValues = {},
  submitLabel = "Save visitor",
  isSubmitting = false,
  error = null,
  onSubmit,
}) => {
  const defaultStatus = useMemo(
    () => initialValues.status || "Inside",
    [initialValues.status],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      purpose: formData.get("purpose"),
      residentName: formData.get("residentName"),
      flatNumber: formData.get("flatNumber"),
      block: formData.get("block"),
      checkInTime: formData.get("checkInTime"),
      checkOutTime: formData.get("checkOutTime"),
      status: formData.get("status"),
      vehicleNumber: formData.get("vehicleNumber"),
      idProofType: formData.get("idProofType"),
      idProofNumber: formData.get("idProofNumber"),
      notes: formData.get("notes"),
      isActive: formData.get("isActive") === "on",
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {error && (error.message || error.errors?.length > 0) ? (
        <FormAlert message={error.message} errors={error.errors} />
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          placeholder="Enter visitor full name"
          autoComplete="name"
          defaultValue={initialValues.fullName || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          defaultValue={initialValues.phone || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="visitor@example.com"
          autoComplete="email"
          defaultValue={initialValues.email || ""}
          disabled={isSubmitting}
        />

        <Input
          label="Purpose"
          name="purpose"
          type="text"
          placeholder="Meeting, delivery, maintenance..."
          defaultValue={initialValues.purpose || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Resident Name"
          name="residentName"
          type="text"
          placeholder="Resident being visited"
          defaultValue={initialValues.residentName || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Flat Number"
          name="flatNumber"
          type="text"
          placeholder="e.g. A-101"
          defaultValue={initialValues.flatNumber || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Block"
          name="block"
          type="text"
          placeholder="e.g. Block A"
          defaultValue={initialValues.block || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Vehicle Number"
          name="vehicleNumber"
          type="text"
          placeholder="Optional vehicle number"
          defaultValue={initialValues.vehicleNumber || ""}
          disabled={isSubmitting}
        />

        <Input
          label="ID Proof Type"
          name="idProofType"
          type="text"
          placeholder="Aadhaar, PAN, DL..."
          defaultValue={initialValues.idProofType || ""}
          disabled={isSubmitting}
        />

        <Input
          label="ID Proof Number"
          name="idProofNumber"
          type="text"
          placeholder="Optional ID number"
          defaultValue={initialValues.idProofNumber || ""}
          disabled={isSubmitting}
        />

        <Input
          label="Check-in Time"
          name="checkInTime"
          type="datetime-local"
          defaultValue={toVisitorDateTimeInputValue(initialValues.checkInTime || new Date())}
          disabled={isSubmitting}
        />

        <Input
          label="Check-out Time"
          name="checkOutTime"
          type="datetime-local"
          defaultValue={toVisitorDateTimeInputValue(initialValues.checkOutTime)}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            defaultValue={defaultStatus}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting}
          >
            {VISITOR_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <label className="inline-flex items-center gap-2 self-end text-sm text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialValues.isActive ?? true}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          Active visitor record
        </label>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={initialValues.notes || ""}
          placeholder="Optional visitor notes"
          className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

export default VisitorForm;