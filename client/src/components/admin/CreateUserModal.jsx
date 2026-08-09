import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Select from "@/components/ui/Select";
import FormAlert from "@/components/common/FormAlert";
import { createUser } from "@/services/adminService";
import { getApiError } from "@/utils/apiError";

const USER_ROLES = ["Resident", "Society Admin", "Security Guard", "Maintenance Staff"];

const CreateUserModal = ({ isOpen, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    flatNumber: "",
    password: "",
    confirmPassword: "",
    role: "Resident",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please provide a valid phone number";
    }

    if (!formData.flatNumber.trim()) {
      newErrors.flatNumber = "Flat number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password and confirm password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser(formData);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        flatNumber: "",
        password: "",
        confirmPassword: "",
        role: "Resident",
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      setApiError(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-user-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="create-user-title" className="text-lg font-semibold text-slate-900">
          Create New User
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Add a new user to the society management system.
        </p>

        {apiError && <FormAlert type="error" message={apiError.message} className="mt-4" />}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="Enter full name"
            disabled={isSubmitting}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email address"
            disabled={isSubmitting}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />

          <Input
            label="Flat Number"
            name="flatNumber"
            value={formData.flatNumber}
            onChange={handleChange}
            error={errors.flatNumber}
            placeholder="Enter flat number"
            disabled={isSubmitting}
          />

          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            disabled={isSubmitting}
            options={USER_ROLES.map((role) => ({ value: role, label: role }))}
          />

          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter password"
            disabled={isSubmitting}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm password"
            disabled={isSubmitting}
          />

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;