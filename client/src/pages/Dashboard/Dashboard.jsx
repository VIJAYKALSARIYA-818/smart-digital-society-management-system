import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineUserPlus,
  HiOutlineExclamationCircle,
  HiOutlineBanknotes,
  HiOutlineTruck,
  HiOutlineMegaphone,
  HiOutlineCalendar,
  HiOutlineCube,
} from "react-icons/hi2";
import FormAlert from "@/components/common/FormAlert";
import ActivityItem from "@/components/dashboard/ActivityItem";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import InfoWidget from "@/components/dashboard/InfoWidget";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Button from "@/components/ui/Button";
import { ROLES, canAccessModule } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import { fetchDashboardSummary } from "@/services/dashboardService";
import { getApiError } from "@/utils/apiError";

const QUICK_ACTIONS = [
  {
    id: "add-resident",
    title: "Add Resident",
    description: "Register a new resident in the society",
    icon: HiOutlineUserGroup,
    route: ROUTES.RESIDENTS_NEW,
    module: "residents",
    roles: [ROLES.ADMIN],
  },
  {
    id: "add-visitor",
    title: "Add Visitor",
    description: "Log a new visitor entry",
    icon: HiOutlineUserPlus,
    route: ROUTES.VISITORS_NEW,
    module: "visitors",
    roles: [ROLES.ADMIN, ROLES.GUARD],
  },
  {
    id: "add-complaint",
    title: "Add Complaint",
    description: "Record a new complaint or issue",
    icon: HiOutlineExclamationCircle,
    route: ROUTES.COMPLAINTS_NEW,
    module: "complaints",
    roles: [ROLES.ADMIN, ROLES.STAFF, ROLES.RESIDENT],
  },
  {
    id: "add-maintenance",
    title: "Add Maintenance Bill",
    description: "Create a new maintenance bill",
    icon: HiOutlineBanknotes,
    route: ROUTES.MAINTENANCE_NEW,
    module: "maintenance",
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    id: "add-parking",
    title: "Add Parking Slot",
    description: "Allocate a new parking slot",
    icon: HiOutlineTruck,
    route: ROUTES.PARKING_NEW,
    module: "parking",
    roles: [ROLES.ADMIN, ROLES.GUARD],
  },
  {
    id: "add-notice",
    title: "Add Notice",
    description: "Post a new notice or announcement",
    icon: HiOutlineMegaphone,
    route: ROUTES.NOTICES_NEW,
    module: "notices",
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    id: "add-booking",
    title: "Add Booking",
    description: "Create a new amenity booking",
    icon: HiOutlineCalendar,
    route: ROUTES.BOOKINGS_NEW,
    module: "bookings",
    roles: [ROLES.ADMIN, ROLES.RESIDENT],
  },
  {
    id: "add-package",
    title: "Add Package",
    description: "Register a new package delivery",
    icon: HiOutlineCube,
    route: ROUTES.PACKAGE_TRACKING_NEW,
    module: "packages",
    roles: [ROLES.ADMIN, ROLES.GUARD],
  },
];

const DASHBOARD_CARDS = [
  {
    id: "residents",
    title: "Total Residents",
    value: 0,
    description: "Active residents in society",
    icon: HiOutlineUserGroup,
    color: "blue",
    trend: "+0",
    module: "residents",
  },
  {
    id: "visitors",
    title: "Total Visitors",
    value: 0,
    description: "Registered visitors",
    icon: HiOutlineUserPlus,
    color: "green",
    trend: "+0",
    module: "visitors",
  },
  {
    id: "complaints",
    title: "Open Complaints",
    value: 0,
    description: "Pending and in-progress issues",
    icon: HiOutlineExclamationCircle,
    color: "yellow",
    trend: "+0",
    module: "complaints",
  },
  {
    id: "maintenance",
    title: "Pending Bills",
    value: 0,
    description: "Unpaid maintenance bills",
    icon: HiOutlineBanknotes,
    color: "red",
    trend: "+0",
    module: "maintenance",
  },
  {
    id: "parking",
    title: "Active Parking",
    value: 0,
    description: "Allocated parking slots",
    icon: HiOutlineTruck,
    color: "purple",
    trend: "+0",
    module: "parking",
  },
  {
    id: "amenities",
    title: "Total Amenities",
    value: 0,
    description: "Available facilities",
    icon: HiOutlineCalendar,
    color: "indigo",
    trend: "+0",
    module: "amenities",
  },
  {
    id: "bookings",
    title: "Upcoming Bookings",
    value: 0,
    description: "Confirmed amenity bookings",
    icon: HiOutlineCalendar,
    color: "emerald",
    trend: "+0",
    module: "bookings",
  },
  {
    id: "packages",
    title: "Expected Packages",
    value: 0,
    description: "Packages awaiting delivery",
    icon: HiOutlineCube,
    color: "orange",
    trend: "+0",
    module: "packages",
  },
];

