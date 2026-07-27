import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import FormCard from "@/components/ui/FormCard";
import ResidentForm from "@/components/residents/ResidentForm";
import { ROUTES } from "@/constants/routes";
import { fetchResident, updateResident } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const EditResident = () => {
	const navigate = useNavigate();
	const { residentId } = useParams();
	const [resident, setResident] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

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

	const handleSubmit = async (payload) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const { data } = await updateResident(residentId, payload);
			navigate(ROUTES.RESIDENTS_DETAILS.replace(":residentId", data.data.resident.id), {
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
				<p className="mt-3 text-center text-sm text-slate-500">Loading resident...</p>
			</div>
		);
	}

	if (!resident) {
		return (
			<FormCard
				title="Edit resident"
				footer={
					<Link to={ROUTES.RESIDENTS} className="font-medium text-indigo-600 hover:text-indigo-700">
						Back to residents
					</Link>
				}
			>
				{error ? <FormAlert message={error.message} errors={error.errors} /> : null}
			</FormCard>
		);
	}

	return (
		<FormCard
			title="Edit resident"
			subtitle="Update resident details and keep their record current."
			footer={
				<Link to={ROUTES.RESIDENTS} className="font-medium text-indigo-600 hover:text-indigo-700">
					Back to residents
				</Link>
			}
		>
			<ResidentForm
				initialValues={resident}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				error={error}
				submitLabel="Update resident"
			/>
		</FormCard>
	);
};

export default EditResident;
