import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import FormAlert from "@/components/common/FormAlert";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import Toast from "@/components/common/Toast";
import MaintenanceBillTable from "@/components/maintenance/MaintenanceBillTable";
import { ROUTES } from "@/constants/routes";
import { deleteMaintenanceBill, fetchMaintenanceBills, markMaintenanceBillPaid } from "@/services/maintenanceService";
import { getApiError } from "@/utils/apiError";
import { BILL_MONTHS, BILL_STATUSES, getYearOptions } from "@/utils/maintenanceHelpers";

const PAGE_SIZE = 10;

const MaintenanceBills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [billToDelete, setBillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(location.state?.successMessage || "");

  const currentPage = Math.max(Number.parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentMonth = searchParams.get("month") || "";
  const currentYear = searchParams.get("year") || "";
  const currentFlatNumber = searchParams.get("flatNumber") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadBills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchMaintenanceBills({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        status: currentStatus || undefined,
        month: currentMonth || undefined,
        year: currentYear || undefined,
        flatNumber: currentFlatNumber || undefined,
      });

      setBills(data.data.bills);
      setPagination(data.data.pagination);
    } catch (fetchError) {
      setError(getApiError(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentStatus, currentMonth, currentYear, currentFlatNumber]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeout = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  const updateQueryParams = useCallback((nextValues) => {
    const params = new URLSearchParams(searchParams);

    if (nextValues.search !== undefined) {
      if (nextValues.search) params.set("search", nextValues.search);
      else params.delete("search");
    }

    ["status", "month", "year", "flatNumber"].forEach((key) => {
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
    updateQueryParams({ search: value.trim(), page: 1, status: currentStatus, month: currentMonth, year: currentYear, flatNumber: currentFlatNumber });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({ search: "", page: 1, status: currentStatus, month: currentMonth, year: currentYear, flatNumber: currentFlatNumber });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({ search: currentSearch, page: 1, status: currentStatus, month: currentMonth, year: currentYear, flatNumber: currentFlatNumber, [key]: value });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({ search: currentSearch, page: nextPage, status: currentStatus, month: currentMonth, year: currentYear, flatNumber: currentFlatNumber });
  };

  const handleViewBill = (bill) => {
    navigate(ROUTES.MAINTENANCE_DETAILS.replace(":billId", bill.id));
  };

  const handleEditBill = (bill) => {
    navigate(ROUTES.MAINTENANCE_EDIT.replace(":billId", bill.id));
  };

  const handleDeleteBill = (bill) => {
    setBillToDelete(bill);
  };

  const handleMarkPaid = async (bill) => {
    setError(null);

    try {
      await markMaintenanceBillPaid(bill.id);
      setToastMessage("Bill marked as paid successfully");
      await loadBills();
    } catch (markError) {
      setError(getApiError(markError));
    }
  };

  const confirmDeleteBill = async () => {
    if (!billToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteMaintenanceBill(billToDelete.id);
      setBillToDelete(null);
      setToastMessage("Bill deleted successfully");
      await loadBills();
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Bills</h1>
          <p className="mt-1 text-sm text-slate-500">Manage monthly bills, payments, and outstanding dues.</p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.MAINTENANCE_NEW)}>Add bill</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchBar
            label="Search bills"
            placeholder="Search by resident, flat, transaction, or remarks"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() => updateQueryParams({ search: searchValue.trim(), page: 1, status: currentStatus, month: currentMonth, year: currentYear, flatNumber: currentFlatNumber })}
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
          <select value={currentStatus} onChange={(event) => handleFilterChange("status", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {BILL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Month</label>
          <select value={currentMonth} onChange={(event) => handleFilterChange("month", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {BILL_MONTHS.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Year</label>
          <select value={currentYear} onChange={(event) => handleFilterChange("year", event.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading}>
            <option value="">All</option>
            {getYearOptions().map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Flat Number</label>
          <input value={currentFlatNumber} onChange={(event) => handleFilterChange("flatNumber", event.target.value)} placeholder="Search flat number" className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={isLoading} />
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading bills...</p>
          </div>
        ) : (
          <MaintenanceBillTable
            bills={bills}
            onView={handleViewBill}
            onEdit={handleEditBill}
            onDelete={handleDeleteBill}
            onMarkPaid={handleMarkPaid}
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
        isOpen={Boolean(billToDelete)}
        entityLabel="bill"
        entityName={billToDelete?.residentName}
        title="Delete bill"
        description={`This will permanently delete ${billToDelete?.residentName || "this bill"} from the system.`}
        confirmLabel="Delete bill"
        isDeleting={isDeleting}
        onCancel={() => setBillToDelete(null)}
        onConfirm={confirmDeleteBill}
      />
    </div>
  );
};

export default MaintenanceBills;