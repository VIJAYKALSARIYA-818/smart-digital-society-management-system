import { Link } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineTruck,
  HiOutlineCalendarDays,
  HiOutlineCube,
  HiOutlineMegaphone,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { ROUTES } from "@/constants/routes";

const Home = () => {
  const features = [
    {
      icon: HiOutlineUsers,
      title: "Resident Management",
      description: "Manage resident profiles, flats, blocks, and resident information.",
    },
    {
      icon: HiOutlineClipboardDocumentList,
      title: "Visitor Management",
      description: "Register visitors, manage gate entry, and track visitor activity.",
    },
    {
      icon: HiOutlineBuildingOffice2,
      title: "Complaint Management",
      description: "Submit, track, and manage society complaints.",
    },
    {
      icon: HiOutlineCurrencyDollar,
      title: "Maintenance & Billing",
      description: "Manage maintenance bills, payment status, and due dates.",
    },
    {
      icon: HiOutlineTruck,
      title: "Parking Management",
      description: "Allocate and manage parking slots and vehicle information.",
    },
    {
      icon: HiOutlineCalendarDays,
      title: "Amenity & Facility Booking",
      description: "Manage society amenities and resident bookings.",
    },
    {
      icon: HiOutlineCube,
      title: "Package Tracking",
      description: "Track incoming packages and deliveries.",
    },
    {
      icon: HiOutlineMegaphone,
      title: "Notice Board",
      description: "Publish important society announcements and notices.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign In",
      description: "Access your society account securely.",
    },
    {
      number: "02",
      title: "Manage",
      description: "Manage residents, visitors, complaints, maintenance, parking, bookings, packages, and notices.",
    },
    {
      number: "03",
      title: "Stay Connected",
      description: "Keep track of society activities and important updates from one dashboard.",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Smart Digital Society Management System
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
              A modern platform for secure society management, resident services, and smart community operations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Visual Card */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-2xl sm:p-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Residents", value: "Manage" },
                  { label: "Visitors", value: "Track" },
                  { label: "Complaints", value: "Resolve" },
                  { label: "Bills", value: "Pay" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/10 backdrop-blur-sm p-4 text-center"
                  >
                    <p className="text-sm font-medium text-white/80">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Comprehensive tools for efficient society management
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-indigo-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything Your Society Needs in One Place
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Smart Digital Society Management System brings everyday society operations into one centralized platform, helping administrators and residents manage information, services, and communication efficiently.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Secure Authentication",
              "Real-time Dashboard",
              "Easy Navigation",
              "Mobile Responsive",
              "Comprehensive Reports",
              "Efficient Management",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <HiOutlineCheckCircle className="h-6 w-6 flex-shrink-0 text-indigo-600" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to manage your society smarter?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Access your society management dashboard and manage daily operations from one place.
          </p>
          <div className="mt-10">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Go to Login
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
