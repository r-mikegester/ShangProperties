import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/App.css";
import "./assets/styles/index.css";
import Navbar from "./components/shared/Navbar";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      {/* 🧭 Global navigation, header, footer can go here */}
      {!location.pathname.startsWith("/dashboard") && <Navbar />}
      <main className="h-screen text-[#1A1A1A]">
        <Outlet />
      </main>

      {/* 🌐 Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Optional: Footer or global modals */}
    </>
  );
};

export default App;
