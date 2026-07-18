import { Link } from "react-router-dom";
import { HiOutlineEnvelope } from "react-icons/hi2";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";

const ForgotPassword = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

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
        <Input
          label="Email"
          id="forgot-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Button type="submit" fullWidth icon={HiOutlineEnvelope}>
          Send reset link
        </Button>
      </form>
    </FormCard>
  );
};

export default ForgotPassword;
