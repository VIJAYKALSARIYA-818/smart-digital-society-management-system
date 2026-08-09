import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import NoticeTable from "@/components/notices/NoticeTable";
import { ROUTES } from "@/constants/routes";
import { deleteNotice, fetchNotices, publishNotice, unpublishNotice } from "@/services/noticeService";
import { getApiError } from "@/utils/apiError";
import { NOTICE_CATEGORIES, NOTICE_PRIORITIES } from "@/utils/noticeHelpers";

const PAGE_SIZE = 10;

const Notices = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentPublished = searchParams.get("isPublished") || "";
  const currentActiveOnly = searchParams.get("activeOnly") || "true";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchNotices({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        category: currentCategory || undefined,
        priority: currentPriority || undefined,
        isPublished: currentPublished || undefined,
        activeOnly: currentActiveOnly,
      });

      setNotices(data.data.notices);
      setPagination(data.data.pagination);
    } catch (fetchError) {
      setError(getApiError(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentCategory, currentPriority, currentPublished, currentActiveOnly]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const updateQueryParams = useCallback((nextValues) => {
    const params = new URLSearchParams(searchParams);

    if (nextValues.search !== undefined) {
      if (nextValues.search) params.set("search", nextValues.search);
      else params.delete("search");
    }

    ["category", "priority", "isPublished", "activeOnly"].forEach((key) => {
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
    updateQueryParams({ search: value.trim(), page: 1, category: currentCategory, priority: currentPriority, isPublished: currentPublished, activeOnly: currentActiveOnly });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({ search: "", page: 1, category: currentCategory, priority: currentPriority, isPublished: currentPublished, activeOnly: currentActiveOnly });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({ search: currentSearch, page: 1, category: currentCategory, priority: currentPriority, isPublished: currentPublished, activeOnly: currentActiveOnly, [key]: value });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({ search: currentSearch, page: nextPage, category: currentCategory, priority: currentPriority, isPublished: currentPublished, activeOnly: currentActiveOnly });
  };

  const handleViewNotice = (notice) => {
    navigate(ROUTES.NOTICES_DETAILS.replace(":noticeId", notice.id));
  };

  const handleEditNotice = (notice) => {
    navigate(ROUTES.NOTICES_EDIT.replace(":noticeId", notice.id));
  };

  const handleDeleteNotice = (notice) => {
    setNoticeToDelete(notice);
  };

  const handleTogglePublish = async (notice) => {
    setError(null);

    try {
      if (notice.isPublished) {
        await unpublishNotice(notice.id);
      } else {
        await publishNotice(notice.id);
      }

      await loadNotices();
    } catch (toggleError) {
      setError(getApiError(toggleError));
    }
  };

  const confirmDeleteNotice = async () => {
    if (!noticeToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteNotice(noticeToDelete.id);
      setNoticeToDelete(null);
      await loadNotices();
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notice Board</h1>
          <p className="mt-1 text-sm text-slate-500">Publish society notices and keep residents informed.</p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.NOTICES_NEW)}>
          Add notice
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchBar
            label="Search notices"
            placeholder="Search by title, description, category, or attachment"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() => updateQueryParams({ search: searchValue.trim(), page: 1, category: currentCategory, priority: currentPriority, isPublished: currentPublished, activeOnly: currentActiveOnly })}
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
          <select value={currentCategory} onChange={(event) => handleFilterChange("category", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {NOTICE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Priority</label>
          <select value={currentPriority} onChange={(event) => handleFilterChange("priority", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {NOTICE_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Visibility</label>
          <select value={currentPublished} onChange={(event) => handleFilterChange("isPublished", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading notices...</p>
          </div>
        ) : (
          <NoticeTable
            notices={notices}
            onView={handleViewNotice}
            onEdit={handleEditNotice}
            onDelete={handleDeleteNotice}
            onTogglePublish={handleTogglePublish}
          />
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
        isOpen={Boolean(noticeToDelete)}
        entityLabel="notice"
        entityName={noticeToDelete?.title}
        title="Delete notice"
        description={`This will permanently delete ${noticeToDelete?.title || "this notice"} from the system.`}
        confirmLabel="Delete notice"
        isDeleting={isDeleting}
        onCancel={() => setNoticeToDelete(null)}
        onConfirm={confirmDeleteNotice}
      />
    </div>
  );
};

export default Notices;