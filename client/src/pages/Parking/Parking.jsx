import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import ParkingTable from "@/components/parking/ParkingTable";
import { ROUTES } from "@/constants/routes";
import { deleteParkingSlot, fetchParkingSlots } from "@/services/parkingService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { label: "Latest allocation", value: "createdAt:desc" },
  { label: "Oldest allocation", value: "createdAt:asc" },
  { label: "Slot number A-Z", value: "slotNumber:asc" },
  { label: "Slot number Z-A", value: "slotNumber:desc" },
  { label: "Expiry date", value: "expiryDate:asc" },
];

const Parking = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [parking, setParking] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [parkingToDelete, setParkingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentStatus = searchParams.get("status") || "";
  const currentParkingSlotType = searchParams.get("parkingSlotType") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadParking = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchParkingSlots({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder,
        status: currentStatus || undefined,
        parkingSlotType: currentParkingSlotType || undefined,
      });

      setParking(data.data?.parking || data.data || data.parking || []);
      setPagination(data.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: data.data?.parking?.length || data.data?.length || 0,
        totalPages: 1,
      });
    } catch (fetchError) {
      console.error("Failed to load parking:", fetchError);
      setError(getApiError(fetchError));
      setParking([]);
      setPagination({
        page: 1,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentSortBy, currentSortOrder, currentStatus, currentParkingSlotType]);

  useEffect(() => {
    loadParking();
  }, [loadParking]);

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

      if (nextValues.status !== undefined) {
        if (nextValues.status) {
          params.set("status", nextValues.status);
        } else {
          params.delete("status");
        }
      }

      if (nextValues.parkingSlotType !== undefined) {
        if (nextValues.parkingSlotType) {
          params.set("parkingSlotType", nextValues.parkingSlotType);
        } else {
          params.delete("parkingSlotType");
        }
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
      status: currentStatus,
      parkingSlotType: currentParkingSlotType,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
      status: currentStatus,
      parkingSlotType: currentParkingSlotType,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
      status: currentStatus,
      parkingSlotType: currentParkingSlotType,
    });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split(":");

    updateQueryParams({
      search: currentSearch,
      page: 1,
      sortBy,
      sortOrder,
      status: currentStatus,
      parkingSlotType: currentParkingSlotType,
    });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({
      search: currentSearch,
      page: 1,
      sortBy: currentSortBy,
      sortOrder: currentSortOrder,
      status: currentStatus,
      parkingSlotType: currentParkingSlotType,
      [key]: value,
    });
  };

  const handleViewParking = (slot) => {
    navigate(ROUTES.PARKING_DETAILS.replace(":parkingId", slot.id || slot._id));
  };

  const handleEditParking = (slot) => {
    navigate(ROUTES.PARKING_EDIT.replace(":parkingId", slot.id || slot._id));
  };

  const handleDeleteParking = (slot) => {
    setParkingToDelete(slot);
  };

  const confirmDeleteParking = async () => {
    if (!parkingToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteParkingSlot(parkingToDelete.id || parkingToDelete._id);
      setParkingToDelete(null);
      await loadParking();
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Parking Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage parking slot allocations, track vehicle assignments, and monitor expiry dates.
          </p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.PARKING_NEW)}>
          Add Parking Slot
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <SearchBar
            label="Search parking"
            placeholder="Search by slot, vehicle number, resident, or flat"
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
                status: currentStatus,
                parkingSlotType: currentParkingSlotType,
              })
            }
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Sort by
          </label>
          <select
            value={`${currentSortBy}:${currentSortOrder}`}
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

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={currentStatus}
            onChange={(event) => handleFilterChange("status", event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Slot Type
          </label>
          <select
            value={currentParkingSlotType}
            onChange={(event) => handleFilterChange("parkingSlotType", event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="Covered">Covered</option>
            <option value="Open">Open</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading parking slots...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
            <p className="mt-2 text-xs text-red-600">
              {error.errors?.length > 0 ? error.errors.join(", ") : ""}
            </p>
            <Button
              type="button"
              onClick={loadParking}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : (
          <ParkingTable
            parking={parking}
            onView={handleViewParking}
            onEdit={handleEditParking}
            onDelete={handleDeleteParking}
          />
        )}
      </section>

      {!isLoading && pagination.totalPages > 1 ? (
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
          <p className="text-sm text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
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
        isOpen={Boolean(parkingToDelete)}
        entityLabel="parking slot"
        entityName={parkingToDelete?.slotNumber}
        title="Delete parking slot"
        description={`This will permanently delete parking slot ${parkingToDelete?.slotNumber || "this parking slot"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setParkingToDelete(null)}
        onConfirm={confirmDeleteParking}
      />
    </div>
  );
};

export default Parking;