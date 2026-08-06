import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import ComplaintCard from "@/components/complaints/ComplaintCard";
import { ROUTES } from "@/constants/routes";
import { formatComplaintDate } from "@/utils/complaintHelpers";

const ComplaintTable = ({ complaints, onView, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-medium text-slate-900">No complaints found</p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting filters or add a new complaint.
        </p>
        <div className="mt-5">
          <Button type="button" onClick={() => navigate(ROUTES.COMPLAINTS_NEW)}>
            Add complaint
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {complaints.map((complaint) => (
          <ComplaintCard
            key={complaint.id}
            complaint={complaint}
            actions={
              <>
                <Button type="button" variant="outline" onClick={() => onView(complaint)}>
                  View
                </Button>
                <Button type="button" variant="outline" onClick={() => onEdit(complaint)}>
                  Edit
                </Button>
                <Button type="button" onClick={() => onDelete(complaint)}>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Complaint</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Resident</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{complaint.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-2">{complaint.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {complaint.residentName}
                    <p className="text-xs text-slate-500">{complaint.flatNumber}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{complaint.category}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{complaint.priority}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{complaint.status}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatComplaintDate(complaint.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => onView(complaint)}>View</Button>
                      <Button type="button" variant="outline" onClick={() => onEdit(complaint)}>Edit</Button>
                      <Button type="button" onClick={() => onDelete(complaint)}>Delete</Button>
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

export default ComplaintTable;