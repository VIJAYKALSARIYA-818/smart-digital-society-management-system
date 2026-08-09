import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { ROUTES } from "@/constants/routes";
import { createPackage } from "@/services/packageService";
import { fetchResidents } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const PACKAGE_TYPES = [
  { value: "Parcel", label: "Parcel" },
  { value: "Envelope", label: "Envelope" },
  { value: "Document", label: "Document" },
  { value: "Fragile", label: "Fragile" },
  { value: "Food", label: "Food" },
  { value: "Electronics", label: "Electronics" },
  { value: "Other", label: "Other" },
];

const PACKAGE_STATUSES = [
  { value: "Expected", label: "Expected" },
  { value: "Received", label: "Received" },
  { value: "Delivered", label: "Delivered" },
  { value: "Picked Up", label: "Picked Up" },
  { value: "Returned", label: "Returned" },
  { value: "Cancelled", label: "Cancelled" },
];

const AddPackage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trackingNumber: "",
    residentId: "",
    courier: "",
    senderName: "",
    senderContact: "",
    packageType: "Other",
    description: "",
    expectedDeliveryDate: new Date().toISOString().split("T")[0],
    actualDeliveryDate: "",
    receivedDate: "",
    status: "Expected",
    deliveryPersonName: "",
    deliveryPersonContact: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [residents, setResidents] = useState([]);
  const [isLoadingResidents, setIsLoadingResidents] = useState(true);

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const residentsRes = await fetchResidents({ limit: 100, isActive: true });
        setResidents(residentsRes.data.data?.residents || []);
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = "Tracking number is required";
    }

    if (!formData.residentId) {
      newErrors.residentId = "Resident is required";
    }

    if (!formData.courier.trim()) {
      newErrors.courier = "Courier/company name is required";
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Sender name is required";
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Expected delivery date is required";
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
      const packageData = {
        ...formData,
        expectedDeliveryDate: new Date(formData.expectedDeliveryDate),
        actualDeliveryDate: formData.actualDeliveryDate ? new Date(formData.actualDeliveryDate) : null,
        receivedDate: formData.receivedDate ? new Date(formData.receivedDate) : null,
      };

      await createPackage(packageData);

      navigate(ROUTES.PACKAGE_TRACKING);
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
          Add Package
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Register a new package delivery for tracking.
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
            label="Tracking Number"
            name="trackingNumber"
            type="text"
            placeholder="Enter tracking number"
            value={formData.trackingNumber}
            onChange={(e) => handleChange("trackingNumber", e.target.value)}
            error={errors.trackingNumber}
            required
            disabled={isSubmitting}
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
            label="Courier/Company"
            name="courier"
            type="text"
            placeholder="e.g., FedEx, UPS, DHL"
            value={formData.courier}
            onChange={(e) => handleChange("courier", e.target.value)}
            error={errors.courier}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Sender Name"
            name="senderName"
            type="text"
            placeholder="Enter sender name"
            value={formData.senderName}
            onChange={(e) => handleChange("senderName", e.target.value)}
            error={errors.senderName}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Sender Contact"
            name="senderContact"
            type="text"
            placeholder="Optional sender contact"
            value={formData.senderContact}
            onChange={(e) => handleChange("senderContact", e.target.value)}
            disabled={isSubmitting}
          />

          <Select
            label="Package Type"
            name="packageType"
            value={formData.packageType}
            onChange={(e) => handleChange("packageType", e.target.value)}
            options={PACKAGE_TYPES}
            disabled={isSubmitting}
          />

          <Input
            label="Expected Delivery Date"
            name="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
            error={errors.expectedDeliveryDate}
            required
            disabled={isSubmitting}
          />

          <Input
            label="Actual Delivery Date"
            name="actualDeliveryDate"
            type="date"
            value={formData.actualDeliveryDate}
            onChange={(e) => handleChange("actualDeliveryDate", e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            label="Received Date"
            name="receivedDate"
            type="date"
            value={formData.receivedDate}
            onChange={(e) => handleChange("receivedDate", e.target.value)}
            disabled={isSubmitting}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={PACKAGE_STATUSES}
            disabled={isSubmitting}
          />

          <Input
            label="Delivery Person Name"
            name="deliveryPersonName"
            type="text"
            placeholder="Optional delivery person name"
            value={formData.deliveryPersonName}
            onChange={(e) => handleChange("deliveryPersonName", e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            label="Delivery Person Contact"
            name="deliveryPersonContact"
            type="text"
            placeholder="Optional delivery person contact"
            value={formData.deliveryPersonContact}
            onChange={(e) => handleChange("deliveryPersonContact", e.target.value)}
            disabled={isSubmitting}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Package description"
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
              placeholder="Additional notes about this package"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPackage;