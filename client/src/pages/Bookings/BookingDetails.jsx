import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { fetchBooking, deleteBooking } from "@/services/bookingService";
import { getApiError } from "@/utils/apiError";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadBookingDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchBooking(bookingId);
        setBooking(data.data.booking);
      } catch (err) {
        const apiError = getApiError(err);
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteBooking(bookingId);
      navigate(ROUTES.BOOKINGS);
    } catch (deleteError) {
      const apiError = getApiError(deleteError);
      setError(apiError);
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
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Error</h1>
        <p className="mt-2 text-red-700">
          {error?.message || "Booking not found"}
        </p>
        <Button onClick={() => navigate(ROUTES.BOOKINGS)} className="mt-4">
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Booking Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View booking information and details
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.BOOKINGS)}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Booking Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Amenity</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.amenityName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Resident</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.residentName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Flat Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.flatNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Purpose</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.purpose || "No purpose specified"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Attendees</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.attendees}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd className="mt-1">{formatStatus(booking.status)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Schedule</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Booking Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(booking.bookingDate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Time Slot</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {booking.startTime} - {booking.endTime}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Notes</dt>
              <dd className="mt-1 text-sm text-slate-900">{booking.notes || "No notes available"}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">System Information</h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Created At</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(booking.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.BOOKINGS_EDIT.replace(":bookingId", bookingId))}
        >
          Edit Booking
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingDetails;