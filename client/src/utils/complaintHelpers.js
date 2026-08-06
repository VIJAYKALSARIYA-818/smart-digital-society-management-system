export const formatComplaintDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getComplaintInitials = (title = "") => {
  return title
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const COMPLAINT_CATEGORIES = [
  "Water",
  "Electricity",
  "Lift",
  "Security",
  "Parking",
  "Cleaning",
  "Maintenance",
  "Other",
];

export const COMPLAINT_PRIORITIES = ["Low", "Medium", "High", "Critical"];
export const COMPLAINT_STATUSES = ["Open", "In Progress", "Resolved", "Closed"];