import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { createAmenity } from "@/services/amenityService";
import { getApiError } from "@/utils/apiError";

const AMENITY_TYPES = [
  { value: "Sports", label: "Sports" },
  { value: "Recreation", label: "Recreation" },
  { value: "Community", label: "Community" },
  { value: "Service", label: "Service" },
  { value: "Other", label: "Other" },
];

const AddAmenity = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await createAmenity(payload);
      navigate(ROUTES.AMENITIES_DETAILS.replace(":amenityId", data.data.amenity.id), {
        replace: true,
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Add amenity"
      subtitle="Create a new amenity or facility for society residents."
      footer={
        <Button type="button" onClick={() => navigate(ROUTES.AMENITIES)} variant="outline">
          Back to amenities
        </Button>
      }
    >
      <AmenityForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        submitLabel="Create amenity"
      />
    </FormCard>
  );
};

const AmenityForm = ({ initialValues = {}, submitLabel = "Save amenity", isSubmitting = false, error = null, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      name: formData.get("name"),
      description: formData.get("description"),
      type: formData.get("type"),
      capacity: parseInt(formData.get("capacity"), 10),
      location: formData.get("location"),
      facilities: formData.get("facilities")?.split(",").map(f => f.trim()).filter(f => f),
      operatingHours: formData.get("operatingHours"),
      bookingFee: parseFloat(formData.get("bookingFee")),
      requiresApproval: formData.get("requiresApproval") === "on",
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
          label="Amenity Name"
          name="name"
          type="text"
          placeholder="Enter amenity name"
          defaultValue={initialValues.name || ""}
          required
          disabled={isSubmitting}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Amenity Type</label>
          <select
            name="type"
            defaultValue={initialValues.type || "Other"}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isSubmitting}
          >
            {AMENITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Capacity"
          name="capacity"
          type="number"
          placeholder="Maximum number of people"
          defaultValue={initialValues.capacity || 1}
          min="1"
          required
          disabled={isSubmitting}
        />

        <Input
          label="Location"
          name="location"
          type="text"
          placeholder="e.g., Ground Floor, Block A"
          defaultValue={initialValues.location || ""}
          disabled={isSubmitting}
        />

        <Input
          label="Booking Fee"
          name="bookingFee"
          type="number"
          placeholder="0 for free"
          defaultValue={initialValues.bookingFee || 0}
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />

        <Input
          label="Operating Hours"
          name="operatingHours"
          type="text"
          placeholder="e.g., 6:00 AM - 10:00 PM"
          defaultValue={initialValues.operatingHours || ""}
          disabled={isSubmitting}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Description"
            name="description"
            placeholder="Describe the amenity and its features"
            rows={3}
            defaultValue={initialValues.description || ""}
            disabled={isSubmitting}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Facilities"
            name="facilities"
            placeholder="Comma-separated, e.g., Wi-Fi, AC, Projector"
            rows={2}
            defaultValue={initialValues.facilities?.join(", ") || ""}
            disabled={isSubmitting}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="requiresApproval"
            defaultChecked={initialValues.requiresApproval || false}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          Requires approval for booking
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initialValues.isActive ?? true}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          Active amenity
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default AddAmenity;
export { AmenityForm };