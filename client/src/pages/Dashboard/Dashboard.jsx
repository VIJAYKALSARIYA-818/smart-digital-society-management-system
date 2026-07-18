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
import {
  ANNOUNCEMENTS,
  DASHBOARD_STATS,
  QUICK_ACTIONS,
  RECENT_ACTIVITIES,
} from "@/constants/dashboardData";
import useDashboardUser from "@/hooks/useDashboardUser";

const Dashboard = () => {
  const { user, isLoading, error, refetch } = useDashboardUser();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormAlert message={error.message} errors={error.errors} />
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={refetch}>
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

  return (
    <div className="space-y-6">
      <DashboardWelcome user={user} />

      <section>
        <SectionHeader
          title="Overview"
          description="Key society metrics at a glance."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <DashboardCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Quick Actions"
          description="Common tasks to manage daily society operations."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={() => {}}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <SectionHeader
            title="Recent Activity"
            description="Latest updates across society modules."
          />
          <div className="mt-2">
            {RECENT_ACTIVITIES.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                {...activity}
                isLast={index === RECENT_ACTIVITIES.length - 1}
              />
            ))}
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
    </div>
  );
};

export default Dashboard;
