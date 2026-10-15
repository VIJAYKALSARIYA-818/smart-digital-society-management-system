/**
 * Role-based access for society modules.
 * Keep in sync with client/src/constants/roles.js
 */
const ROLES = {
  ADMIN: "Society Admin",
  RESIDENT: "Resident",
  GUARD: "Security Guard",
  STAFF: "Maintenance Staff",
};

const ALL_ROLES = Object.values(ROLES);

const MODULE_ACCESS = {
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

module.exports = {
  ROLES,
  ALL_ROLES,
  MODULE_ACCESS,
};
