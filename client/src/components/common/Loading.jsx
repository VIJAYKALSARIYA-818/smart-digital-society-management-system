const Loading = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
