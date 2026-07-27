import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import ResidentCard from "@/components/residents/ResidentCard";
import { ROUTES } from "@/constants/routes";
import { formatResidentDate } from "@/utils/residentHelpers";

const ResidentTable = ({ residents, onView, onEdit, onDelete }) => {
	const navigate = useNavigate();

	if (residents.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
				<p className="text-base font-medium text-slate-900">No residents found</p>
				<p className="mt-2 text-sm text-slate-500">
					Try a different search term or add a new resident.
				</p>
				<div className="mt-5">
					<Button type="button" onClick={() => navigate(ROUTES.RESIDENTS_NEW)}>
						Add resident
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="space-y-4 md:hidden">
				{residents.map((resident) => (
					<ResidentCard
						key={resident.id}
						resident={resident}
						actions={
							<>
								<Button type="button" variant="outline" onClick={() => onView(resident)}>
									View
								</Button>
								<Button type="button" variant="outline" onClick={() => onEdit(resident)}>
									Edit
								</Button>
								<Button type="button" onClick={() => onDelete(resident)}>
									Delete
								</Button>
							</>
						}
					/>
				))}
			</div>

			<div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-slate-200">
						<thead className="bg-slate-50">
							<tr>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Resident
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Flat
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Contact
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Type
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Move-in
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
									Status
								</th>
								<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{residents.map((resident) => (
								<tr key={resident.id} className="hover:bg-slate-50/70">
									<td className="px-4 py-4">
										<div>
											<p className="font-medium text-slate-900">{resident.fullName}</p>
											<p className="text-sm text-slate-500">{resident.email}</p>
										</div>
									</td>
									<td className="px-4 py-4 text-sm text-slate-700">{resident.flatNumber}</td>
									<td className="px-4 py-4 text-sm text-slate-700">{resident.phone}</td>
									<td className="px-4 py-4 text-sm text-slate-700">{resident.residentType}</td>
									  <td className="px-4 py-4 text-sm text-slate-700">{formatResidentDate(resident.moveInDate)}</td>
									<td className="px-4 py-4">
										<span
											className={[
												"inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
												resident.isActive
													? "bg-emerald-50 text-emerald-700"
													: "bg-slate-100 text-slate-600",
											].join(" ")}
										>
											{resident.isActive ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="px-4 py-4 text-right">
										<div className="inline-flex flex-wrap justify-end gap-2">
											<Button type="button" variant="outline" onClick={() => onView(resident)}>
												View
											</Button>
											<Button type="button" variant="outline" onClick={() => onEdit(resident)}>
												Edit
											</Button>
											<Button type="button" onClick={() => onDelete(resident)}>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ResidentTable;
