import { Link } from "react-router-dom";
import { HiOutlineKey } from "react-icons/hi2";
import Button from "@/components/ui/Button";
import FormCard from "@/components/ui/FormCard";
import PasswordInput from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants/routes";

const ResetPassword = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

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
        <PasswordInput
          label="New Password"
          id="reset-password"
          name="password"
          placeholder="Enter new password"
          autoComplete="new-password"
          required
        />

        <PasswordInput
          label="Confirm Password"
          id="reset-confirmPassword"
          name="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
        />

        <Button type="submit" fullWidth icon={HiOutlineKey}>
          Reset password
        </Button>
      </form>
    </FormCard>
  );
};

export default ResetPassword;
