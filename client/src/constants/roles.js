/**
 * Role-based access for society modules.
 * Keep in sync with server/src/constants/roles.js
 */
export const ROLES = {
  ADMIN: "Society Admin",
  RESIDENT: "Resident",
  GUARD: "Security Guard",
  STAFF: "Maintenance Staff",
};

export const ALL_ROLES = Object.values(ROLES);

/**
 * Which roles can open each module.
 */
export const MODULE_ACCESS = {
  dashboard: ALL_ROLES,
  residents: [ROLES.ADMIN],
  visitors: [ROLES.ADMIN, ROLES.GUARD],
  complaints: [ROLES.ADMIN, ROLES.STAFF, ROLES.RESIDENT],
  maintenance: [ROLES.ADMIN, ROLES.STAFF, ROLES.RESIDENT],
  parking: [ROLES.ADMIN, ROLES.GUARD, ROLES.RESIDENT],
  amenities: [ROLES.ADMIN, ROLES.STAFF, ROLES.RESIDENT],
  bookings: [ROLES.ADMIN, ROLES.RESIDENT],
  packages: [ROLES.ADMIN, ROLES.GUARD, ROLES.RESIDENT],
  notices: ALL_ROLES,
  admin: [ROLES.ADMIN],
};

export const ROLE_DASHBOARD_COPY = {
  [ROLES.ADMIN]: "Full society control — residents, billing, security, and settings.",
  [ROLES.GUARD]: "Focus on gate security — visitors, parking, and package deliveries.",
  [ROLES.STAFF]: "Handle facility work — complaints, maintenance bills, and amenities.",
  [ROLES.RESIDENT]: "Your resident portal — notices, bookings, complaints, and bills.",
};

export const canAccessModule = (role, moduleKey) => {
  const allowed = MODULE_ACCESS[moduleKey];
  if (!allowed) return false;
  return allowed.includes(role);
};

export const filterByRole = (items, role, moduleKeyGetter) =>
  items.filter((item) => canAccessModule(role, moduleKeyGetter(item)));
