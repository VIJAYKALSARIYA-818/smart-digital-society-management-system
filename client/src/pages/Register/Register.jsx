import { useState } from "react";
import { Link } from "react-router-dom";
import FormAlert from "@/components/common/FormAlert";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

const Register = () => {
  const { register, getApiError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", errors: [] });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError({ message: "", errors: [] });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      await register({
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        flatNumber: formData.get("flatNumber"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });
    } catch (submitError) {
      setError(getApiError(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Create your account"
      subtitle="Register as a resident to access society services, notices, and payments."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {(error.message || error.errors.length > 0) && (
          <FormAlert message={error.message} errors={error.errors} />
        )}

        <Input
          label="Full Name"
          id="register-fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          required
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Email"
            id="register-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />

          <Input
            label="Phone"
            id="register-phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            required
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Flat Number"
          id="register-flatNumber"
          name="flatNumber"
          type="text"
          placeholder="e.g. A-101, Block B"
          required
          disabled={isSubmitting}
        />

        <PasswordInput
          label="Password"
          id="register-password"
          name="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          disabled={isSubmitting}
        />

        <PasswordInput
          label="Confirm Password"
          id="register-confirmPassword"
          name="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          disabled={isSubmitting}
        />

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </FormCard>
  );
};

export default Register;
