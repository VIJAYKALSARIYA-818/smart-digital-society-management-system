import { Outlet } from "react-router-dom";

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <p className="text-lg font-semibold text-gray-900">{appName}</p>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Digital Society
      </footer>
    </div>
  );
};

export default MainLayout;
