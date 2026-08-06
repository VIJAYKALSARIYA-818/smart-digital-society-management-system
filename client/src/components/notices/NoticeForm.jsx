import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import Input from "@/components/ui/Input";
import { NOTICE_CATEGORIES, NOTICE_PRIORITIES } from "@/utils/noticeHelpers";

const NoticeForm = ({
  initialValues = {},
  submitLabel = "Save notice",
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
      publishDate: formData.get("publishDate"),
      expiryDate: formData.get("expiryDate"),
      attachment: formData.get("attachment"),
      isPublished: formData.get("isPublished") === "on",
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {error && (error.message || error.errors?.length > 0) ? (
        <FormAlert message={error.message} errors={error.errors} />
      ) : null}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input label="Title" name="title" type="text" placeholder="Notice title" defaultValue={initialValues.title || ""} required disabled={isSubmitting} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <select name="category" defaultValue={initialValues.category || NOTICE_CATEGORIES[0]} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting}>
            {NOTICE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select name="priority" defaultValue={initialValues.priority || "Medium"} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting}>
            {NOTICE_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </div>

        <Input label="Publish Date" name="publishDate" type="date" defaultValue={initialValues.publishDate ? new Date(initialValues.publishDate).toISOString().slice(0, 10) : ""} required disabled={isSubmitting} />

        <Input label="Expiry Date" name="expiryDate" type="date" defaultValue={initialValues.expiryDate ? new Date(initialValues.expiryDate).toISOString().slice(0, 10) : ""} required disabled={isSubmitting} />

        <Input label="Attachment URL" name="attachment" type="url" placeholder="https://..." defaultValue={initialValues.attachment || ""} disabled={isSubmitting} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <textarea name="description" rows={5} defaultValue={initialValues.description || ""} placeholder="Notice details" className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isSubmitting} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="isPublished" defaultChecked={initialValues.isPublished ?? false} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" disabled={isSubmitting} />
        Published
      </label>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : submitLabel}</Button>
    </form>
  );
};

export default NoticeForm;