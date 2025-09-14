import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/NotFound";
import { LoadingScreen } from "../components/shared";
import AdminLayout from "../layouts/AdminLayout";
import { DashboardStatsProvider } from "../context/DashboardStatsContext";

// Lazy-loaded pages
const Home = lazy(() => import("../layouts/ClientLayout"));
const Haraya = lazy(() => import("../pages/client/Haraya"));
const Aurelia = lazy(() => import("../pages/client/Aurelia"));
const Laya = lazy(() => import("../pages/client/Laya"));
const ShangSummit = lazy(() => import("../pages/client/ShangSummit"));
const WackWack = lazy(() => import("../pages/client/WackWack"));
const ProjectDetail = lazy(() => import("../pages/client/ProjectDetail"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Projects = lazy(() => import("../pages/admin/Projects"));
// const Projects2Management = lazy(() => import("../pages/admin/Projects2Management"));
const Inquiries = lazy(() => import("../pages/admin/Inquiries"));
const PageManagement = lazy(() => import("../pages/admin/PageManagement"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const ErrorTest = lazy(() => import("../pages/admin/ErrorTest"));
const AdminLogin = lazy(() => import("../components/auth/Login"));
// Removed AssetUploader import

// Set your allowed admin emails here
const ADMIN_EMAILS = [
  "guidetoshangproperties@gmail.com",
  "mikegester.sabuga023@gmail.com"
];

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          {/* 🧩 App is the layout wrapper */}
          <Route path="/" element={<App />}>
            {/* Client routes at root level */}
            <Route index element={<Home />} />
            <Route path="Haraya" element={<Haraya />} />
            <Route path="Aurelia" element={<Aurelia />} />
            <Route path="Laya" element={<Laya />} />
            <Route path="WackWack" element={<WackWack />} />
            <Route path="ShangSummit" element={<ShangSummit />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            
            {/* Admin routes under /Admin prefix */}
            <Route
              path="/Admin/*"
              element={
                <ProtectedRoute allowedEmails={ADMIN_EMAILS}>
                  <DashboardStatsProvider>
                    <AdminLayout />
                  </DashboardStatsProvider>
                </ProtectedRoute>
              }
            >
              {/* Index route redirects to Dashboard */}
              <Route index element={<Dashboard />} />
              <Route path="Dashboard" element={<Dashboard />} />
              <Route path="Projects" element={<Projects />} />
              <Route path="Projects/Archive" element={<Projects />} />
              <Route path="Inquiries" element={<Inquiries />} />
              <Route path="PageManagement" element={<PageManagement />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="ErrorTest" element={<ErrorTest />} />
            </Route>
            
            {/* Public admin login route */}
            <Route path="/login" element={<AdminLogin />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;