import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ROUTES } from "@/constants/routes";
import { fetchDashboardSummary } from "@/services/dashboardService";
import { getApiError } from "@/utils/apiError";
import useDashboardUser from "@/hooks/useDashboardUser";

const QUICK_ACTIONS = [
  {
    id: "add-resident",
    title: "Add Resident",
    description: "Register a new resident in the society",
    icon: "👤",
    route: ROUTES.RESIDENTS_NEW,
  },
  {
    id: "add-visitor",
    title: "Add Visitor",
    description: "Log a new visitor entry",
    icon: "🚶",
    route: ROUTES.VISITORS_NEW,
  },
  {
    id: "add-complaint",
    title: "Add Complaint",
    description: "Record a new complaint or issue",
    icon: "📝",
    route: ROUTES.COMPLAINTS_NEW,
  },
  {
    id: "add-maintenance",
    title: "Add Maintenance Bill",
    description: "Create a new maintenance bill",
    icon: "💰",
    route: ROUTES.MAINTENANCE_NEW,
  },
  {
    id: "add-parking",
    title: "Add Parking Slot",
    description: "Allocate a new parking slot",
    icon: "🚗",
    route: ROUTES.PARKING_NEW,
  },
  {
    id: "add-notice",
    title: "Add Notice",
    description: "Post a new notice or announcement",
    icon: "📢",
    route: ROUTES.NOTICES_NEW,
  },
  {
    id: "add-booking",
    title: "Add Booking",
    description: "Create a new amenity booking",
    icon: "📅",
    route: ROUTES.BOOKINGS_NEW,
  },
  {
    id: "add-package",
    title: "Add Package",
    description: "Register a new package delivery",
    icon: "📦",
    route: ROUTES.PACKAGE_TRACKING_NEW,
  },
];

const DASHBOARD_CARDS = [
  {
    id: "residents",
    title: "Total Residents",
    value: 0,
    description: "Active residents in society",
    icon: "👥",
    color: "blue",
    trend: "+0",
  },
  {
    id: "visitors",
    title: "Total Visitors",
    value: 0,
    description: "Registered visitors",
    icon: "🚶",
    color: "green",
    trend: "+0",
  },
  {
    id: "complaints",
    title: "Open Complaints",
    value: 0,
    description: "Pending and in-progress issues",
    icon: "📝",
    color: "yellow",
    trend: "+0",
  },
  {
    id: "maintenance",
    title: "Pending Bills",
    value: 0,
    description: "Unpaid maintenance bills",
    icon: "💰",
    color: "red",
    trend: "+0",
  },
  {
    id: "parking",
    title: "Active Parking",
    value: 0,
    description: "Allocated parking slots",
    icon: "🚗",
    color: "purple",
    trend: "+0",
  },
  {
    id: "amenities",
    title: "Total Amenities",
    value: 0,
    description: "Available facilities",
    icon: "🏢",
    color: "indigo",
    trend: "+0",
  },
  {
    id: "bookings",
    title: "Upcoming Bookings",
    value: 0,
    description: "Confirmed amenity bookings",
    icon: "📅",
    color: "emerald",
    trend: "+0",
  },
  {
    id: "packages",
    title: "Expected Packages",
    value: 0,
    description: "Packages awaiting delivery",
    icon: "📦",
    color: "orange",
    trend: "+0",
  },
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
  const { user, isLoading: userLoading, error: userError, refetch } = useDashboardUser();
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
    loadDashboardData();
  }, []);

  const handleQuickAction = (route) => {
    navigate(route);
  };

  if (userLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (userError || error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={(userError || error).message} errors={(userError || error).errors} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={() => { refetch(); loadDashboardData(); }}>
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

  const dashboardCards = DASHBOARD_CARDS.map((card) => {
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
    return { ...card, value };
  });

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={() => handleQuickAction(action.route)}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
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
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Complaints by Status</h3>
            <div className="mt-4">
              {formatAnalyticsDisplay(analytics.complaintsByStatus, "Complaints")}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Maintenance Bills</h3>
            <div className="mt-4">
              {formatAnalyticsDisplay(analytics.maintenanceBillsByStatus, "Maintenance")}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Parking Status</h3>
            <div className="mt-4">
              {formatAnalyticsDisplay(analytics.parkingByStatus, "Parking")}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Package Delivery Status</h3>
            <div className="mt-4">
              {formatAnalyticsDisplay(analytics.packageDeliveryStatus, "Packages")}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Amenity Booking Status</h3>
            <div className="mt-4">
              {formatAnalyticsDisplay(analytics.amenityBookingStatus, "Bookings")}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;