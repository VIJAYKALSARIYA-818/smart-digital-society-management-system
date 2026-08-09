import { ROUTES } from "@/constants/routes";

/**
 * Sidebar navigation configuration.
 * Each item maps a label to an existing or future dashboard route.
 */
export const SIDEBAR_NAV_ITEMS = [
  { label: "Dashboard", path: ROUTES.DASHBOARD },
  { label: "Residents", path: ROUTES.RESIDENTS },
  { label: "Visitors", path: ROUTES.VISITORS },
  { label: "Complaints", path: ROUTES.COMPLAINTS },
  { label: "Maintenance", path: ROUTES.MAINTENANCE },
  { label: "Parking", path: ROUTES.PARKING },
  { label: "Amenities", path: ROUTES.AMENITIES },
  { label: "Bookings", path: ROUTES.BOOKINGS },
  { label: "Package Tracking", path: ROUTES.PACKAGE_TRACKING },
  { label: "Notice Board", path: ROUTES.NOTICE_BOARD },
  { label: "Admin Settings", path: ROUTES.ADMIN_SETTINGS, adminOnly: true },
  { label: "Settings", path: ROUTES.SETTINGS },
];
