import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { fetchAmenity, deleteAmenity } from "@/services/amenityService";
import { getApiError } from "@/utils/apiError";

const AmenityDetails = () => {
  const navigate = useNavigate();
  const { amenityId } = useParams();
  const [amenity, setAmenity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadAmenityDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchAmenity(amenityId);
        setAmenity(data.data.amenity);
      } catch (err) {
        const apiError = getApiError(err);
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadAmenityDetails();
  }, [amenityId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this amenity?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAmenity(amenityId);
      navigate(ROUTES.AMENITIES);
    } catch (deleteError) {
      const apiError = getApiError(deleteError);
      setError(apiError);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error || !amenity) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Error</h1>
        <p className="mt-2 text-red-700">
          {error?.message || "Amenity not found"}
        </p>
        <Button onClick={() => navigate(ROUTES.AMENITIES)} className="mt-4">
          Back to Amenities
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Amenity Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View amenity information and configuration
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.AMENITIES)}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Type</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.type}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Capacity</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.capacity} people</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Location</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.location || "N/A"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Operating Hours</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.operatingHours || "N/A"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Booking Fee</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {amenity.bookingFee > 0 ? `$${amenity.bookingFee}` : "Free"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                    amenity.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {amenity.isActive ? "Active" : "Inactive"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Additional Details</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Description</dt>
              <dd className="mt-1 text-sm text-slate-900">{amenity.description || "No description available"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Facilities</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {amenity.facilities?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {amenity.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                ) : (
                  "No facilities listed"
                )}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Requires Approval</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {amenity.requiresApproval ? "Yes" : "No"}
              </dd>
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
                  {new Date(amenity.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(amenity.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.AMENITIES_EDIT.replace(":amenityId", amenityId))}
        >
          Edit Amenity
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Amenity"}
        </Button>
      </div>
    </div>
  );
};

export default AmenityDetails;