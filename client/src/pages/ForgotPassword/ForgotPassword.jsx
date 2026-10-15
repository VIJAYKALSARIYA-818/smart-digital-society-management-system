import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEnvelope } from "react-icons/hi2";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { forgotPassword } from "@/services/authService";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", errors: [] });
  const [success, setSuccess] = useState(false);
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ message: "", errors: [] });
    setDevelopmentResetUrl("");
    setIsDevelopmentMode(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      const response = await forgotPassword(email);
      
      if (response.data.success) {
        setSuccess(true);
        
        // In development mode, show the reset URL
        if (response.data.data?.developmentMode && response.data.data?.resetUrl) {
          console.log("Development mode - Reset URL:", response.data.data.resetUrl);
          setDevelopmentResetUrl(response.data.data.resetUrl);
          setIsDevelopmentMode(true);
        }
      }
    } catch (submitError) {
      const errorMessage = submitError.response?.data?.message || "Failed to send reset link";
      setError({ message: errorMessage, errors: [] });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <FormCard
        title="Check your email"
        subtitle="We've sent a password reset link to your email address."
        footer={
          <>
            Didn't receive the email?{" "}
            <button
              onClick={() => setSuccess(false)}
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Try again
            </button>
          </>
        }
      >
        <div className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <HiOutlineEnvelope className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Click the link in the email to reset your password. The link will expire in 30 minutes.
          </p>
          {developmentResetUrl && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-semibold text-yellow-800 mb-2">Development Mode:</p>
              <p className="text-xs text-yellow-700 mb-2 break-all">
                Reset URL: {developmentResetUrl}
              </p>
              <a 
                href={developmentResetUrl} 
                className="text-xs text-indigo-600 hover:text-indigo-700 underline"
              >
                Click here to reset password
              </a>
            </div>
          )}
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Forgot password?"
      subtitle="Enter the email linked to your account and we will send you a reset link."
      footer={
        <>
          Remember your password?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {error.errors.length > 0 && (
          <FormAlert message={error.message} errors={error.errors} />
        )}
        {error.message && error.errors.length === 0 && (
          <div className="rounded-md bg-blue-50 p-4">
            <p className="text-sm text-blue-800 break-all">{error.message}</p>
          </div>
        )}

        <Input
          label="Email"
          id="forgot-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isSubmitting}
        />

        <Button type="submit" fullWidth icon={HiOutlineEnvelope} disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </FormCard>
  );
};

export default ForgotPassword;
