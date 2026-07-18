import { NavLink } from "react-router-dom";
import {
  HiOutlineBuildingOffice2,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineUserPlus,
  HiOutlineWrenchScrewdriver,
  HiOutlineXMark,
} from "react-icons/hi2";
import { SIDEBAR_NAV_ITEMS } from "@/constants/navigation";

const NAV_ICONS = {
  Dashboard: HiOutlineChartBarSquare,
  Residents: HiOutlineUserGroup,
  Visitors: HiOutlineUserPlus,
  Complaints: HiOutlineExclamationCircle,
  Maintenance: HiOutlineWrenchScrewdriver,
  Parking: HiOutlineTruck,
  "Package Tracking": HiOutlineCube,
  Amenities: HiOutlineSparkles,
  "Notice Board": HiOutlineClipboardDocumentList,
  Settings: HiOutlineCog6Tooth,
};

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const navLinkClass = ({ isActive }) =>
  [
    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        aria-label="Dashboard navigation"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:static md:z-auto md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <HiOutlineBuildingOffice2 className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Smart Society
              </p>
              <p className="truncate text-xs text-slate-500">Management Portal</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
            onClick={onClose}
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>
          <ul className="space-y-1">
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const Icon = NAV_ICONS[item.label];

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={navLinkClass}
                    onClick={onClose}
                  >
                    {({ isActive }) => (
                      <>
                        {Icon && (
                          <Icon
                            className={[
                              "h-5 w-5 shrink-0",
                              isActive
                                ? "text-indigo-600"
                                : "text-slate-400 group-hover:text-slate-600",
                            ].join(" ")}
                            aria-hidden
                          />
                        )}
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar footer note */}
        <div className="border-t border-slate-200 px-5 py-4">
          <p className="text-xs leading-relaxed text-slate-500">
            {appName}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
