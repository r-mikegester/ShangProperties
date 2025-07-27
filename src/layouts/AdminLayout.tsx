import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import NavBar from "../components/admin/NavBar";
import InquirySocketListener from "../components/admin/InquirySocketListener";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-indigo-50 relative">
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
      <Sidebar open={open} setOpen={setOpen} />     
      <div className="flex-1 flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
