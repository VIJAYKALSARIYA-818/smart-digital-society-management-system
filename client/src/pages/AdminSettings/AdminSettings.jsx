import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import DeleteModal from "@/components/residents/DeleteModal";
import SearchBar from "@/components/residents/SearchBar";
import CreateUserModal from "@/components/admin/CreateUserModal";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { deleteUser, fetchUsers, updateUserRole, updateUserStatus } from "@/services/adminService";
import { fetchSettings, updateSettings } from "@/services/settingsService";
import { getApiError } from "@/utils/apiError";
import useAuthUser from "@/hooks/useAuthUser";

const PAGE_SIZE = 10;

const USER_ROLES = ["Resident", "Society Admin", "Security Guard", "Maintenance Staff"];

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    societyName: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
    maintenanceDueDay: 1,
    noticeBoardEnabled: true,
    visitorPreApproval: false,
  });
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  const parsedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || "";
  const currentIsActive = searchParams.get("isActive") || "";

  useEffect(() => {
    // Check if user is admin
    if (currentUser && currentUser.role !== "Society Admin") {
      setIsUnauthorized(true);
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const loadUsers = useCallback(async () => {
    if (isUnauthorized) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchUsers({
        page: currentPage,
        limit: PAGE_SIZE,
        search: currentSearch || undefined,
        role: currentRole || undefined,
        isActive: currentIsActive || undefined,
      });

      setUsers(data.data?.users || []);
      setPagination(data.data?.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 0,
      });
    } catch (fetchError) {
      console.error("Failed to load users:", fetchError);
      const apiError = getApiError(fetchError);
      
      if (apiError.message?.includes("Insufficient permissions") || apiError.message?.includes("403")) {
        setIsUnauthorized(true);
      }
      
      setError(apiError);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSearch, currentRole, currentIsActive, isUnauthorized]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const loadSettings = useCallback(async () => {
    setSettingsError(null);

    try {
      const { data } = await fetchSettings();
      setSettings(data.data.settings);
    } catch (error) {
      setSettingsError(getApiError(error));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "settings") {
      loadSettings();
    }
  }, [activeTab, loadSettings]);

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

      if (nextValues.role !== undefined) {
        if (nextValues.role) {
          params.set("role", nextValues.role);
        } else {
          params.delete("role");
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
      role: currentRole,
      isActive: currentIsActive,
    });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateQueryParams({
      search: "",
      page: 1,
      role: currentRole,
      isActive: currentIsActive,
    });
  };

  const handlePageChange = (nextPage) => {
    updateQueryParams({
      search: currentSearch,
      page: nextPage,
      role: currentRole,
      isActive: currentIsActive,
    });
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams({
      search: currentSearch,
      page: 1,
      role: currentRole,
      isActive: currentIsActive,
      [key]: value,
    });
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      await loadUsers();
    } catch (deleteError) {
      setError(getApiError(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    setError(null);

    try {
      await updateUserStatus(user.id, !user.isActive);
      await loadUsers();
    } catch (error) {
      setError(getApiError(error));
    }
  };

  const handleChangeRole = async (user, newRole) => {
    setError(null);

    try {
      await updateUserRole(user.id, newRole);
      await loadUsers();
    } catch (error) {
      setError(getApiError(error));
    }
  };

  const formatRole = (role) => {
    const roleStyles = {
      "Society Admin": "bg-purple-50 text-purple-700",
      "Security Guard": "bg-blue-50 text-blue-700",
      "Maintenance Staff": "bg-green-50 text-green-700",
      "Resident": "bg-slate-50 text-slate-700",
    };
    const style = roleStyles[role] || roleStyles.Resident;
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>{role}</span>;
  };

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSettingsSaving(true);
    setSettingsError(null);

    try {
      await updateSettings(settings);
      // Show success feedback
    } catch (error) {
      setSettingsError(getApiError(error));
    } finally {
      setIsSettingsSaving(false);
    }
  };

  if (isUnauthorized) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-900">Access Denied</h1>
          <p className="mt-2 text-red-700">
            You don't have permission to access Admin Settings. This feature is only available to Society Admins.
          </p>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Admin Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles, and system configuration.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={[
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "users"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900",
          ].join(" ")}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={[
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900",
          ].join(" ")}
        >
          Society Settings
        </button>
      </div>

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <SearchBar
                label="Search users"
                placeholder="Search by name, email, or flat number"
                submitLabel="Search"
                clearLabel="Clear"
                value={searchValue}
                onChange={handleSearch}
                onSubmit={() =>
                  updateQueryParams({
                    search: searchValue.trim(),
                    page: 1,
                    role: currentRole,
                    isActive: currentIsActive,
                  })
                }
                onClear={handleClearSearch}
                isSearching={isLoading}
              />
            </div>

            <div className="w-full lg:w-48">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                value={currentRole}
                onChange={(event) => handleFilterChange("role", event.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                disabled={isLoading}
              >
                <option value="">All</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
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

            <Button onClick={() => setIsCreateUserModalOpen(true)}>
              Create User
            </Button>
          </div>

          {error ? <FormAlert message={error.message} errors={error.errors} /> : null}

          <section className="space-y-4">
            {isLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <p className="mt-3 text-sm text-slate-500">Loading users...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
                <p className="text-sm text-red-800 font-medium">{error.message}</p>
                <Button
                  type="button"
                  onClick={loadUsers}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-base font-medium text-slate-900">No users found</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search term or check your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          User
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Flat
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Role
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
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-4">
                            <p className="font-medium text-slate-900">{user.fullName}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">{user.phone}</td>
                          <td className="px-4 py-4 text-sm text-slate-700">{user.flatNumber}</td>
                          <td className="px-4 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleChangeRole(user, e.target.value)}
                              className="text-sm border border-slate-300 rounded px-2 py-1"
                              disabled={user.id === currentUser?.id}
                            >
                              {USER_ROLES.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={[
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                user.isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600",
                              ].join(" ")}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex flex-wrap justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleToggleStatus(user)}
                                disabled={user.id === currentUser?.id}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                disabled={user.id === currentUser?.id}
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
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Society Information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure basic society information and contact details.
            </p>

            {settingsError && <FormAlert type="error" message={settingsError.message} className="mt-4" />}

            <form onSubmit={handleSaveSettings} className="mt-6 space-y-4">
              <Input
                label="Society Name"
                name="societyName"
                value={settings.societyName}
                onChange={handleSettingsChange}
                placeholder="Enter society name"
                disabled={isSettingsSaving}
              />

              <Input
                label="Address"
                name="address"
                value={settings.address}
                onChange={handleSettingsChange}
                placeholder="Enter society address"
                disabled={isSettingsSaving}
              />

              <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleSettingsChange}
                placeholder="Enter contact email"
                disabled={isSettingsSaving}
              />

              <Input
                label="Contact Phone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleSettingsChange}
                placeholder="Enter contact phone"
                disabled={isSettingsSaving}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Maintenance Due Day
                  </label>
                  <select
                    name="maintenanceDueDay"
                    value={settings.maintenanceDueDay}
                    onChange={handleSettingsChange}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    disabled={isSettingsSaving}
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Day of the month when maintenance is due
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="noticeBoardEnabled"
                    checked={settings.noticeBoardEnabled}
                    onChange={handleSettingsChange}
                    disabled={isSettingsSaving}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Enable Notice Board</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="visitorPreApproval"
                    checked={settings.visitorPreApproval}
                    onChange={handleSettingsChange}
                    disabled={isSettingsSaving}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">Require Visitor Pre-Approval</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSettingsSaving}>
                  {isSettingsSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Role Information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Overview of user roles and their permissions in the system.
            </p>

            <div className="mt-6 space-y-4">
              {USER_ROLES.map((role) => (
                <div key={role} className="flex items-start gap-4 rounded-lg border border-slate-200 p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{role}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {role === "Society Admin" && "Full access to all society management features including user management, settings, and all administrative functions."}
                      {role === "Security Guard" && "Access to visitor management, parking oversight, and security-related features."}
                      {role === "Maintenance Staff" && "Access to maintenance bill management, complaint handling, and facility-related features."}
                      {role === "Resident" && "Limited access to personal information, booking amenities, viewing notices, and submitting complaints."}
                    </p>
                  </div>
                  <div>
                    {formatRole(role)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={Boolean(userToDelete)}
        entityLabel="user"
        entityName={userToDelete?.fullName}
        title="Delete user"
        description={`This will permanently delete ${userToDelete?.fullName || "this user"} from the system.`}
        isDeleting={isDeleting}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
      />

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onCancel={() => setIsCreateUserModalOpen(false)}
        onSuccess={() => {
          setIsCreateUserModalOpen(false);
          loadUsers();
        }}
      />
    </div>
  );
};

export default AdminSettings;