import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import ResidentCard from "@/components/residents/ResidentCard";
import { ROUTES } from "@/constants/routes";
import { deleteResident, fetchResident } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const ResidentDetails = () => {
	const navigate = useNavigate();
	const { residentId } = useParams();
	const [resident, setResident] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const loadResident = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const { data } = await fetchResident(residentId);
				setResident(data.data.resident);
			} catch (fetchError) {
				setError(getApiError(fetchError));
			} finally {
				setIsLoading(false);
			}
		};

		loadResident();
	}, [residentId]);

	const handleDelete = async () => {
		if (!deleteTarget) {
			return;
		}

		setIsDeleting(true);

		try {
			await deleteResident(deleteTarget.id);
			navigate(ROUTES.RESIDENTS, { replace: true });
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
				<p className="mt-3 text-center text-sm text-slate-500">Loading resident details...</p>
			</div>
		);
	}

	if (!resident) {
		return (
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
				<FormAlert message={error?.message || "Resident not found"} errors={error?.errors || []} />
				<div className="mt-4">
					<Button type="button" variant="outline" onClick={() => navigate(ROUTES.RESIDENTS)}>
						Back to residents
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
					<h1 className="text-2xl font-semibold tracking-tight text-slate-900">Resident details</h1>
					<p className="mt-1 text-sm text-slate-500">Review and manage a single resident record.</p>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button type="button" variant="outline" onClick={() => navigate(ROUTES.RESIDENTS)}>
						Back
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => navigate(ROUTES.RESIDENTS_EDIT.replace(":residentId", resident.id))}
					>
						Edit
					</Button>
					<Button type="button" onClick={() => setDeleteTarget(resident)}>
						Delete
					</Button>
				</div>
			</div>

			<ResidentCard resident={resident} />

			<DeleteModal
				isOpen={Boolean(deleteTarget)}
				entityLabel="resident"
				entityName={deleteTarget?.fullName}
				title="Delete resident"
				description={`This will permanently delete ${deleteTarget?.fullName || "this resident"} from the system.`}
				isDeleting={isDeleting}
				onCancel={() => setDeleteTarget(null)}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

export default ResidentDetails;
