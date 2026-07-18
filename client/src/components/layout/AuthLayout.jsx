import { Outlet } from "react-router-dom";
import { HiOutlineBuildingOffice2, HiOutlineShieldCheck } from "react-icons/hi2";

const appName =
  import.meta.env.VITE_APP_NAME || "Smart Digital Society Management System";

const FEATURES = [
  "Digital visitor passes & gate entry",
  "Maintenance billing & online payments",
  "Complaints, notices & amenity booking",
];

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden bg-indigo-700 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900" />
          <div className="absolute -right-16 top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-indigo-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-12 xl:px-16">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
              <HiOutlineBuildingOffice2 className="h-7 w-7" aria-hidden />
            </div>

            <h1 className="max-w-lg text-3xl font-semibold leading-tight text-white xl:text-4xl">
              {appName}
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-indigo-100">
              A modern platform for secure society management, resident services,
              and smart community operations.
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-indigo-50"
                >
                  <HiOutlineShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200"
                    aria-hidden
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 border-t border-white/10 px-10 py-6 text-sm text-indigo-100 xl:px-16">
            Developed by Vijay Kalsariya
          </div>
        </aside>

        {/* Form panel */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-4 py-5 sm:px-6 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <HiOutlineBuildingOffice2 className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{appName}</p>
              <p className="text-xs text-slate-500">Secure society portal</p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 lg:px-10 xl:px-16">
            <div className="w-full max-w-lg">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
