import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { fetchPackage, deletePackage } from "@/services/packageService";
import { getApiError } from "@/utils/apiError";

const PackageDetails = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPackageDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await fetchPackage(packageId);
        setPkg(data.data.package);
      } catch (err) {
        const apiError = getApiError(err);
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackageDetails();
  }, [packageId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this package?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deletePackage(packageId);
      navigate(ROUTES.PACKAGE_TRACKING);
    } catch (deleteError) {
      const apiError = getApiError(deleteError);
      setError(apiError);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      Expected: { color: "bg-blue-50 text-blue-700", label: "Expected" },
      Received: { color: "bg-yellow-50 text-yellow-700", label: "Received" },
      Delivered: { color: "bg-emerald-50 text-emerald-700", label: "Delivered" },
      "Picked Up": { color: "bg-purple-50 text-purple-700", label: "Picked Up" },
      Returned: { color: "bg-orange-50 text-orange-700", label: "Returned" },
      Cancelled: { color: "bg-red-50 text-red-700", label: "Cancelled" },
    };
    const style = statusMap[status] || statusMap.Expected;
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

  if (error || !pkg) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-900">Error</h1>
        <p className="mt-2 text-red-700">
          {error?.message || "Package not found"}
        </p>
        <Button onClick={() => navigate(ROUTES.PACKAGE_TRACKING)} className="mt-4">
          Back to Packages
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Package Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View package tracking information and delivery status
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.PACKAGE_TRACKING)}>
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Package Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Tracking Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.trackingNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Package Type</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.packageType}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Courier/Company</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.courier}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd className="mt-1">{formatStatus(pkg.status)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Description</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.description || "No description available"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recipient Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Resident Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.residentName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Flat Number</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.flatNumber}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Block</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.block || "N/A"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Sender Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Sender Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.senderName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Sender Contact</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.senderContact || "N/A"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Timeline</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Expected Delivery Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(pkg.expectedDeliveryDate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Actual Delivery Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(pkg.actualDeliveryDate)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Received Date</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDate(pkg.receivedDate)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Delivery Person</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Delivery Person Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.deliveryPersonName || "N/A"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Delivery Person Contact</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.deliveryPersonContact || "N/A"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Additional Information</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Notes</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.notes || "No notes available"}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Active</dt>
              <dd className="mt-1 text-sm text-slate-900">{pkg.isActive ? "Yes" : "No"}</dd>
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
                  {new Date(pkg.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Date(pkg.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.PACKAGE_TRACKING_EDIT.replace(":packageId", packageId))}
        >
          Edit Package
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? "Deleting..." : "Delete Package"}
        </Button>
      </div>
    </div>
  );
};

export default PackageDetails;