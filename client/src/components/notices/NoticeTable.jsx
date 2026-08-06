import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import NoticeCard from "@/components/notices/NoticeCard";
import { ROUTES } from "@/constants/routes";
import { formatNoticeDate } from "@/utils/noticeHelpers";

const NoticeTable = ({ notices, onView, onEdit, onDelete, onTogglePublish }) => {
  const navigate = useNavigate();

  if (notices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-medium text-slate-900">No notices found</p>
        <p className="mt-2 text-sm text-slate-500">Try adjusting filters or add a new notice.</p>
        <div className="mt-5">
          <Button type="button" onClick={() => navigate(ROUTES.NOTICES_NEW)}>Add notice</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 md:hidden">
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            actions={
              <>
                <Button type="button" variant="outline" onClick={() => onView(notice)}>View</Button>
                <Button type="button" variant="outline" onClick={() => onEdit(notice)}>Edit</Button>
                <Button type="button" variant="outline" onClick={() => onTogglePublish(notice)}>
                  {notice.isPublished ? "Unpublish" : "Publish"}
                </Button>
                <Button type="button" onClick={() => onDelete(notice)}>Delete</Button>
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Notice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Publish / Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{notice.title}</p>
                      <p className="text-sm text-slate-500 line-clamp-2">{notice.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{notice.category}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{notice.priority}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{formatNoticeDate(notice.publishDate)} to {formatNoticeDate(notice.expiryDate)}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{notice.isPublished ? "Published" : "Draft"}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => onView(notice)}>View</Button>
                      <Button type="button" variant="outline" onClick={() => onEdit(notice)}>Edit</Button>
                      <Button type="button" variant="outline" onClick={() => onTogglePublish(notice)}>{notice.isPublished ? "Unpublish" : "Publish"}</Button>
                      <Button type="button" onClick={() => onDelete(notice)}>Delete</Button>
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

export default NoticeTable;