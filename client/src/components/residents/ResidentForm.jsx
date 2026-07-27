import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import Input from "@/components/ui/Input";
import { toResidentDateInputValue } from "@/utils/residentHelpers";

const RESIDENT_TYPES = ["Owner", "Tenant", "Family Member", "Other"];

const ResidentForm = ({
	initialValues = {},
	submitLabel = "Save resident",
	isSubmitting = false,
	error = null,
	onSubmit,
}) => {
	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		onSubmit({
			fullName: formData.get("fullName"),
			email: formData.get("email"),
			phone: formData.get("phone"),
			flatNumber: formData.get("flatNumber"),
			block: formData.get("block"),
			residentType: formData.get("residentType"),
			moveInDate: formData.get("moveInDate"),
			profileImage: formData.get("profileImage"),
			notes: formData.get("notes"),
			isActive: formData.get("isActive") === "on",
		});
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit} noValidate>
			{error && (error.message || error.errors?.length > 0) ? (
				<FormAlert message={error.message} errors={error.errors} />
			) : null}

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<Input
					label="Full Name"
					name="fullName"
					type="text"
					placeholder="Enter resident full name"
					autoComplete="name"
					defaultValue={initialValues.fullName || ""}
					required
					disabled={isSubmitting}
				/>

				<Input
					label="Email"
					name="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					defaultValue={initialValues.email || ""}
					required
					disabled={isSubmitting}
				/>

				<Input
					label="Phone"
					name="phone"
					type="tel"
					placeholder="+91 98765 43210"
					autoComplete="tel"
					defaultValue={initialValues.phone || ""}
					required
					disabled={isSubmitting}
				/>

				<Input
					label="Flat Number"
					name="flatNumber"
					type="text"
					placeholder="e.g. A-101"
					defaultValue={initialValues.flatNumber || ""}
					required
					disabled={isSubmitting}
				/>

				<Input
					label="Block"
					name="block"
					type="text"
					placeholder="e.g. Block A"
					defaultValue={initialValues.block || ""}
					disabled={isSubmitting}
				/>

				<div>
					<label className="mb-1.5 block text-sm font-medium text-slate-700">Resident Type</label>
					<select
						name="residentType"
						defaultValue={initialValues.residentType || "Owner"}
						className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
						disabled={isSubmitting}
					>
						{RESIDENT_TYPES.map((residentType) => (
							<option key={residentType} value={residentType}>
								{residentType}
							</option>
						))}
					</select>
				</div>

				<Input
					label="Move-in Date"
					name="moveInDate"
					type="date"
					defaultValue={toResidentDateInputValue(initialValues.moveInDate)}
					disabled={isSubmitting}
				/>

				<Input
					label="Profile Image URL"
					name="profileImage"
					type="url"
					placeholder="https://example.com/profile.jpg"
					defaultValue={initialValues.profileImage || ""}
					disabled={isSubmitting}
				/>
			</div>

			<div>
				<label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
				<textarea
					name="notes"
					rows={4}
					defaultValue={initialValues.notes || ""}
					placeholder="Optional resident notes"
					className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
					disabled={isSubmitting}
				/>
			</div>

			<label className="inline-flex items-center gap-2 text-sm text-slate-700">
				<input
					type="checkbox"
					name="isActive"
					defaultChecked={initialValues.isActive ?? true}
					className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
					disabled={isSubmitting}
				/>
				Active resident
			</label>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : submitLabel}
				</Button>
			</div>
		</form>
	);
};

export default ResidentForm;
