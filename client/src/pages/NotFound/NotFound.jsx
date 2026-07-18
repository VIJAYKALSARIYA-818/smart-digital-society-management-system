import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-semibold text-gray-900">
        404 - Page Not Found
      </h1>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-6 text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
