import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import FormCard from "@/components/ui/FormCard";
import MaintenanceBillForm from "@/components/maintenance/MaintenanceBillForm";
import Toast from "@/components/common/Toast";
import { ROUTES } from "@/constants/routes";
import { fetchMaintenanceBill, updateMaintenanceBill } from "@/services/maintenanceService";
import { getApiError } from "@/utils/apiError";

const EditMaintenanceBill = () => {
  const navigate = useNavigate();
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const loadBill = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchMaintenanceBill(billId);
        setBill(data.data.bill);
      } catch (fetchError) {
        setError(getApiError(fetchError));
      } finally {
        setIsLoading(false);
      }
    };

    loadBill();
  }, [billId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await updateMaintenanceBill(billId, payload);
      setToastMessage("Bill updated successfully");
      navigate(ROUTES.MAINTENANCE_DETAILS.replace(":billId", data.data.bill.id), {
        replace: true,
        state: { successMessage: "Bill updated successfully" },
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-center text-sm text-slate-500">Loading bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <FormCard
        title="Edit bill"
        footer={<Link to={ROUTES.MAINTENANCE} className="font-medium text-indigo-600 hover:text-indigo-700">Back to maintenance bills</Link>}
      >
        {error ? <FormAlert message={error.message} errors={error.errors} /> : null}
      </FormCard>
    );
  }

  return (
    <>
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      <FormCard
        title="Edit bill"
        subtitle="Update bill amount, due date, or payment details."
        footer={<Link to={ROUTES.MAINTENANCE} className="font-medium text-indigo-600 hover:text-indigo-700">Back to maintenance bills</Link>}
      >
        <MaintenanceBillForm initialValues={bill} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Update bill" />
      </FormCard>
    </>
  );
};

export default EditMaintenanceBill;