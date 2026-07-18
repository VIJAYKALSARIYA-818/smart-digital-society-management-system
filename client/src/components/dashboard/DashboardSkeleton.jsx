const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <SkeletonBlock className="h-16 w-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-7 w-64 max-w-full" />
            <SkeletonBlock className="h-4 w-80 max-w-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <SkeletonBlock className="h-11 w-11 rounded-xl" />
            <SkeletonBlock className="mt-4 h-4 w-32" />
            <SkeletonBlock className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
