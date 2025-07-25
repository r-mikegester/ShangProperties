import React from "react";
import AdminSidebar from "./Sidebar";
import Dock from "./Dock";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-white via-[#f7f3e9] to-[#f7f3e9]">
            <AdminSidebar open={open} setOpen={setOpen} />
            <main className="flex-1 flex flex-col items-center pb-10 justify-start w-full min-h-screen">
                <Outlet />
            </main>
            <Dock />
        </div>
    );
};

export default AdminLayout;
