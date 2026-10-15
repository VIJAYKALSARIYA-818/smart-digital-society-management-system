import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/common/Loading";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

/**
 * Restricts nested routes to users whose role is in `roles`.
 */
const RoleRoute = ({ roles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
