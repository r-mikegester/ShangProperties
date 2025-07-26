import { Icon } from "@iconify/react";
import React from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/inquiries": "Inquiries",
  "/dashboard/projects": "Project Management",
  "/dashboard/page-management": "Page Management",
};

const getPageTitle = (pathname: string) => {
  // Handles /dashboard and its subroutes
  if (pathname.startsWith("/dashboard/projects")) return "Project Management";
  if (pathname.startsWith("/dashboard/inquiries")) return "Inquiries";
  if (pathname.startsWith("/dashboard/page-management")) return "Page Management";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Admin Panel";
};

const NavBar: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-[#b08b2e]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-slate-100 transition">
          <Icon icon="solar:bell-bing-broken" width="24" height="24" />
          <span className="absolute top-1 right-1 inline-block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        {/* <button className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 transition">
          <FiUser className="text-xl text-slate-500" />
          <span className="hidden md:inline text-sm text-slate-700">Account</span>
        </button> */}
      </div>
    </nav>
  );
};

export default NavBar;
