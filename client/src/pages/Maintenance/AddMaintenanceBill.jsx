import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import MaintenanceBillForm from "@/components/maintenance/MaintenanceBillForm";
import Toast from "@/components/common/Toast";
import { ROUTES } from "@/constants/routes";
import { createMaintenanceBill } from "@/services/maintenanceService";
import { getApiError } from "@/utils/apiError";

const AddMaintenanceBill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await createMaintenanceBill(payload);
      setToastMessage("Bill created successfully");
      navigate(ROUTES.MAINTENANCE_DETAILS.replace(":billId", data.data.bill.id), {
        replace: true,
        state: { successMessage: "Bill created successfully" },
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <FormCard
        title="Add bill"
        subtitle="Create a monthly maintenance bill for a resident."
        footer={<Link to={ROUTES.MAINTENANCE} className="font-medium text-indigo-600 hover:text-indigo-700">Back to maintenance bills</Link>}
      >
        <MaintenanceBillForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Create bill" />
      </FormCard>
    </>
  );
};

export default AddMaintenanceBill;