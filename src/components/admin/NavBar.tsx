import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";

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
  const { notifications, markAllAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      markAllAsRead();
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, markAllAsRead]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-[#b08b2e]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative p-2 rounded hover:bg-slate-100 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Icon icon="solar:bell-bing-broken" width="24" height="24" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>
          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-80 max-w-xs bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-50
              ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
            `}
            style={{ minWidth: 320 }}
          >
            <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50">Notifications</div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 && (
                <li className="p-4 text-center text-slate-400">No notifications</li>
              )}
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors duration-200 ${!n.read ? "bg-slate-50" : ""}`}
                >
                  <span className="mt-1">
                    {n.type === "success" && <Icon icon="mdi:check-circle" className="text-green-500" width={20} />}
                    {n.type === "error" && <Icon icon="mdi:alert-circle" className="text-red-500" width={20} />}
                    {n.type === "warning" && <Icon icon="mdi:alert" className="text-yellow-500" width={20} />}
                    {n.type === "info" && <Icon icon="mdi:information" className="text-blue-500" width={20} />}
                    {n.type === "inquiry" && <Icon icon="mdi:email" className="text-purple-500" width={20} />}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm mb-1">{n.title}</div>
                    <div className="text-xs text-slate-600 mb-1">{n.message}</div>
                    <div className="text-[10px] text-slate-400">{n.timestamp.toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <button className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 transition">
          <FiUser className="text-xl text-slate-500" />
          <span className="hidden md:inline text-sm text-slate-700">Account</span>
        </button> */}
      </div>
    </nav>
  );
};

export default NavBar;
