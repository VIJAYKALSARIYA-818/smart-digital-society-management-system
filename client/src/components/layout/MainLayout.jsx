import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { ROUTES } from "@/constants/routes";

const appName = "Smart Digital Society";
const appSubtitle = "Management System";

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: ROUTES.HOME },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <span className="text-lg font-bold">SD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-slate-900 leading-tight">
                  {appName}
                </span>
                <span className="text-xs text-slate-500 leading-tight">
                  {appSubtitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isMobileMenuOpen ? (
                <HiOutlineXMark className="h-6 w-6" />
              ) : (
                <HiOutlineBars3 className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="space-y-1 px-4 pb-4 pt-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Link
                to={ROUTES.LOGIN}
                className="block rounded-lg px-3 py-2 text-base font-medium text-indigo-600 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-600">
                © {new Date().getFullYear()} Smart Digital Society Management System
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Developed by Vijay Kalsariya
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                About
              </a>
              <Link to={ROUTES.LOGIN} className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
