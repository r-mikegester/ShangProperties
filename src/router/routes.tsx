import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../components/NotFound";
import { LoadingScreen } from "../components/shared";
import AdminLayout from "../layouts/AdminLayout";

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
const Inquiries = lazy(() => import("../pages/admin/Inquiries"));
const PageManagement = lazy(() => import("../pages/admin/PageManagement"));

// Set your allowed admin emails here
const ADMIN_EMAILS = ["guidetoshangproperties@gmail.com"];

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          {/* 🧩 App is the layout wrapper */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/Haraya" element={<Haraya />} />
            <Route path="/Aurelia" element={<Aurelia />} />
            <Route path="/Laya" element={<Laya />} />
            <Route path="/WackWack" element={<WackWack />} />
            <Route path="/ShangSummit" element={<ShangSummit />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            {/* Admin routes with sidebar */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedEmails={ADMIN_EMAILS}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="page-management" element={<PageManagement />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
