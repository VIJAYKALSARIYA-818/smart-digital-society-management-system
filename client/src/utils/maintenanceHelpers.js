export const BILL_STATUSES = ["Pending", "Paid", "Overdue"];
export const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card"];

export const BILL_MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const formatBillDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value));
};

export const getBillInitials = (residentName = "") => residentName.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

export const getMonthLabel = (monthNumber) => BILL_MONTHS.find((month) => month.value === Number(monthNumber))?.label || `Month ${monthNumber}`;

export const getStatusStyles = (status) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700";
    case "Overdue":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
};

export const getPaymentHistoryLabel = (entry) => {
  if (!entry) {
    return "-";
  }

  return `${entry.status} on ${formatBillDate(entry.paymentDate)}`;
};

export const getYearOptions = (span = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: span * 2 + 1 }, (_, index) => currentYear - span + index);
};