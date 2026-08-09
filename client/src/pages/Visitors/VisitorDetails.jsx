import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import VisitorCard from "@/components/visitors/VisitorCard";
import { ROUTES } from "@/constants/routes";
import {
  checkInVisitor,
  checkOutVisitor,
  deleteVisitor,
  fetchVisitor,
} from "@/services/visitorService";
import { getApiError } from "@/utils/apiError";

const VisitorDetails = () => {
  const navigate = useNavigate();
  const { visitorId } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadVisitor = useCallback(async () => {
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
  }, [visitorId]);

  useEffect(() => {
    loadVisitor();
  }, [visitorId, loadVisitor]);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteVisitor(deleteTarget.id);
      navigate(ROUTES.VISITORS, { replace: true });
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCheckIn = async () => {
    setIsUpdatingStatus(true);
    setError(null);

    try {
      await checkInVisitor(visitorId);
      await loadVisitor();
    } catch (statusError) {
      setError(getApiError(statusError));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCheckOut = async () => {
    setIsUpdatingStatus(true);
    setError(null);

    try {
      await checkOutVisitor(visitorId);
      await loadVisitor();
    } catch (statusError) {
      setError(getApiError(statusError));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-center text-sm text-slate-500">Loading visitor details...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error?.message || "Visitor not found"} errors={error?.errors || []} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.VISITORS)}>
            Back to visitors
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Visitor details</h1>
          <p className="mt-1 text-sm text-slate-500">Review entry log details and update visitor status.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.VISITORS)}>
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.VISITORS_EDIT.replace(":visitorId", visitor.id))}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCheckIn}
            disabled={isUpdatingStatus || visitor.status === "Inside"}
          >
            {isUpdatingStatus ? "Updating..." : "Check In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCheckOut}
            disabled={isUpdatingStatus || visitor.status === "Exited"}
          >
            {isUpdatingStatus ? "Updating..." : "Check Out"}
          </Button>
          <Button type="button" onClick={() => setDeleteTarget(visitor)}>
            Delete
          </Button>
        </div>
      </div>

      <VisitorCard visitor={visitor} />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        entityLabel="visitor"
        entityName={deleteTarget?.fullName}
        title="Delete visitor"
        description={`This will permanently delete ${deleteTarget?.fullName || "this visitor"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default VisitorDetails;