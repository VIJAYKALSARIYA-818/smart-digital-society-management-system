import { Outlet } from "react-router-dom";

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-6 md:block">
        <p className="text-lg font-semibold text-gray-900">{appName}</p>
        <nav className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Navigation
          </p>
          <p className="mt-2 text-sm text-gray-500">Modules coming soon</p>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <p className="font-medium text-gray-900">Dashboard</p>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
