import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { login, logout, user, isAuthenticated, getApiError } = useAuth();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", errors: [] });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handle OAuth error from redirect
  useEffect(() => {
    if (location.state?.error) {
      setError({ message: location.state.error, errors: [] });
    }
  }, [location.state]);

  const handleSwitchAccount = async () => {
    setError({ message: "", errors: [] });
    await logout();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ message: "", errors: [] });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await login({
        email: formData.get("email"),
        password: formData.get("password"),
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <FormCard
      title="Welcome back"
      subtitle="Sign in to manage your society dashboard, residents, and daily operations."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Create account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {(error.message || error.errors.length > 0) && (
          <FormAlert message={error.message} errors={error.errors} />
        )}

        {isAuthenticated && user ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>
              Currently signed in as <strong>{user.fullName}</strong> ({user.role}).
            </p>
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="mt-2 font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign out to switch account
            </button>
          </div>
        ) : null}

        <Input
          label="Email"
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
        />

        <PasswordInput
          label="Password"
          id="login-password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          disabled={isSubmitting}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
            Remember me
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs uppercase tracking-wide text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button 
            type="button" 
            variant="social" 
            icon={FaGoogle} 
            fullWidth 
            disabled={isSubmitting || isGoogleLoading}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>
        </div>
      </form>
    </FormCard>
  );
};

export default Login;
