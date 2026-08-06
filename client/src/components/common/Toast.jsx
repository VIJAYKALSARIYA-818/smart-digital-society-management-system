const Toast = ({ message, type = "success", onClose }) => {
  if (!message) {
    return null;
  }

  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm">
      <div className={`rounded-xl border px-4 py-3 shadow-lg ${styles}`} role="status" aria-live="polite">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium">{message}</p>
          <button type="button" className="text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;