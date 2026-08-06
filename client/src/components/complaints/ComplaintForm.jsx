import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import Input from "@/components/ui/Input";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "@/utils/complaintHelpers";

const ComplaintForm = ({
  initialValues = {},
  submitLabel = "Save complaint",
  isSubmitting = false,
  error = null,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      priority: formData.get("priority"),
      status: formData.get("status"),
      residentName: formData.get("residentName"),
      flatNumber: formData.get("flatNumber"),
      assignedTo: formData.get("assignedTo"),
      resolution: formData.get("resolution"),
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
          label="Title"
          name="title"
          type="text"
          placeholder="Short complaint title"
          defaultValue={initialValues.title || ""}
          required
          disabled={isSubmitting}
        />

        <Input
          label="Resident Name"
          name="residentName"
          type="text"
          placeholder="Resident name"
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <select
            name="category"
            defaultValue={initialValues.category || COMPLAINT_CATEGORIES[0]}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting}
          >
            {COMPLAINT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select
            name="priority"
            defaultValue={initialValues.priority || "Medium"}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting}
          >
            {COMPLAINT_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            defaultValue={initialValues.status || "Open"}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting}
          >
            {COMPLAINT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Assigned To"
          name="assignedTo"
          type="text"
          placeholder="Society staff or vendor"
          defaultValue={initialValues.assignedTo || ""}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialValues.description || ""}
          placeholder="Detailed complaint description"
          className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Resolution</label>
        <textarea
          name="resolution"
          rows={4}
          defaultValue={initialValues.resolution || ""}
          placeholder="Action taken or final resolution"
          className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          disabled={isSubmitting}
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={initialValues.isActive ?? true}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          disabled={isSubmitting}
        />
        Active complaint
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

export default ComplaintForm;