const ANALYTICS_PANELS = [
  { key: "complaintsByStatus", title: "Complaints by Status", module: "complaints" },
  { key: "maintenanceBillsByStatus", title: "Maintenance Bills", module: "maintenance" },
  { key: "parkingByStatus", title: "Parking Status", module: "parking" },
  { key: "packageDeliveryStatus", title: "Package Delivery Status", module: "packages" },
  { key: "amenityBookingStatus", title: "Amenity Booking Status", module: "bookings" },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Annual General Meeting",
    description: "Society AGM scheduled for next Saturday at 10 AM in community hall",
    date: "2024-01-15",
    priority: "high",
  },
  {
    id: 2,
    title: "Water Tank Maintenance",
    description: "Water tank cleaning scheduled for this weekend",
    date: "2024-01-14",
    priority: "medium",
  },
  {
    id: 3,
    title: "Security System Upgrade",
    description: "New CCTV cameras being installed in common areas",
    date: "2024-01-16",
    priority: "low",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchDashboardSummary();
      setDashboardData(data.data || {});
    } catch (err) {
      console.error("Dashboard data load error:", err);
      const apiError = getApiError(err);
      setError(apiError);
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    loadDashboardData();
  }, [user?.id]);

  const handleQuickAction = (route) => {
    navigate(route);
  };

  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error.message} errors={error.errors} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={loadDashboardData}>
            Retry loading dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message="Unable to load your profile. Please try again." />
      </div>
    );
  }

  const role = user.role;

  const dashboardCards = DASHBOARD_CARDS.filter((card) =>
    canAccessModule(role, card.module)
  ).map((card) => {
    let value = 0;
    try {
      switch (card.id) {
        case "residents":
          value = dashboardData?.summary?.totalResidents || 0;
          break;
        case "visitors":
          value = dashboardData?.summary?.totalVisitors || 0;
          break;
        case "complaints":
          value = dashboardData?.summary?.openComplaints || 0;
          break;
        case "maintenance":
          value = dashboardData?.summary?.pendingMaintenanceBills || 0;
          break;
        case "parking":
          value = dashboardData?.summary?.activeParkingSlots || 0;
          break;
        case "amenities":
          value = dashboardData?.summary?.totalAmenities || 0;
          break;
        case "bookings":
          value = dashboardData?.summary?.upcomingBookings || 0;
          break;
        case "packages":
          value = dashboardData?.summary?.expectedPackages || 0;
          break;
        default:
          value = 0;
      }
    } catch (err) {
      console.error(`Error calculating card value for ${card.id}:`, err);
      value = 0;
    }

    const colorMap = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      yellow: "bg-yellow-50 text-yellow-600",
      red: "bg-red-50 text-red-600",
      purple: "bg-purple-50 text-purple-600",
      indigo: "bg-indigo-50 text-indigo-600",
      emerald: "bg-emerald-50 text-emerald-600",
      orange: "bg-orange-50 text-orange-600",
    };

    return { ...card, value, accent: colorMap[card.color] || colorMap.blue };
  });

  const quickActions = QUICK_ACTIONS.filter((action) =>
    action.roles.includes(role)
  );

  const analyticsPanels = ANALYTICS_PANELS.filter((panel) =>
    canAccessModule(role, panel.module)
  );

  const analytics = dashboardData?.analytics || {};
  const recentActivities = Array.isArray(dashboardData?.recentActivities) ? dashboardData.recentActivities : [];

  const formatAnalyticsDisplay = (analytics, label) => {
    try {
      if (!analytics || typeof analytics !== 'object') {
        return <p className="text-sm text-slate-500">No data available</p>;
      }
      const entries = Object.entries(analytics);
      if (entries.length === 0) {
        return <p className="text-sm text-slate-500">No data available</p>;
      }
      const maxValue = Math.max(...Object.values(analytics), 1);
      return (
        <div className="space-y-2">
          {entries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{status}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-16 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(count / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900">{count}</span>
              </div>
            </div>
          ))}
        </div>
      );
    } catch (err) {
      console.error(`Error formatting analytics for ${label}:`, err);
      return <p className="text-sm text-slate-500">Error loading data</p>;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardWelcome user={user} />

      <section>
        <SectionHeader
          title="Overview"
          description="Key society metrics at a glance."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {dashboardCards.map((stat) => (
            <DashboardCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Quick Actions"
          description="Common tasks to manage daily society operations."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {quickActions.length === 0 ? (
            <p className="text-sm text-slate-500 sm:col-span-2 lg:col-span-4">
              No quick actions available for your role.
            </p>
          ) : (
            quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={() => handleQuickAction(action.route)}
              />
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 xl:col-span-2">
          <SectionHeader
            title="Recent Activity"
            description="Latest updates across society modules."
          />
          <div className="mt-2">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity</p>
            ) : (
              recentActivities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  metadata={activity.metadata}
                  createdAt={activity.createdAt}
                  isLast={index === recentActivities.length - 1}
                />
              ))
            )}
          </div>
        </section>

        <div className="space-y-6">
          <InfoWidget />

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Announcements"
              description="Important notices for residents."
            />
            <div className="space-y-3">
              {ANNOUNCEMENTS.map((announcement) => (
                <AnnouncementCard key={announcement.id} {...announcement} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <section>
        <SectionHeader
          title="Analytics Overview"
          description="Detailed statistics across society modules."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyticsPanels.map((panel) => (
            <div
              key={panel.key}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">{panel.title}</h3>
              <div className="mt-4">
                {formatAnalyticsDisplay(analytics[panel.key], panel.title)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;