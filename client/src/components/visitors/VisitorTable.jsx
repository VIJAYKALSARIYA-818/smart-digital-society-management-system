import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import VisitorCard from "@/components/visitors/VisitorCard";
import { ROUTES } from "@/constants/routes";
import { formatVisitorDate } from "@/utils/visitorHelpers";

const VisitorTable = ({ visitors, onView, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (visitors.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-medium text-slate-900">No visitors found</p>
        <p className="mt-2 text-sm text-slate-500">
          Try a different search term or add a new visitor.
        </p>
        <div className="mt-5">
          <Button type="button" onClick={() => navigate(ROUTES.VISITORS_NEW)}>
            Add visitor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {visitors.map((visitor) => (
          <VisitorCard
            key={visitor.id}
            visitor={visitor}
            actions={
              <>
                <Button type="button" variant="outline" onClick={() => onView(visitor)}>
                  View
                </Button>
                <Button type="button" variant="outline" onClick={() => onEdit(visitor)}>
                  Edit
                </Button>
                <Button type="button" onClick={() => onDelete(visitor)}>
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
                  Visitor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resident / Flat
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Purpose
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Check-in
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
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{visitor.fullName}</p>
                      <p className="text-sm text-slate-500">{visitor.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {visitor.residentName} • {visitor.flatNumber}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{visitor.purpose}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatVisitorDate(visitor.checkInTime)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        visitor.status === "Inside"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      {visitor.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => onView(visitor)}>
                        View
                      </Button>
                      <Button type="button" variant="outline" onClick={() => onEdit(visitor)}>
                        Edit
                      </Button>
                      <Button type="button" onClick={() => onDelete(visitor)}>
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

export default VisitorTable;