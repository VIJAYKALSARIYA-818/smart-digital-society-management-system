import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import { ROUTES } from "@/constants/routes";
import { deleteAmenity, fetchAmenities } from "@/services/amenityService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const Amenities = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [amenities, setAmenities] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [amenityToDelete, setAmenityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("type") || "";
  const currentIsActive = searchParams.get("isActive") || "";

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadAmenities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchAmenities({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        type: currentType || undefined,
        isActive: currentIsActive || undefined,
      });

      setAmenities(data.data?.amenities || []);
      setPagination(data.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } catch (fetchError) {
      console.error("Failed to load amenities:", fetchError);
      setError(getApiError(fetchError));
      setAmenities([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentType, currentIsActive]);

  useEffect(() => {
    loadAmenities();
  }, [loadAmenities]);

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

      if (nextValues.type !== undefined) {
        if (nextValues.type) {
          params.set("type", nextValues.type);
        } else {
          params.delete("type");
        }
      }

      if (nextValues.isActive !== undefined) {
        if (nextValues.isActive) {
          params.set("isActive", nextValues.isActive);
        } else {
          params.delete("isActive");
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
      type: currentType,
      isActive: currentIsActive,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      type: currentType,
      isActive: currentIsActive,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      type: currentType,
      isActive: currentIsActive,
    });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({
      search: currentSearch,
      page: 1,
      type: currentType,
      isActive: currentIsActive,
      [key]: value,
    });
  };

  const handleViewAmenity = (amenity) => {
    navigate(ROUTES.AMENITIES_DETAILS.replace(":amenityId", amenity.id));
  };

  const handleEditAmenity = (amenity) => {
    navigate(ROUTES.AMENITIES_EDIT.replace(":amenityId", amenity.id));
  };

  const handleDeleteAmenity = (amenity) => {
    setAmenityToDelete(amenity);
  };

  const confirmDeleteAmenity = async () => {
    if (!amenityToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteAmenity(amenityToDelete.id);
      setAmenityToDelete(null);
      await loadAmenities();
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
            Amenities & Facilities
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage society amenities, facilities, and their availability.
          </p>
        </div>

        <Button type="button" onClick={() => navigate(ROUTES.AMENITIES_NEW)}>
          Add Amenity
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <SearchBar
            label="Search amenities"
            placeholder="Search by name, type, or location"
            submitLabel="Search"
            clearLabel="Clear"
            value={searchValue}
            onChange={handleSearch}
            onSubmit={() =>
              updateQueryParams({
                search: searchValue.trim(),
                page: 1,
                type: currentType,
                isActive: currentIsActive,
              })
            }
            onClear={handleClearSearch}
            isSearching={isLoading}
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            value={currentType}
            onChange={(event) => handleFilterChange("type", event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="Sports">Sports</option>
            <option value="Recreation">Recreation</option>
            <option value="Community">Community</option>
            <option value="Service">Service</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="w-full lg:w-48">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={currentIsActive}
            onChange={(event) => handleFilterChange("isActive", event.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            disabled={isLoading}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            <p className="mt-3 text-sm text-slate-500">Loading amenities...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-800 font-medium">{error.message}</p>
            <Button
              type="button"
              onClick={loadAmenities}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        ) : amenities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-900">No amenities found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or add a new amenity.
            </p>
            <div className="mt-5">
              <Button type="button" onClick={() => navigate(ROUTES.AMENITIES_NEW)}>
                Add amenity
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
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Capacity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Location
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
                  {amenities.map((amenity) => (
                    <tr key={amenity.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{amenity.name}</p>
                        <p className="text-sm text-slate-500">{amenity.description}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{amenity.type}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{amenity.capacity}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{amenity.location || "N/A"}</td>
                      <td className="px-4 py-4">
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
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleViewAmenity(amenity)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEditAmenity(amenity)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDeleteAmenity(amenity)}
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
        isOpen={Boolean(amenityToDelete)}
        entityLabel="amenity"
        entityName={amenityToDelete?.name}
        title="Delete amenity"
        description={`This will permanently delete ${amenityToDelete?.name || "this amenity"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setAmenityToDelete(null)}
        onConfirm={confirmDeleteAmenity}
      />
    </div>
  );
};

export default Amenities;