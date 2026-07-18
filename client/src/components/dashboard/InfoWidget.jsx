import { useEffect, useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { SOCIETY_INFO, SOCIETY_INFO_ICON } from "@/constants/dashboardData";

const formatDate = (date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const InfoWidget = () => {
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const SocietyIcon = SOCIETY_INFO_ICON;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const infoItems = [
    { label: "Total Blocks", value: SOCIETY_INFO.totalBlocks },
    { label: "Total Flats", value: SOCIETY_INFO.totalFlats },
    {
      label: "Security Status",
      value: SOCIETY_INFO.securityStatus,
      highlight: true,
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <SocietyIcon className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Society Information
          </h2>
          <p className="text-sm text-slate-500">{SOCIETY_INFO.name}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-3">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5"
          >
            <dt className="text-sm text-slate-500">{item.label}</dt>
            <dd
              className={[
                "text-sm font-medium",
                item.highlight ? "inline-flex items-center gap-1 text-emerald-600" : "text-slate-900",
              ].join(" ")}
            >
              {item.highlight && (
                <HiOutlineShieldCheck className="h-4 w-4" aria-hidden />
              )}
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current Date
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {formatDate(currentDateTime)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current Time
          </p>
          <p className="mt-1 text-sm font-medium tabular-nums text-slate-900">
            {formatTime(currentDateTime)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoWidget;
