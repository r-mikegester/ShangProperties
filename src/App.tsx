import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./lib/styles/App.css";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      {/* 🧭 Global navigation, header, footer can go here */}
      <Navbar />
      <main className="h-auto  bg-white text-[#1A1A1A]">
        <Outlet />
      </main>

      {/* 🌐 Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Optional: Footer or global modals */}
    </>
  );
};

export default App;
