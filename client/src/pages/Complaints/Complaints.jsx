import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import ComplaintTable from "@/components/complaints/ComplaintTable";
import { ROUTES } from "@/constants/routes";
import { deleteComplaint, fetchComplaints } from "@/services/complaintService";
import { getApiError } from "@/utils/apiError";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "@/utils/complaintHelpers";

const PAGE_SIZE = 10;

const Complaints = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPriority = searchParams.get("priority") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchComplaints({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        status: currentStatus || undefined,
        category: currentCategory || undefined,
        priority: currentPriority || undefined,
      });

      setComplaints(data.data.complaints);
      setPagination(data.data.pagination);
    } catch (fetchError) {
      setError(getApiError(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentStatus, currentCategory, currentPriority]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const updateQueryParams = useCallback((nextValues) => {
    const params = new URLSearchParams(searchParams);

    if (nextValues.search !== undefined) {
      if (nextValues.search) params.set("search", nextValues.search);
      else params.delete("search");
    }

    ["status", "category", "priority"].forEach((key) => {
      if (nextValues[key] !== undefined) {
        if (nextValues[key]) params.set(key, nextValues[key]);
        else params.delete(key);
      }
    });

    params.set("page", String(nextValues.page || 1));
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSearch = (value) => {
    setSearchValue(value);
    updateQueryParams({ search: value.trim(), page: 1, status: currentStatus, category: currentCategory, priority: currentPriority });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({ search: "", page: 1, status: currentStatus, category: currentCategory, priority: currentPriority });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({ search: currentSearch, page: 1, status: currentStatus, category: currentCategory, priority: currentPriority, [key]: value });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({ search: currentSearch, page: nextPage, status: currentStatus, category: currentCategory, priority: currentPriority });
  };

  const handleViewComplaint = (complaint) => {
    navigate(ROUTES.COMPLAINTS_DETAILS.replace(":complaintId", complaint.id));
  };

  const handleEditComplaint = (complaint) => {
    navigate(ROUTES.COMPLAINTS_EDIT.replace(":complaintId", complaint.id));
  };

  const handleDeleteComplaint = (complaint) => {
    setComplaintToDelete(complaint);
  };

  const confirmDeleteComplaint = async () => {
    if (!complaintToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteComplaint(complaintToDelete.id);
      setComplaintToDelete(null);
      await loadComplaints();
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Complaints</h1>
          <p className="mt-1 text-sm text-slate-500">Track resident complaints and service requests in one place.</p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.COMPLAINTS_NEW)}>
          Add complaint
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchBar
            label="Search complaints"
            placeholder="Search by title, resident, flat, assignee, or resolution"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() => updateQueryParams({ search: searchValue.trim(), page: 1, status: currentStatus, category: currentCategory, priority: currentPriority })}
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select value={currentStatus} onChange={(event) => handleFilterChange("status", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {COMPLAINT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select value={currentPriority} onChange={(event) => handleFilterChange("priority", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {COMPLAINT_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <select value={currentCategory} onChange={(event) => handleFilterChange("category", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {COMPLAINT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading complaints...</p>
          </div>
        ) : (
          <ComplaintTable complaints={complaints} onView={handleViewComplaint} onEdit={handleEditComplaint} onDelete={handleDeleteComplaint} />
        )}
      </section>

      {!isLoading && pagination.totalPages > 1 ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
          <p className="text-sm text-slate-500">Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</Button>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">Page {pagination.page} of {pagination.totalPages}</span>
            <Button type="button" variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= pagination.totalPages}>Next</Button>
          </div>
        </div>
      ) : null}

      <DeleteModal
        isOpen={Boolean(complaintToDelete)}
        entityLabel="complaint"
        entityName={complaintToDelete?.title}
        title="Delete complaint"
        description={`This will permanently delete ${complaintToDelete?.title || "this complaint"} from the system.`}
        confirmLabel="Delete complaint"
        isDeleting={isDeleting}
        onCancel={() => setComplaintToDelete(null)}
        onConfirm={confirmDeleteComplaint}
      />
    </div>
  );
};

export default Complaints;