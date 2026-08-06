import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import VisitorTable from "@/components/visitors/VisitorTable";
import { ROUTES } from "@/constants/routes";
import { deleteVisitor, fetchVisitors } from "@/services/visitorService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "Latest check-in", value: "checkInTime:desc" },
  { label: "Oldest check-in", value: "checkInTime:asc" },
  { label: "Name A-Z", value: "fullName:asc" },
  { label: "Name Z-A", value: "fullName:desc" },
  { label: "Flat A-Z", value: "flatNumber:asc" },
  { label: "Status", value: "status:asc" },
];

const Visitors = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [visitors, setVisitors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [visitorToDelete, setVisitorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "checkInTime";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const currentSortValue = useMemo(
    () => `${currentSortBy}:${currentSortOrder}`,
    [currentSortBy, currentSortOrder],
  );

  const loadVisitors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchVisitors({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder,
      });

      setVisitors(data.data.visitors);
      setPagination(data.data.pagination);
    } catch (fetchError) {
      setError(getApiError(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentSortBy, currentSortOrder]);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  const updateQueryParams = useCallback(
    (nextValues) => {
      const params = new URLSearchParams(searchParams);

      if (nextValues.search !== undefined) {
        if (nextValues.search) {
          params.set("search", nextValues.search);
        } else {
          params.delete("search");
        }
      }

      if (nextValues.sortBy) {
        params.set("sortBy", nextValues.sortBy);
      }

      if (nextValues.sortOrder) {
        params.set("sortOrder", nextValues.sortOrder);
      }

      params.set("page", String(nextValues.page || 1));
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (value) => {
    setSearchValue(value);
    updateQueryParams({
      search: value.trim(),
      page: 1,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
    });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(":");

    updateQueryParams({
      search: currentSearch,
      page: 1,
      sortBy,
      sortOrder,
    });
  };

  const handleViewVisitor = (visitor) => {
    navigate(ROUTES.VISITORS_DETAILS.replace(":visitorId", visitor.id));
  };

  const handleEditVisitor = (visitor) => {
    navigate(ROUTES.VISITORS_EDIT.replace(":visitorId", visitor.id));
  };

  const handleDeleteVisitor = (visitor) => {
    setVisitorToDelete(visitor);
  };

  const confirmDeleteVisitor = async () => {
    if (!visitorToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteVisitor(visitorToDelete.id);
      setVisitorToDelete(null);
      await loadVisitors();
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Visitors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage entry logs, search visitor records, and review check-in history.
          </p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.VISITORS_NEW)}>
          Add visitor
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <SearchBar
            label="Search visitors"
            placeholder="Search by name, phone, purpose, flat, or vehicle number"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() =>
              updateQueryParams({
                search: searchValue.trim(),
                page: 1,
                sortBy: currentSortBy,
                sortOrder: currentSortOrder,
              })
            }
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div className="w-full lg:w-72">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Sort by</label>
          <select
            value={currentSortValue}
            onChange={(event) => handleSortChange(event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading visitors...</p>
          </div>
        ) : (
          <VisitorTable
            visitors={visitors}
            onView={handleViewVisitor}
            onEdit={handleEditVisitor}
            onDelete={handleDeleteVisitor}
          />
        )}
      </section>

      {!isLoading && pagination.totalPages > 1 ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
          <p className="text-sm text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <DeleteModal
        isOpen={Boolean(visitorToDelete)}
        entityLabel="visitor"
        entityName={visitorToDelete?.fullName}
        title="Delete visitor"
        description={`This will permanently delete ${visitorToDelete?.fullName || "this visitor"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setVisitorToDelete(null)}
        onConfirm={confirmDeleteVisitor}
      />
    </div>
  );
};

export default Visitors;