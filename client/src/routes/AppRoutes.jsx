import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "@/components/common/Loading";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AuthLayout from "@/components/layout/AuthLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MainLayout from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";

const Home = lazy(() => import("@/pages/Home/Home"));
const Login = lazy(() => import("@/pages/Login/Login"));
const Register = lazy(() => import("@/pages/Register/Register"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Residents = lazy(() => import("@/pages/Residents/Residents"));
const AddResident = lazy(() => import("@/pages/Residents/AddResident"));
const EditResident = lazy(() => import("@/pages/Residents/EditResident"));
const ResidentDetails = lazy(() => import("@/pages/Residents/ResidentDetails"));
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
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.RESIDENTS} element={<Residents />} />
            <Route path={ROUTES.RESIDENTS_NEW} element={<AddResident />} />
            <Route path={ROUTES.RESIDENTS_DETAILS} element={<ResidentDetails />} />
            <Route path={ROUTES.RESIDENTS_EDIT} element={<EditResident />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
