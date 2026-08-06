import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import { ROUTES } from "@/constants/routes";
import { createComplaint } from "@/services/complaintService";
import { getApiError } from "@/utils/apiError";

const AddComplaint = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await createComplaint(payload);
      navigate(ROUTES.COMPLAINTS_DETAILS.replace(":complaintId", data.data.complaint.id), { replace: true });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Add complaint"
      subtitle="Create a new complaint record and start tracking it immediately."
      footer={<Link to={ROUTES.COMPLAINTS} className="font-medium text-indigo-600 hover:text-indigo-700">Back to complaints</Link>}
    >
      <ComplaintForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Create complaint" />
    </FormCard>
  );
};

export default AddComplaint;