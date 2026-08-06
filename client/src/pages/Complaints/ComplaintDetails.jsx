import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { ROUTES } from "@/constants/routes";
import { deleteComplaint, fetchComplaint } from "@/services/complaintService";
import { getApiError } from "@/utils/apiError";

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    loadComplaint();
  }, [complaintId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await deleteComplaint(deleteTarget.id);
      navigate(ROUTES.COMPLAINTS, { replace: true });
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-center text-sm text-slate-500">Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error?.message || "Complaint not found"} errors={error?.errors || []} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.COMPLAINTS)}>
            Back to complaints
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Complaint details</h1>
          <p className="mt-1 text-sm text-slate-500">Review the full complaint record and update it when needed.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.COMPLAINTS)}>Back</Button>
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.COMPLAINTS_EDIT.replace(":complaintId", complaint.id))}>Edit</Button>
          <Button type="button" onClick={() => setDeleteTarget(complaint)}>Delete</Button>
        </div>
      </div>

      <ComplaintCard complaint={complaint} />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        entityLabel="complaint"
        entityName={deleteTarget?.title}
        title="Delete complaint"
        description={`This will permanently delete ${deleteTarget?.title || "this complaint"} from the system.`}
        confirmLabel="Delete complaint"
        isDeleting={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ComplaintDetails;