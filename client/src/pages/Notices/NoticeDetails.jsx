import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import NoticeCard from "@/components/notices/NoticeCard";
import { ROUTES } from "@/constants/routes";
import { deleteNotice, fetchNotice, publishNotice, unpublishNotice } from "@/services/noticeService";
import { getApiError } from "@/utils/apiError";

const NoticeDetails = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

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

  useEffect(() => {
    loadNotice();
  }, [noticeId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await deleteNotice(deleteTarget.id);
      navigate(ROUTES.NOTICE_BOARD, { replace: true });
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    setIsToggling(true);
    setError(null);

    try {
      if (notice.isPublished) {
        await unpublishNotice(noticeId);
      } else {
        await publishNotice(noticeId);
      }

      await loadNotice();
    } catch (toggleError) {
      setError(getApiError(toggleError));
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-center text-sm text-slate-500">Loading notice details...</p>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error?.message || "Notice not found"} errors={error?.errors || []} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.NOTICE_BOARD)}>
            Back to notice board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notice details</h1>
          <p className="mt-1 text-sm text-slate-500">Review notice status, publish state, and attachment details.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.NOTICE_BOARD)}>Back</Button>
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.NOTICES_EDIT.replace(":noticeId", notice.id))}>Edit</Button>
          <Button type="button" variant="outline" onClick={handleTogglePublish} disabled={isToggling}>
            {isToggling ? "Updating..." : notice.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button type="button" onClick={() => setDeleteTarget(notice)}>Delete</Button>
        </div>
      </div>

      <NoticeCard notice={notice} />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        entityLabel="notice"
        entityName={deleteTarget?.title}
        title="Delete notice"
        description={`This will permanently delete ${deleteTarget?.title || "this notice"} from the system.`}
        confirmLabel="Delete notice"
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default NoticeDetails;