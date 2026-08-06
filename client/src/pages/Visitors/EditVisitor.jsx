import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import FormCard from "@/components/ui/FormCard";
import VisitorForm from "@/components/visitors/VisitorForm";
import { ROUTES } from "@/constants/routes";
import { fetchVisitor, updateVisitor } from "@/services/visitorService";
import { getApiError } from "@/utils/apiError";

const EditVisitor = () => {
  const navigate = useNavigate();
  const { visitorId } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVisitor = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchVisitor(visitorId);
        setVisitor(data.data.visitor);
      } catch (fetchError) {
        setError(getApiError(fetchError));
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitor();
  }, [visitorId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await updateVisitor(visitorId, payload);
      navigate(ROUTES.VISITORS_DETAILS.replace(":visitorId", data.data.visitor.id), {
        replace: true,
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
        <p className="mt-3 text-center text-sm text-slate-500">Loading visitor...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <FormCard
        title="Edit visitor"
        footer={
          <Link to={ROUTES.VISITORS} className="font-medium text-indigo-600 hover:text-indigo-700">
            Back to visitors
          </Link>
        }
      >
        {error ? <FormAlert message={error.message} errors={error.errors} /> : null}
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Edit visitor"
      subtitle="Update visitor details and keep the log accurate."
      footer={
        <Link to={ROUTES.VISITORS} className="font-medium text-indigo-600 hover:text-indigo-700">
          Back to visitors
        </Link>
      }
    >
      <VisitorForm
        initialValues={visitor}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        submitLabel="Update visitor"
      />
    </FormCard>
  );
};

export default EditVisitor;