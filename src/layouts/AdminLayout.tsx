import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Dock from "../components/admin/Dock";
import { Outlet } from "react-router-dom";
import NavBar from "../components/admin/NavBar";
import InquirySocketListener from "../components/admin/InquirySocketListener";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardStatsProvider } from "../context/DashboardStatsContext";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const isMobile = useIsMobile();

  return (
    <DashboardStatsProvider>
      <div className="flex min-h-screen bg-[#b08b2e]/40 relative">
        <InquirySocketListener />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {!isMobile && <Sidebar open={open} setOpen={setOpen} />}
        <div className="flex-1 flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-1 max-w-full w-full mx-auto">
            <Outlet />
          </main>
        </div>
        {isMobile && <Dock />}
      </div>
    </DashboardStatsProvider>
  );
};

export default AdminLayout;
