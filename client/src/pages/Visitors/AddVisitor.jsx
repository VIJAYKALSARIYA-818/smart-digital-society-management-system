import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import VisitorForm from "@/components/visitors/VisitorForm";
import { ROUTES } from "@/constants/routes";
import { createVisitor } from "@/services/visitorService";
import { getApiError } from "@/utils/apiError";

const AddVisitor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await createVisitor(payload);
      navigate(ROUTES.VISITORS_DETAILS.replace(":visitorId", data.data.visitor.id), {
        replace: true,
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Add visitor"
      subtitle="Create a new visitor entry and capture arrival details."
      footer={
        <Link to={ROUTES.VISITORS} className="font-medium text-indigo-600 hover:text-indigo-700">
          Back to visitors
        </Link>
      }
    >
      <VisitorForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        submitLabel="Create visitor"
      />
    </FormCard>
  );
};

export default AddVisitor;