import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import NoticeForm from "@/components/notices/NoticeForm";
import { ROUTES } from "@/constants/routes";
import { createNotice } from "@/services/noticeService";
import { getApiError } from "@/utils/apiError";

const AddNotice = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await createNotice(payload);
      navigate(ROUTES.NOTICES_DETAILS.replace(":noticeId", data.data.notice.id), { replace: true });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Add notice"
      subtitle="Create a new society notice and publish it when ready."
      footer={<Link to={ROUTES.NOTICE_BOARD} className="font-medium text-indigo-600 hover:text-indigo-700">Back to notice board</Link>}
    >
      <NoticeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Create notice" />
    </FormCard>
  );
};

export default AddNotice;