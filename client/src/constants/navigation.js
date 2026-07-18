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
  { label: "Package Tracking", path: ROUTES.PACKAGE_TRACKING },
  { label: "Amenities", path: ROUTES.AMENITIES },
  { label: "Notice Board", path: ROUTES.NOTICE_BOARD },
  { label: "Settings", path: ROUTES.SETTINGS },
];
