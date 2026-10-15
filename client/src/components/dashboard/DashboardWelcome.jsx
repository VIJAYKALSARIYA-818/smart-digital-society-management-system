import { ROLE_DASHBOARD_COPY, ROLES } from "@/constants/roles";
import { getUserInitials } from "@/utils/userHelpers";

const ROLE_BADGE_CLASS = {
  [ROLES.ADMIN]: "bg-amber-400/20 text-amber-50 ring-amber-200/30",
  [ROLES.GUARD]: "bg-sky-400/20 text-sky-50 ring-sky-200/30",
  [ROLES.STAFF]: "bg-emerald-400/20 text-emerald-50 ring-emerald-200/30",
  [ROLES.RESIDENT]: "bg-violet-400/20 text-violet-50 ring-violet-200/30",
};

const DashboardWelcome = ({ user }) => {
  const initials = getUserInitials(user.fullName);
  const greeting = getGreeting();
  const roleCopy =
    ROLE_DASHBOARD_COPY[user.role] ||
    "Manage your society operations from one smart dashboard.";
  const badgeClass =
    ROLE_BADGE_CLASS[user.role] || "bg-white/15 text-white ring-white/15";

  return (
    <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-xl font-semibold">
              {initials}
            </div>
          )}

          <div>
            <p className="text-sm text-indigo-100">{greeting}</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back, {user.fullName}
            </h1>
            <p className="mt-1 text-sm text-indigo-100">{roleCopy}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 sm:min-w-56">
          <p className="text-xs uppercase tracking-wide text-indigo-100">
            Account Details
          </p>
          <p className="mt-2 text-sm font-medium">{user.email}</p>
          {user.flatNumber ? (
            <p className="mt-1 text-xs text-indigo-100">Flat: {user.flatNumber}</p>
          ) : null}
          {user.phone ? (
            <p className="mt-1 text-xs text-indigo-100">Phone: {user.phone}</p>
          ) : null}
          <p
            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeClass}`}
          >
            {user.role}
          </p>
        </div>
      </div>
    </section>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export default DashboardWelcome;
