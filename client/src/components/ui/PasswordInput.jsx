import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

const PasswordInput = ({
  label = "Password",
  id,
  name,
  error,
  className = "",
  autoComplete = "current-password",
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id || name || "password";

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          className={[
            "block w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900",
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

        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? (
            <HiOutlineEyeSlash className="h-5 w-5" />
          ) : (
            <HiOutlineEye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
