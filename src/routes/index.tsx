/**
 * Route Configuration
 * Centralized route definitions for the application
 */
import { lazy } from "react";

// Lazy load pages for better performance
const MyHome = lazy(() => import("../pages/Dashboard/MyHome"));
const UserProfiles = lazy(() => import("../pages/UserProfiles"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Blank = lazy(() => import("../pages/Blank"));
const ProfilesTables = lazy(() => import("../pages/Tables/ProfilesTables"));
const UserForm = lazy(() => import("../pages/Forms/UserForm"));
const FormElements = lazy(() => import("../pages/Forms/FormElements"));
const BasicTables = lazy(() => import("../pages/Tables/BasicTables"));
const FiltersTable = lazy(() => import("../pages/Tables/FiltersTable"));
const PatientTable = lazy(() => import("../pages/Tables/PatientTable"));
const Alerts = lazy(() => import("../pages/UiElements/Alerts"));
const Avatars = lazy(() => import("../pages/UiElements/Avatars"));
const Badges = lazy(() => import("../pages/UiElements/Badges"));
const Buttons = lazy(() => import("../pages/UiElements/Buttons"));
const Images = lazy(() => import("../pages/UiElements/Images"));
const Videos = lazy(() => import("../pages/UiElements/Videos"));
const LineChart = lazy(() => import("../pages/Charts/LineChart"));
const BarChart = lazy(() => import("../pages/Charts/BarChart"));
const SignIn = lazy(() => import("../pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("../pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));

/**
 * Protected Routes - Require authentication
 */
export const protectedRoutes = [
    { path: "/", element: <MyHome />, index: true },
    { path: "/profile", element: <UserProfiles /> },
    { path: "/team", element: <ProfilesTables /> },
    { path: "/patients", element: <PatientTable /> },
    { path: "/calendar", element: <Calendar /> },
    { path: "/blank", element: <Blank /> },
    { path: "/form-user", element: <UserForm /> },
    { path: "/form-elements", element: <FormElements /> },
    { path: "/basic-tables", element: <BasicTables /> },
    { path: "/filter-tables", element: <FiltersTable /> },
    { path: "/patient-tables", element: <PatientTable /> },
    { path: "/alerts", element: <Alerts /> },
    { path: "/avatars", element: <Avatars /> },
    { path: "/badge", element: <Badges /> },
    { path: "/buttons", element: <Buttons /> },
    { path: "/images", element: <Images /> },
    { path: "/videos", element: <Videos /> },
    { path: "/line-chart", element: <LineChart /> },
    { path: "/bar-chart", element: <BarChart /> },
];

/**
 * Public Routes - No authentication required
 */
export const publicRoutes = [
    { path: "/signin", element: <SignIn /> },
    { path: "/error-404", element: <NotFound /> },
];
