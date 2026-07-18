import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/common/Loading";
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MainLayout from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";

const Home = lazy(() => import("@/pages/Home/Home"));
const Login = lazy(() => import("@/pages/Login/Login"));
const Register = lazy(() => import("@/pages/Register/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
