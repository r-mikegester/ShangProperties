import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { FiMenu, FiLogOut, FiRefreshCw, FiSettings } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { useDashboardStats } from "../../context/DashboardStatsContext";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/inquiries": "Inquiries",
  "/dashboard/projects": "Project Management",
  "/dashboard/page-management": "Page Management",
};

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith("/dashboard/projects")) return "Project Management";
  if (pathname.startsWith("/dashboard/inquiries")) return "Inquiries";
  if (pathname.startsWith("/dashboard/page-management")) return "Page Management";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Admin Panel";
};

interface NavBarProps {
  toolbarActions?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ toolbarActions }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { notifications, markAllAsRead } = useNotification();
  const { refreshDashboard } = useDashboardStats();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  // Placeholder user info (replace with real user data if available)
  const user = {
    name: "Venezia Espiritu",
    info: "Shang Properties Inc.",
    avatar: "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/VeneziaEspiritu.jpg",
  };

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (notifOpen || menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, menuOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold castoro-titling-regular text-[#b08b2e]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        {toolbarActions}
        <button
          className="p-2 rounded hover:bg-slate-100 hidden md:flex transition"
          aria-label="Refresh dashboard"
          onClick={refreshDashboard}
          title="Refresh dashboard stats"
        >
          <Icon icon="mdi:refresh" width="24" height="24" />
        </button>
        {/* Notification Dropdown (always visible) */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            className="relative p-2 rounded hover:bg-slate-100 transition"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Icon icon="solar:bell-bing-broken" width="24" height="24" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-0 mt-2 w-80 max-w-xs bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50"
                style={{ minWidth: 320 }}
              >
                <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 bg-slate-50 flex items-center justify-between">
                  <span>Notifications</span>
                  <button
                    className="text-xs text-blue-600 hover:underline ml-2 px-2 py-1 rounded"
                    onClick={markAllAsRead}
                    disabled={notifications.every(n => n.read)}
                  >
                    Mark all as read
                  </button>
                </div>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Hamburger Dropdown (mobile only) */}
        <div className="relative md:hidden" ref={menuDropdownRef}>
          <button
            className="p-2 rounded hover:bg-slate-100 transition"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <FiMenu className="text-2xl text-slate-700" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.18, type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-0 mt-2 w-72 max-w-xs bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50"
                style={{ minWidth: 280 }}
              >
                {/* User info */}
                <div className="flex flex-col items-center justify-center py-8 border-b border-slate-100 bg-gradient-to-b from-[#b08b2e]/10 to-white">
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-20 h-20 rounded-full border-4 border-[#b08b2e] shadow-lg mb-2"
                  />
                  <div className="font-semibold text-lg text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.info}</div>
                </div>
                {/* Menu items */}
                <div className="flex flex-col gap-2 p-6">
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-[#b08b2e]/10 transition text-slate-700 font-medium text-base shadow-sm"
                    onClick={() => { window.location.reload(); }}
                  >
                    <FiRefreshCw className="text-xl text-[#b08b2e]" /> Refresh
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 hover:bg-[#b08b2e]/10 transition text-slate-700 font-medium text-base shadow-sm"
                    onClick={() => { alert('Settings coming soon!'); }}
                  >
                    <FiSettings className="text-xl text-[#b08b2e]" /> Settings
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 transition text-red-700 font-medium text-base shadow-sm"
                    onClick={() => { window.location.href = '/'; }}
                  >
                    <FiLogOut className="text-xl text-red-500" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
