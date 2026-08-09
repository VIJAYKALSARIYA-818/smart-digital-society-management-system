import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { createBooking } from "@/services/bookingService";
import { fetchAmenities } from "@/services/amenityService";
import { fetchResidents } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const BOOKING_STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

const AddBooking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amenityId: "",
    residentId: "",
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: 1,
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [residents, setResidents] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(true);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [amenitiesRes, residentsRes] = await Promise.all([
          fetchAmenities({ limit: 100, isActive: true }),
          fetchResidents({ limit: 100, isActive: true }),
        ]);

        setAmenities(amenitiesRes.data.data?.amenities || []);
        setResidents(residentsRes.data.data?.residents || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoadingAmenities(false);
        setIsLoadingResidents(false);
      }
    };

    loadData();
  }, []);

  const amenityOptions = amenities.map((amenity) => ({
    value: amenity.id,
    label: `${amenity.name} (${amenity.type}) - Capacity: ${amenity.capacity}`,
  }));

  const residentOptions = residents.map((resident) => ({
    value: resident.id,
    label: `${resident.fullName} - ${resident.flatNumber}${resident.block ? ` (${resident.block})` : ""}`,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amenityId) {
      newErrors.amenityId = "Amenity is required";
    }

    if (!formData.residentId) {
      newErrors.residentId = "Resident is required";
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Booking date is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.attendees || formData.attendees < 1) {
      newErrors.attendees = "Number of attendees must be at least 1";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData = {
        ...formData,
        bookingDate: new Date(formData.bookingDate),
        attendees: parseInt(formData.attendees, 10),
      };

      await createBooking(bookingData);

      navigate(ROUTES.BOOKINGS);
    } catch (error) {
      const apiError = getApiError(error);
      setSubmitError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          New Booking
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new facility booking for society amenities.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {submitError ? (
          <div className="mb-6">
            <FormAlert
              message={submitError.message}
              errors={submitError.errors}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            label="Amenity"
            name="amenityId"
            value={formData.amenityId}
            onChange={(e) => handleChange("amenityId", e.target.value)}
            options={[
              { value: "", label: isLoadingAmenities ? "Loading amenities..." : "Select amenity" },
              ...amenityOptions,
            ]}
            error={errors.amenityId}
            required
            disabled={isSubmitting || isLoadingAmenities}
          />

          <Select
            label="Resident"
            name="residentId"
            value={formData.residentId}
            onChange={(e) => handleChange("residentId", e.target.value)}
            options={[
              { value: "", label: isLoadingResidents ? "Loading residents..." : "Select resident" },
              ...residentOptions,
            ]}
            error={errors.residentId}
            required
            disabled={isSubmitting || isLoadingResidents}
          />

          <Input
            label="Booking Date"
            name="bookingDate"
            type="date"
            value={formData.bookingDate}
            onChange={(e) => handleChange("bookingDate", e.target.value)}
            error={errors.bookingDate}
            required
            disabled={isSubmitting}
          />

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                error={errors.startTime}
                required
                disabled={isSubmitting}
              />

              <Input
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                error={errors.endTime}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Input
            label="Number of Attendees"
            name="attendees"
            type="number"
            value={formData.attendees}
            onChange={(e) => handleChange("attendees", e.target.value)}
            min="1"
            error={errors.attendees}
            required
            disabled={isSubmitting}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Purpose"
              name="purpose"
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              placeholder="e.g., Birthday party, Meeting, Sports event"
              rows={2}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Optional notes about this booking"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBooking;
