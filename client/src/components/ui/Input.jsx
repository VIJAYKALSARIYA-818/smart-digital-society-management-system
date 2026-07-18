const Input = ({
  label,
  id,
  type = "text",
  error,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className={containerClassName}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        className={[
          "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900",
          "placeholder:text-slate-400",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
