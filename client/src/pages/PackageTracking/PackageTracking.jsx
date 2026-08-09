import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import { ROUTES } from "@/constants/routes";
import { deletePackage, fetchPackages } from "@/services/packageService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const PACKAGE_STATUSES = [
  { value: "", label: "All" },
  { value: "Expected", label: "Expected" },
  { value: "Received", label: "Received" },
  { value: "Delivered", label: "Delivered" },
  { value: "Picked Up", label: "Picked Up" },
  { value: "Returned", label: "Returned" },
  { value: "Cancelled", label: "Cancelled" },
];

const PACKAGE_TYPES = [
  { value: "", label: "All" },
  { value: "Parcel", label: "Parcel" },
  { value: "Envelope", label: "Envelope" },
  { value: "Document", label: "Document" },
  { value: "Fragile", label: "Fragile" },
  { value: "Food", label: "Food" },
  { value: "Electronics", label: "Electronics" },
  { value: "Other", label: "Other" },
];

const PackageTracking = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentPackageType = searchParams.get("packageType") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchPackages({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        status: currentStatus || undefined,
        packageType: currentPackageType || undefined,
      });

      setPackages(data.data?.packages || []);
      setPagination(data.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } catch (fetchError) {
      console.error("Failed to load packages:", fetchError);
      setError(getApiError(fetchError));
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentStatus, currentPackageType]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

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

      if (nextValues.packageType !== undefined) {
        if (nextValues.packageType) {
          params.set("packageType", nextValues.packageType);
        } else {
          params.delete("packageType");
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
      packageType: currentPackageType,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      status: currentStatus,
      packageType: currentPackageType,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      status: currentStatus,
      packageType: currentPackageType,
    });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({
      search: currentSearch,
      page: 1,
      status: currentStatus,
      packageType: currentPackageType,
      [key]: value,
    });
  };

  const handleViewPackage = (pkg) => {
    navigate(ROUTES.PACKAGE_TRACKING_DETAILS.replace(":packageId", pkg.id));
  };

  const handleEditPackage = (pkg) => {
    navigate(ROUTES.PACKAGE_TRACKING_EDIT.replace(":packageId", pkg.id));
  };

  const handleDeletePackage = (pkg) => {
    setPackageToDelete(pkg);
  };

  const confirmDeletePackage = async () => {
    if (!packageToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deletePackage(packageToDelete.id);
      setPackageToDelete(null);
      await loadPackages();
    } catch (deleteError) {
      setError(getApiError(deleteError));
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
            Package Delivery Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage package deliveries for residents.
          </p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.PACKAGE_TRACKING_NEW)}>
          Add Package
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <SearchBar
            label="Search packages"
            placeholder="Search by tracking number, resident, or courier"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() =>
              updateQueryParams({
                search: searchValue.trim(),
                page: 1,
                status: currentStatus,
                packageType: currentPackageType,
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
            {PACKAGE_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Package Type
          </label>
          <select
            value={currentPackageType}
            onChange={(event) => handleFilterChange("packageType", event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            {PACKAGE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
            <p className="mt-3 text-sm text-slate-500">Loading packages...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
            <Button
              type="button"
              onClick={loadPackages}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : packages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-900">No packages found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or add a new package.
            </p>
            <div className="mt-5">
              <Button type="button" onClick={() => navigate(ROUTES.PACKAGE_TRACKING_NEW)}>
                Add package
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
                      Tracking Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resident
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Courier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Expected Delivery
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
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{pkg.trackingNumber}</p>
                        <p className="text-sm text-slate-500">{pkg.packageType}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{pkg.residentName}</p>
                        <p className="text-sm text-slate-500">{pkg.flatNumber} {pkg.block ? `(${pkg.block})` : ""}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{pkg.courier}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(pkg.expectedDeliveryDate)}</td>
                      <td className="px-4 py-4">{formatStatus(pkg.status)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleViewPackage(pkg)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEditPackage(pkg)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeletePackage(pkg)}
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
        isOpen={Boolean(packageToDelete)}
        entityLabel="package"
        entityName={packageToDelete?.trackingNumber}
        title="Delete package"
        description={`This will permanently delete ${packageToDelete?.trackingNumber || "this package"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setPackageToDelete(null)}
        onConfirm={confirmDeletePackage}
      />
    </div>
  );
};

export default PackageTracking;