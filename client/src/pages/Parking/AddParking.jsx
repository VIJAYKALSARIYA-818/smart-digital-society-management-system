import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { createParkingSlot } from "@/services/parkingService";
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

const AddParking = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    slotNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    residentId: "",
    residentName: "",
    flatNumber: "",
    block: "",
    allocatedDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "Active",
    parkingSlotType: "Covered",
    contactNumber: "",
    notes: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [residents, setResidents] = useState([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);

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

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
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
        slotNumber: formData.slotNumber.trim().toUpperCase(),
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber.trim().toUpperCase(),
        residentId: formData.residentId,
        allocatedDate: new Date(formData.allocatedDate),
        expiryDate: new Date(formData.expiryDate),
        status: formData.status,
        parkingSlotType: formData.parkingSlotType,
        contactNumber: formData.contactNumber.trim(),
        notes: formData.notes.trim(),
        isActive: formData.isActive,
      };

      await createParkingSlot(parkingData);

      navigate(ROUTES.PARKING);
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
          Add Parking Slot
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new parking slot allocation for residents.
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
          <Input
            label="Slot Number"
            name="slotNumber"
            value={formData.slotNumber}
            onChange={(e) =>
              handleChange("slotNumber", e.target.value.toUpperCase())
            }
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
            onChange={(e) =>
              handleChange("vehicleNumber", e.target.value.toUpperCase())
            }
            placeholder="e.g., GJ05AB1234"
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

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Parking Slot"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddParking;