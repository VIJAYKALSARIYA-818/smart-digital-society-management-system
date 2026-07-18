import { useState } from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import useAuth from "@/hooks/useAuth";
import { getUserInitials } from "@/utils/userHelpers";

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: mobile menu + brand */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open sidebar menu"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
            onClick={onMenuToggle}
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white sm:flex">
              <HiOutlineBuildingOffice2 className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                {appName}
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                {user?.role || "Dashboard"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: actions + user */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="View notifications"
            className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden />

          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
              aria-hidden
            >
              {getUserInitials(user?.fullName)}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiOutlineArrowRightOnRectangle className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
