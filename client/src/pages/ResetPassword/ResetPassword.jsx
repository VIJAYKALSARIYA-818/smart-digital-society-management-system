import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { HiOutlineKey } from "react-icons/hi2";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";
import { resetPassword } from "@/services/authService";
import useAuth from "@/hooks/useAuth";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", errors: [] });
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setError({ message: "Invalid reset token. Please request a new password reset link.", errors: [] });
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ message: "", errors: [] });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const passwordData = {
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    try {
      const response = await resetPassword(token, passwordData);
      
      if (response.data.success) {
        // Auto-login after successful password reset
        await login({
          email: response.data.data.user.email,
          password: passwordData.password,
        });
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (submitError) {
      const errorMessage = submitError.response?.data?.message || "Failed to reset password";
      setError({ message: errorMessage, errors: [] });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isTokenValid) {
    return (
      <FormCard
        title="Invalid reset link"
        subtitle="The password reset link is invalid or has expired."
        footer={
          <>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Request a new reset link
            </Link>
          </>
        }
      >
        <div className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <HiOutlineKey className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Reset password"
      subtitle="Choose a new password for your account. Make sure it is strong and unique."
      footer={
        <>
          Return to{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {(error.message || error.errors.length > 0) && (
          <FormAlert message={error.message} errors={error.errors} />
        )}

        <PasswordInput
          label="New Password"
          id="reset-password"
          name="password"
          placeholder="Enter new password"
          autoComplete="new-password"
          required
          disabled={isSubmitting}
        />

        <PasswordInput
          label="Confirm Password"
          id="reset-confirmPassword"
          name="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          disabled={isSubmitting}
        />

        <Button type="submit" fullWidth icon={HiOutlineKey} disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </FormCard>
  );
};

export default ResetPassword;
