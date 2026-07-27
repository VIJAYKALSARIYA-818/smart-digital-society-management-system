import { Link, useNavigate } from "react-router-dom";
import FormCard from "@/components/ui/FormCard";
import ResidentForm from "@/components/residents/ResidentForm";
import { ROUTES } from "@/constants/routes";
import { createResident } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";
import { useState } from "react";

const AddResident = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (payload) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const { data } = await createResident(payload);
			navigate(ROUTES.RESIDENTS_DETAILS.replace(":residentId", data.data.resident.id), {
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
			title="Add resident"
			subtitle="Create a new resident record and store contact and occupancy details."
			footer={
				<Link to={ROUTES.RESIDENTS} className="font-medium text-indigo-600 hover:text-indigo-700">
					Back to residents
				</Link>
			}
		>
			<ResidentForm
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
				error={error}
				submitLabel="Create resident"
			/>
		</FormCard>
	);
};

export default AddResident;
