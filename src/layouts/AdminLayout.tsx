import React, { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";
import NavBar from "../components/admin/NavBar";

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-indigo-50 relative">
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
