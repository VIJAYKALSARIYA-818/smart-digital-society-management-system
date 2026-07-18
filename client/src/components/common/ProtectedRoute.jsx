import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "@/components/common/Loading";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
