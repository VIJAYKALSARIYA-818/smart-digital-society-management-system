import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import FormCard from "@/components/ui/FormCard";
import ComplaintForm from "@/components/complaints/ComplaintForm";
import { ROUTES } from "@/constants/routes";
import { fetchComplaint, updateComplaint } from "@/services/complaintService";
import { getApiError } from "@/utils/apiError";

const EditComplaint = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComplaint = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchComplaint(complaintId);
        setComplaint(data.data.complaint);
      } catch (fetchError) {
        setError(getApiError(fetchError));
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaint();
  }, [complaintId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await updateComplaint(complaintId, payload);
      navigate(ROUTES.COMPLAINTS_DETAILS.replace(":complaintId", data.data.complaint.id), { replace: true });
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
        <p className="mt-3 text-center text-sm text-slate-500">Loading complaint...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <FormCard
        title="Edit complaint"
        footer={<Link to={ROUTES.COMPLAINTS} className="font-medium text-indigo-600 hover:text-indigo-700">Back to complaints</Link>}
      >
        {error ? <FormAlert message={error.message} errors={error.errors} /> : null}
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Edit complaint"
      subtitle="Update complaint details and service status."
      footer={<Link to={ROUTES.COMPLAINTS} className="font-medium text-indigo-600 hover:text-indigo-700">Back to complaints</Link>}
    >
      <ComplaintForm initialValues={complaint} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Update complaint" />
    </FormCard>
  );
};

export default EditComplaint;