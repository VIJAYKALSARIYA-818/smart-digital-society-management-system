import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
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
        <Input
          label="Full Name"
          id="register-fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          required
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
          />

          <Input
            label="Phone"
            id="register-phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            required
          />
        </div>

        <Input
          label="Flat Number"
          id="register-flatNumber"
          name="flatNumber"
          type="text"
          placeholder="e.g. A-101, Block B"
          required
        />

        <PasswordInput
          label="Password"
          id="register-password"
          name="password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
        />

        <PasswordInput
          label="Confirm Password"
          id="register-confirmPassword"
          name="confirmPassword"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />

        <Button type="submit" fullWidth>
          Create account
        </Button>
      </form>
    </FormCard>
  );
};

export default Register;
