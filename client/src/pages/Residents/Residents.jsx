import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import ResidentTable from "@/components/residents/ResidentTable";
import SearchBar from "@/components/residents/SearchBar";
import { ROUTES } from "@/constants/routes";
import { deleteResident, fetchResidents } from "@/services/residentService";
import { getApiError } from "@/utils/apiError";

const PAGE_SIZE = 10;

const Residents = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [residents, setResidents] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: PAGE_SIZE,
		total: 0,
		totalPages: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
	const [residentToDelete, setResidentToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
	const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
	const currentSearch = searchParams.get("search") || "";

	useEffect(() => {
		setSearchValue(currentSearch);
	}, [currentSearch]);

	const loadResidents = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const { data } = await fetchResidents({
				page: currentPage,
				limit: PAGE_SIZE,
				search: currentSearch || undefined,
			});

			setResidents(data.data.residents);
			setPagination(data.data.pagination);
		} catch (fetchError) {
			setError(getApiError(fetchError));
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, currentSearch]);

	useEffect(() => {
		loadResidents();
	}, [loadResidents]);

	const updateQueryParams = useCallback(
		(nextSearch, nextPage = 1) => {
			const params = new URLSearchParams(searchParams);

			if (nextSearch) {
				params.set("search", nextSearch);
			} else {
				params.delete("search");
			}

			params.set("page", String(nextPage));
			setSearchParams(params, { replace: true });
		},
		[searchParams, setSearchParams],
	);

	const handleSearch = (value) => {
		setSearchValue(value);
		updateQueryParams(value.trim(), 1);
	};

	const handleClearSearch = () => {
		setSearchValue("");
		updateQueryParams("", 1);
	};

	const handlePageChange = (nextPage) => {
		updateQueryParams(currentSearch, nextPage);
	};

	const handleViewResident = (resident) => {
		navigate(ROUTES.RESIDENTS_DETAILS.replace(":residentId", resident.id));
	};

	const handleEditResident = (resident) => {
		navigate(ROUTES.RESIDENTS_EDIT.replace(":residentId", resident.id));
	};

	const handleDeleteResident = (resident) => {
		setResidentToDelete(resident);
	};

	const confirmDeleteResident = async () => {
		if (!residentToDelete) {
			return;
		}

		setIsDeleting(true);
		setError(null);

		try {
			await deleteResident(residentToDelete.id);
			setResidentToDelete(null);
			await loadResidents();
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
						Residents
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						Manage society residents, search records, and keep contact details current.
					</p>
				</div>

				<Button type="button" onClick={() => navigate(ROUTES.RESIDENTS_NEW)}>
					Add resident
				</Button>
			</div>

			{error ? <FormAlert message={error.message} errors={error.errors} /> : null}

			<SearchBar
				value={searchValue}
				onChange={handleSearch}
				onSubmit={() => updateQueryParams(searchValue.trim(), 1)}
				onClear={handleClearSearch}
				isSearching={isLoading}
			/>

			<section className="space-y-4">
				{isLoading ? (
					<div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
						<div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
						<p className="mt-3 text-sm text-slate-500">Loading residents...</p>
					</div>
				) : (
					<ResidentTable
						residents={residents}
						onView={handleViewResident}
						onEdit={handleEditResident}
						onDelete={handleDeleteResident}
					/>
				)}
			</section>

			{!isLoading && pagination.totalPages > 1 ? (
				<div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row">
					<p className="text-sm text-slate-500">
						Showing {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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
				isOpen={Boolean(residentToDelete)}
				entityLabel="resident"
				entityName={residentToDelete?.fullName}
				title="Delete resident"
				description={`This will permanently delete ${residentToDelete?.fullName || "this resident"} from the system.`}
				isDeleting={isDeleting}
				onCancel={() => setResidentToDelete(null)}
				onConfirm={confirmDeleteResident}
			/>
		</div>
	);
};

export default Residents;
