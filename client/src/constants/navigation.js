import { MODULE_ACCESS } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Sidebar navigation configuration.
 * `module` maps to MODULE_ACCESS for role filtering.
 */
export const SIDEBAR_NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, module: "dashboard" },
  { label: "Residents", path: ROUTES.RESIDENTS, module: "residents" },
  { label: "Visitors", path: ROUTES.VISITORS, module: "visitors" },
  { label: "Complaints", path: ROUTES.COMPLAINTS, module: "complaints" },
  { label: "Maintenance", path: ROUTES.MAINTENANCE, module: "maintenance" },
  { label: "Parking", path: ROUTES.PARKING, module: "parking" },
  { label: "Amenities", path: ROUTES.AMENITIES, module: "amenities" },
  { label: "Bookings", path: ROUTES.BOOKINGS, module: "bookings" },
  { label: "Package Tracking", path: ROUTES.PACKAGE_TRACKING, module: "packages" },
  { label: "Notice Board", path: ROUTES.NOTICE_BOARD, module: "notices" },
  { label: "Admin Settings", path: ROUTES.ADMIN_SETTINGS, module: "admin" },
];

export { MODULE_ACCESS };
