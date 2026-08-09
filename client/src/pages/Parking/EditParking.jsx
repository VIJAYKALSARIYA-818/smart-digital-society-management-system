import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { fetchParkingSlot, updateParkingSlot } from "@/services/parkingService";
import { fetchResidents } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const VEHICLE_TYPES = [
  { value: "Two Wheeler", label: "Two Wheeler" },
  { value: "Four Wheeler", label: "Four Wheeler" },
  { value: "Truck", label: "Truck" },
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Scooter", label: "Scooter" },
];

const PARKING_SLOT_TYPES = [
  { value: "Covered", label: "Covered" },
  { value: "Open", label: "Open" },
  { value: "Reserved", label: "Reserved" },
];

const PARKING_STATUSES = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Expired", label: "Expired" },
  { value: "Occupied", label: "Occupied" },
  { value: "Vacant", label: "Vacant" },
];

const EditParking = () => {
  const navigate = useNavigate();
  const { parkingId } = useParams();
  const [formData, setFormData] = useState({
    slotNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    residentId: "",
    residentName: "",
    flatNumber: "",
    block: "",
    allocatedDate: "",
    expiryDate: "",
    status: "Active",
    parkingSlotType: "Covered",
    contactNumber: "",
    notes: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [residents, setResidents] = useState([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);

  useEffect(() => {
    const loadParkingSlot = async () => {
      setIsLoading(true);
      setSubmitError(null);

      try {
        const { data } = await fetchParkingSlot(parkingId);
        const parking = data.data.parking;

        setFormData({
          slotNumber: parking.slotNumber || "",
          vehicleType: parking.vehicleType || "",
          vehicleNumber: parking.vehicleNumber || "",
          residentId: parking.residentId || "",
          residentName: parking.residentName || "",
          flatNumber: parking.flatNumber || "",
          block: parking.block || "",
          allocatedDate: parking.allocatedDate
            ? parking.allocatedDate.split("T")[0]
            : "",
          expiryDate: parking.expiryDate
            ? parking.expiryDate.split("T")[0]
            : "",
          status: parking.status || "Active",
          parkingSlotType: parking.parkingSlotType || "Covered",
          contactNumber: parking.contactNumber || "",
          notes: parking.notes || "",
          isActive: parking.isActive !== undefined
            ? parking.isActive
            : true,
        });
      } catch (error) {
        const apiError = getApiError(error);
        setSubmitError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadParkingSlot();
  }, [parkingId]);

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const { data } = await fetchResidents({ limit: 100, isActive: true });
        setResidents(data.data.residents || []);
      } catch (error) {
        console.error("Failed to load residents:", error);
      } finally {
        setIsLoadingResidents(false);
      }
    };

    loadResidents();
  }, []);

  const residentOptions = residents.map((resident) => ({
    value: resident.id,
    label: `${resident.fullName} - ${resident.flatNumber}${resident.block ? ` (${resident.block})` : ""}`,
  }));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResidentChange = (residentId) => {
    const selectedResident = residents.find((r) => r.id === residentId);

    if (selectedResident) {
      setFormData((prev) => ({
        ...prev,
        residentId,
        residentName: selectedResident.fullName,
        flatNumber: selectedResident.flatNumber,
        block: selectedResident.block || "",
      }));

      // Clear resident-related errors
      setErrors((prev) => ({
        ...prev,
        residentId: undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        residentId: "",
        residentName: "",
        flatNumber: "",
        block: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.slotNumber.trim()) {
      newErrors.slotNumber = "Slot number is required";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required";
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    if (!formData.residentId) {
      newErrors.residentId = "Resident is required";
    }

    if (!formData.allocatedDate) {
      newErrors.allocatedDate = "Allocated date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(formData.expiryDate) <= new Date(formData.allocatedDate)) {
      newErrors.expiryDate = "Expiry date must be after allocated date";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
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
      const parkingData = {
        ...formData,
        allocatedDate: new Date(formData.allocatedDate),
        expiryDate: new Date(formData.expiryDate),
      };

      await updateParkingSlot(parkingId, parkingData);

      navigate(ROUTES.PARKING, {
        state: { successMessage: "Parking slot updated successfully" },
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
          Edit Parking Slot
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update parking slot information and allocation details.
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
          <Input
            label="Slot Number"
            name="slotNumber"
            value={formData.slotNumber}
            onChange={(e) => handleChange("slotNumber", e.target.value.toUpperCase())}
            placeholder="e.g., P-101"
            error={errors.slotNumber}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
            options={[{ value: "", label: "Select vehicle type" }, ...VEHICLE_TYPES]}
            error={errors.vehicleType}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={(e) => handleChange("vehicleNumber", e.target.value.toUpperCase())}
            placeholder="e.g., ABC123"
            error={errors.vehicleNumber}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Resident"
            name="residentId"
            value={formData.residentId}
            onChange={(e) => handleResidentChange(e.target.value)}
            options={[
              { value: "", label: isLoadingResidents ? "Loading residents..." : "Select resident" },
              ...residentOptions,
            ]}
            error={errors.residentId}
            required
            disabled={isSubmitting || isLoadingResidents}
          />

          <Input
            label="Flat Number"
            name="flatNumber"
            value={formData.flatNumber}
            disabled
            className="bg-slate-50"
          />

          <Input
            label="Block"
            name="block"
            value={formData.block}
            disabled
            className="bg-slate-50"
          />

          <Input
            label="Allocated Date"
            name="allocatedDate"
            type="date"
            value={formData.allocatedDate}
            onChange={(e) => handleChange("allocatedDate", e.target.value)}
            error={errors.allocatedDate}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange("expiryDate", e.target.value)}
            error={errors.expiryDate}
            required
            disabled={isSubmitting}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={PARKING_STATUSES}
            disabled={isSubmitting}
          />

          <Select
            label="Slot Type"
            name="parkingSlotType"
            value={formData.parkingSlotType}
            onChange={(e) => handleChange("parkingSlotType", e.target.value)}
            options={PARKING_SLOT_TYPES}
            disabled={isSubmitting}
          />

          <Input
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            placeholder="e.g., 9876543210"
            error={errors.contactNumber}
            required
            disabled={isSubmitting}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Optional notes about this parking slot"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                disabled={isSubmitting}
              />
              Active parking slot
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.PARKING)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Parking Slot"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditParking;