import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import FormCard from "@/components/ui/FormCard";
import NoticeForm from "@/components/notices/NoticeForm";
import { ROUTES } from "@/constants/routes";
import { fetchNotice, updateNotice } from "@/services/noticeService";
import { getApiError } from "@/utils/apiError";

const EditNotice = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotice = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchNotice(noticeId);
        setNotice(data.data.notice);
      } catch (fetchError) {
        setError(getApiError(fetchError));
      } finally {
        setIsLoading(false);
      }
    };

    loadNotice();
  }, [noticeId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await updateNotice(noticeId, payload);
      navigate(ROUTES.NOTICES_DETAILS.replace(":noticeId", data.data.notice.id), { replace: true });
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
        <p className="mt-3 text-center text-sm text-slate-500">Loading notice...</p>
      </div>
    );
  }

  if (!notice) {
    return (
      <FormCard
        title="Edit notice"
        footer={<Link to={ROUTES.NOTICE_BOARD} className="font-medium text-indigo-600 hover:text-indigo-700">Back to notice board</Link>}
      >
        {error ? <FormAlert message={error.message} errors={error.errors} /> : null}
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Edit notice"
      subtitle="Update notice details and keep the board current."
      footer={<Link to={ROUTES.NOTICE_BOARD} className="font-medium text-indigo-600 hover:text-indigo-700">Back to notice board</Link>}
    >
      <NoticeForm initialValues={notice} onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} submitLabel="Update notice" />
    </FormCard>
  );
};

export default EditNotice;