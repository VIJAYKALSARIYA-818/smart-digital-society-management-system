export const formatNoticeDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getNoticeInitials = (title = "") => {
  return title
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const NOTICE_CATEGORIES = ["General", "Maintenance", "Emergency", "Event", "Meeting", "Holiday", "Security"];
export const NOTICE_PRIORITIES = ["Low", "Medium", "High"];