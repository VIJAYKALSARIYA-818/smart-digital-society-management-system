import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { fetchBooking, updateBooking } from "@/services/bookingService";
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

const EditBooking = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [formData, setFormData] = useState({
    amenityId: "",
    residentId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: 1,
    status: "Pending",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [residents, setResidents] = useState([]);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(true);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      setIsLoading(true);
      setSubmitError(null);

      try {
        const { data } = await fetchBooking(bookingId);
        const booking = data.data.booking;

        setFormData({
          amenityId: booking.amenityId || "",
          residentId: booking.residentId || "",
          bookingDate: booking.bookingDate ? booking.bookingDate.split("T")[0] : "",
          startTime: booking.startTime || "",
          endTime: booking.endTime || "",
          purpose: booking.purpose || "",
          attendees: booking.attendees || 1,
          status: booking.status || "Pending",
          notes: booking.notes || "",
        });
      } catch (error) {
        const apiError = getApiError(error);
        setSubmitError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

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

      await updateBooking(bookingId, bookingData);

      navigate(ROUTES.BOOKINGS, {
        state: { successMessage: "Booking updated successfully" },
      });
    } catch (error) {
      const apiError = getApiError(error);
      setSubmitError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Edit Booking
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update booking details and status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError ? (
          <FormAlert
            message={submitError.message}
            errors={submitError.errors}
          />
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

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={BOOKING_STATUSES}
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

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.BOOKINGS)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBooking;
