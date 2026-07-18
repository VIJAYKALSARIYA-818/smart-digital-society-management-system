import { Link } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
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
        <Input
          label="Email"
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <PasswordInput
          label="Password"
          id="login-password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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

        <Button type="submit" fullWidth>
          Sign in
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button type="button" variant="social" icon={FaGoogle} fullWidth>
            Google
          </Button>
          <Button type="button" variant="social" icon={FaGithub} fullWidth>
            GitHub
          </Button>
        </div>
      </form>
    </FormCard>
  );
};

export default Login;
