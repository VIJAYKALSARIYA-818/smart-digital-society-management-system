import { getUserInitials } from "@/utils/userHelpers";

const DashboardWelcome = ({ user }) => {
  const initials = getUserInitials(user.fullName);
  const greeting = getGreeting();

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
            <p className="mt-1 text-sm text-indigo-100">
              Manage your society operations from one smart dashboard.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 sm:min-w-56">
          <p className="text-xs uppercase tracking-wide text-indigo-100">
            Account Details
          </p>
          <p className="mt-2 text-sm font-medium">{user.email}</p>
          <p className="mt-1 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
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
