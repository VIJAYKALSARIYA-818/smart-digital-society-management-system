import { Outlet } from "react-router-dom";

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-900">{appName}</p>
          <p className="mt-1 text-sm text-gray-500">
            Sign in or create an account to continue
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
