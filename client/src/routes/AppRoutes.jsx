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
const Visitors = lazy(() => import("@/pages/Visitors/Visitors"));
const AddVisitor = lazy(() => import("@/pages/Visitors/AddVisitor"));
const EditVisitor = lazy(() => import("@/pages/Visitors/EditVisitor"));
const VisitorDetails = lazy(() => import("@/pages/Visitors/VisitorDetails"));
const Complaints = lazy(() => import("@/pages/Complaints/Complaints"));
const AddComplaint = lazy(() => import("@/pages/Complaints/AddComplaint"));
const EditComplaint = lazy(() => import("@/pages/Complaints/EditComplaint"));
const ComplaintDetails = lazy(() => import("@/pages/Complaints/ComplaintDetails"));
const MaintenanceBills = lazy(() => import("@/pages/Maintenance/MaintenanceBills"));
const AddMaintenanceBill = lazy(() => import("@/pages/Maintenance/AddMaintenanceBill"));
const EditMaintenanceBill = lazy(() => import("@/pages/Maintenance/EditMaintenanceBill"));
const MaintenanceBillDetails = lazy(() => import("@/pages/Maintenance/MaintenanceBillDetails"));
const Notices = lazy(() => import("@/pages/Notices/Notices"));
const AddNotice = lazy(() => import("@/pages/Notices/AddNotice"));
const EditNotice = lazy(() => import("@/pages/Notices/EditNotice"));
const NoticeDetails = lazy(() => import("@/pages/Notices/NoticeDetails"));
const Parking = lazy(() => import("@/pages/Parking/Parking"));
const AddParking = lazy(() => import("@/pages/Parking/AddParking"));
const EditParking = lazy(() => import("@/pages/Parking/EditParking"));
const ParkingDetails = lazy(() => import("@/pages/Parking/ParkingDetails"));
const Amenities = lazy(() => import("@/pages/Amenities/Amenities"));
const AddAmenity = lazy(() => import("@/pages/Amenities/AddAmenity"));
const EditAmenity = lazy(() => import("@/pages/Amenities/EditAmenity"));
const AmenityDetails = lazy(() => import("@/pages/Amenities/AmenityDetails"));
const Bookings = lazy(() => import("@/pages/Bookings/Bookings"));
const AddBooking = lazy(() => import("@/pages/Bookings/AddBooking"));
const EditBooking = lazy(() => import("@/pages/Bookings/EditBooking"));
const BookingDetails = lazy(() => import("@/pages/Bookings/BookingDetails"));
const PackageTracking = lazy(() => import("@/pages/PackageTracking/PackageTracking"));
const AddPackage = lazy(() => import("@/pages/PackageTracking/AddPackage"));
const EditPackage = lazy(() => import("@/pages/PackageTracking/EditPackage"));
const PackageDetails = lazy(() => import("@/pages/PackageTracking/PackageDetails"));
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
            <Route path={ROUTES.VISITORS} element={<Visitors />} />
            <Route path={ROUTES.VISITORS_NEW} element={<AddVisitor />} />
            <Route path={ROUTES.VISITORS_DETAILS} element={<VisitorDetails />} />
            <Route path={ROUTES.VISITORS_EDIT} element={<EditVisitor />} />
            <Route path={ROUTES.COMPLAINTS} element={<Complaints />} />
            <Route path={ROUTES.COMPLAINTS_NEW} element={<AddComplaint />} />
            <Route path={ROUTES.COMPLAINTS_DETAILS} element={<ComplaintDetails />} />
            <Route path={ROUTES.COMPLAINTS_EDIT} element={<EditComplaint />} />
            <Route path={ROUTES.MAINTENANCE} element={<MaintenanceBills />} />
            <Route path={ROUTES.MAINTENANCE_NEW} element={<AddMaintenanceBill />} />
            <Route path={ROUTES.MAINTENANCE_DETAILS} element={<MaintenanceBillDetails />} />
            <Route path={ROUTES.MAINTENANCE_EDIT} element={<EditMaintenanceBill />} />
            <Route path={ROUTES.NOTICE_BOARD} element={<Notices />} />
            <Route path={ROUTES.NOTICES_NEW} element={<AddNotice />} />
            <Route path={ROUTES.NOTICES_DETAILS} element={<NoticeDetails />} />
            <Route path={ROUTES.NOTICES_EDIT} element={<EditNotice />} />
            <Route path={ROUTES.PARKING} element={<Parking />} />
            <Route path={ROUTES.PARKING_NEW} element={<AddParking />} />
            <Route path={ROUTES.PARKING_DETAILS} element={<ParkingDetails />} />
            <Route path={ROUTES.PARKING_EDIT} element={<EditParking />} />
            <Route path={ROUTES.AMENITIES} element={<Amenities />} />
            <Route path={ROUTES.AMENITIES_NEW} element={<AddAmenity />} />
            <Route path={ROUTES.AMENITIES_DETAILS} element={<AmenityDetails />} />
            <Route path={ROUTES.AMENITIES_EDIT} element={<EditAmenity />} />
            <Route path={ROUTES.BOOKINGS} element={<Bookings />} />
            <Route path={ROUTES.BOOKINGS_NEW} element={<AddBooking />} />
            <Route path={ROUTES.BOOKINGS_DETAILS} element={<BookingDetails />} />
            <Route path={ROUTES.BOOKINGS_EDIT} element={<EditBooking />} />
            <Route path={ROUTES.PACKAGE_TRACKING} element={<PackageTracking />} />
            <Route path={ROUTES.PACKAGE_TRACKING_NEW} element={<AddPackage />} />
            <Route path={ROUTES.PACKAGE_TRACKING_DETAILS} element={<PackageDetails />} />
            <Route path={ROUTES.PACKAGE_TRACKING_EDIT} element={<EditPackage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
