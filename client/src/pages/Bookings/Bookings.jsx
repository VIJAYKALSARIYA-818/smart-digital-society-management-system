import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import { ROUTES } from "@/constants/routes";
import { deleteBooking, fetchBookings } from "@/services/bookingService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const BOOKING_STATUSES = [
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

const Bookings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchBookings({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        status: currentStatus || undefined,
      });

      setBookings(data.data?.bookings || []);
      setPagination(data.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } catch (fetchError) {
      console.error("Failed to load bookings:", fetchError);
      setError(getApiError(fetchError));
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentStatus]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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

      if (nextValues.status !== undefined) {
        if (nextValues.status) {
          params.set("status", nextValues.status);
        } else {
          params.delete("status");
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
      status: currentStatus,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      status: currentStatus,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      status: currentStatus,
    });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({
      search: currentSearch,
      page: 1,
      status: currentStatus,
      [key]: value,
    });
  };

  const handleViewBooking = (booking) => {
    navigate(ROUTES.BOOKINGS_DETAILS.replace(":bookingId", booking.id));
  };

  const handleEditBooking = (booking) => {
    navigate(ROUTES.BOOKINGS_EDIT.replace(":bookingId", booking.id));
  };

  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
  };

  const confirmDeleteBooking = async () => {
    if (!bookingToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteBooking(bookingToDelete.id);
      setBookingToDelete(null);
      await loadBookings();
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      Pending: { color: "bg-yellow-50 text-yellow-700", label: "Pending" },
      Confirmed: { color: "bg-emerald-50 text-emerald-700", label: "Confirmed" },
      Cancelled: { color: "bg-slate-50 text-slate-700", label: "Cancelled" },
      Completed: { color: "bg-blue-50 text-blue-700", label: "Completed" },
      Rejected: { color: "bg-red-50 text-red-700", label: "Rejected" },
    };
    const style = statusMap[status] || statusMap.Pending;
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.color}`}>{style.label}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Facility Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage amenity bookings and facility reservations.
          </p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.BOOKINGS_NEW)}>
          New Booking
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <SearchBar
            label="Search bookings"
            placeholder="Search by amenity, resident, or purpose"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() =>
              updateQueryParams({
                search: searchValue.trim(),
                page: 1,
                status: currentStatus,
              })
            }
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
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
            {BOOKING_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
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
            <p className="mt-3 text-sm text-slate-500">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
            <Button
              type="button"
              onClick={loadBookings}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-900">No bookings found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or create a new booking.
            </p>
            <div className="mt-5">
              <Button type="button" onClick={() => navigate(ROUTES.BOOKINGS_NEW)}>
                New booking
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amenity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resident
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Time
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
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{booking.amenityName}</p>
                        <p className="text-sm text-slate-500">{booking.purpose || "No purpose"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{booking.residentName}</p>
                        <p className="text-sm text-slate-500">{booking.flatNumber}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(booking.bookingDate)}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-4 py-4">{formatStatus(booking.status)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleViewBooking(booking)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEditBooking(booking)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteBooking(booking)}
                          >
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
        isOpen={Boolean(bookingToDelete)}
        entityLabel="booking"
        entityName={`${bookingToDelete?.amenityName} on ${bookingToDelete?.bookingDate}`}
        title="Delete booking"
        description={`This will permanently delete this booking.`}
        isDeleting={isDeleting}
        onCancel={() => setBookingToDelete(null)}
        onConfirm={confirmDeleteBooking}
      />
    </div>
  );
};

export default Bookings;