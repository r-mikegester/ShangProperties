import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "../../App"; // Adjust this if aliasing isn’t set
import ProtectedRoute from "./ProtectedRoute";

// Lazy-loaded pages
const Home = lazy(() => import("../../pages/Home"));
const Haraya = lazy(() => import("../../pages/Haraya"));
const Aurelia = lazy(() => import("../../pages/Aurelia"));
const Laya = lazy(() => import("../../pages/Laya"));
const ShangSummit = lazy(() => import("../../pages/ShangSummit"));
const WackWack = lazy(() => import("../../pages/WackWack"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        <Routes>
          {/* 🧩 App is the layout wrapper */}
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="Haraya" element={<Haraya />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Aurelia />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<Laya />} />
            <Route path="*" element={<ShangSummit />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
