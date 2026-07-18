/**
 * Builds user initials from a full name for avatar display.
 * @param {string} fullName
 * @returns {string}
 */
export const getUserInitials = (fullName = "") => {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
