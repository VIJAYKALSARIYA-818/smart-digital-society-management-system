import {
  HiOutlineBellAlert,
  HiOutlineBuildingOffice2,
  HiOutlineClipboardDocumentList,
  HiOutlineCreditCard,
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineMegaphone,
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineUserPlus,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { ROUTES } from "@/constants/routes";

export const DASHBOARD_STATS = [
  {
    id: "residents",
    title: "Total Residents",
    value: "248",
    description: "Registered society members",
    icon: HiOutlineUserGroup,
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "visitors",
    title: "Total Visitors",
    value: "36",
    description: "Entries logged this month",
    icon: HiOutlineUserPlus,
    accent: "bg-sky-50 text-sky-600",
  },
  {
    id: "complaints",
    title: "Active Complaints",
    value: "12",
    description: "Pending resolution",
    icon: HiOutlineExclamationCircle,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    id: "maintenance",
    title: "Maintenance Requests",
    value: "8",
    description: "Open service requests",
    icon: HiOutlineWrenchScrewdriver,
    accent: "bg-orange-50 text-orange-600",
  },
  {
    id: "parking",
    title: "Parking Slots",
    value: "142",
    description: "Allocated vehicle slots",
    icon: HiOutlineTruck,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    id: "packages",
    title: "Delivered Packages",
    value: "57",
    description: "Collected this week",
    icon: HiOutlineCube,
    accent: "bg-teal-50 text-teal-600",
  },
  {
    id: "notices",
    title: "Notices",
    value: "6",
    description: "Active announcements",
    icon: HiOutlineMegaphone,
    accent: "bg-rose-50 text-rose-600",
  },
  {
    id: "amenities",
    title: "Amenities",
    value: "4",
    description: "Bookings today",
    icon: HiOutlineSparkles,
    accent: "bg-emerald-50 text-emerald-600",
  },
];

export const QUICK_ACTIONS = [
  {
    id: "add-resident",
    title: "Add Resident",
    description: "Register a new society member",
    icon: HiOutlineUserGroup,
    route: ROUTES.RESIDENTS,
  },
  {
    id: "add-visitor",
    title: "Add Visitor",
    description: "Create a visitor entry pass",
    icon: HiOutlineUserPlus,
    route: ROUTES.VISITORS,
  },
  {
    id: "register-complaint",
    title: "Register Complaint",
    description: "Log a new resident complaint",
    icon: HiOutlineExclamationCircle,
    route: ROUTES.COMPLAINTS,
  },
  {
    id: "pay-maintenance",
    title: "Pay Maintenance",
    description: "Review and pay monthly dues",
    icon: HiOutlineCreditCard,
    route: ROUTES.MAINTENANCE,
  },
  {
    id: "book-amenity",
    title: "Book Amenity",
    description: "Reserve clubhouse or facilities",
    icon: HiOutlineSparkles,
    route: ROUTES.AMENITIES,
  },
  {
    id: "view-notices",
    title: "View Notices",
    description: "Read latest society updates",
    icon: HiOutlineClipboardDocumentList,
    route: ROUTES.NOTICE_BOARD,
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "Resident Registered",
    description: "Flat B-204 added by society admin",
    time: "10 minutes ago",
    icon: HiOutlineUserGroup,
    accent: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 2,
    title: "Visitor Approved",
    description: "Guest pass issued for Flat A-101",
    time: "35 minutes ago",
    icon: HiOutlineUserPlus,
    accent: "bg-sky-50 text-sky-600",
  },
  {
    id: 3,
    title: "Complaint Submitted",
    description: "Water leakage reported in Block C",
    time: "1 hour ago",
    icon: HiOutlineExclamationCircle,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    id: 4,
    title: "Maintenance Paid",
    description: "March dues received from Flat D-302",
    time: "2 hours ago",
    icon: HiOutlineCreditCard,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 5,
    title: "Parking Allocated",
    description: "Slot P-18 assigned to Flat A-505",
    time: "3 hours ago",
    icon: HiOutlineTruck,
    accent: "bg-violet-50 text-violet-600",
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    description: "Scheduled maintenance on Sunday, 9 AM to 12 PM.",
    date: "Mar 16, 2026",
    tag: "Maintenance",
  },
  {
    id: 2,
    title: "Society Meeting",
    description: "Annual general meeting in the community hall.",
    date: "Mar 18, 2026",
    tag: "Event",
  },
  {
    id: 3,
    title: "Festival Celebration",
    description: "Register for the society cultural event by Friday.",
    date: "Mar 20, 2026",
    tag: "Community",
  },
  {
    id: 4,
    title: "Parking Guidelines",
    description: "Updated visitor parking rules effective immediately.",
    date: "Mar 22, 2026",
    tag: "Notice",
  },
];

export const SOCIETY_INFO = {
  name: "Smart Digital Society",
  totalBlocks: 4,
  totalFlats: 320,
  securityStatus: "Active",
};

export const SOCIETY_INFO_ICON = HiOutlineBuildingOffice2;
export const ANNOUNCEMENT_ICON = HiOutlineBellAlert;
