import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
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

const getPageTitle = (pathname: string, context?: string, isArchived?: boolean) => {
  if (pathname.startsWith("/dashboard/projects") || pathname.startsWith("/admin/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/inquiries") || pathname.startsWith("/admin/inquiries")) {
    if (context === "inquiries" && isArchived) return "Archives";
    return "Inquiries";
  }
  if (pathname.startsWith("/dashboard/page-management") || pathname.startsWith("/admin/page-management")) return "Page Setup";
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) return "Dashboard";
  return "Admin Panel";
};

interface NavBarProps {
  toolbarActions?: React.ReactNode;
  // Common
  onToggleMenu?: () => void;
  // Dashboard
  onRefresh?: () => void;
  // Inquiries
  onInquiriesEdit?: () => void;
  onInquiriesArchive?: () => void;
  // Projects
  onProjectAdd?: () => void;
  onProjectToggleArchive?: () => void;
  isProjectArchive?: boolean;
  // Page Management
  onPageEdit?: () => void;
  onPlaceholder?: () => void;
  
  // New props for inquiries edit mode
  isInquiriesEditMode?: boolean;
  isInquiriesArchiveView?: boolean;
  selectedInquiriesCount?: number;
  onInquiriesCancelEdit?: () => void;
  onInquiriesMassArchive?: () => void;
  onInquiriesMassDelete?: () => void;
  
  // Additional props for archive view and edit mode toggles in nav
  onInquiriesArchiveViewToggle?: () => void;
  isInquiriesArchiveViewState?: boolean;
  onInquiriesEditModeToggle?: () => void;
  isInquiriesEditModeActive?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  toolbarActions,
  onToggleMenu,
  onRefresh,
  onInquiriesEdit,
  onInquiriesArchive,
  onProjectAdd,
  onProjectToggleArchive,
  isProjectArchive,
  onPageEdit,
  onPlaceholder,
  
  // New props
  isInquiriesEditMode,
  isInquiriesArchiveView,
  selectedInquiriesCount = 0,
  onInquiriesCancelEdit,
  onInquiriesMassArchive,
  onInquiriesMassDelete,
  
  // Additional props for archive view and edit mode toggles in nav
  onInquiriesArchiveViewToggle,
  isInquiriesArchiveViewState,
  onInquiriesEditModeToggle,
  isInquiriesEditModeActive,
}) => {
  const location = useLocation();
  const context = location.pathname.startsWith("/dashboard/projects") || location.pathname.startsWith("/admin/projects")
    ? "projects"
    : location.pathname.startsWith("/dashboard/inquiries") || location.pathname.startsWith("/admin/inquiries")
    ? "inquiries"
    : location.pathname.startsWith("/dashboard/page-management") || location.pathname.startsWith("/admin/page-management")
    ? "page-management"
    : location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin")
    ? "dashboard"
    : "other";
  const pageTitle = getPageTitle(location.pathname, context, isInquiriesArchiveViewState);
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
        <span className="text-3xl font-semibold castoro-titling-regular text-[#b08b2e]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Dynamic tools based on current context */}
        {context === "dashboard" && (
          <>
            <button
              className="p-2 rounded hover:bg-slate-100 hidden md:flex transition"
              aria-label="Refresh dashboard"
              onClick={onRefresh || refreshDashboard}
              title="Refresh dashboard stats"
            >
              <Icon icon="mdi:refresh" width="24" height="24" />
            </button>
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
          </>
        )}

        {context === "inquiries" && !isInquiriesEditMode && (
          <div className="flex items-center gap-2">
            {!isInquiriesArchiveView && (
              <button
                type="button"
                aria-label="Edit inquiry"
                className="p-2 rounded-lg text-[#b08b2e] hover:bg-[#a07a1e] transition"
                onClick={onInquiriesEdit}
              >
                <Icon icon="solar:pen-2-broken" width={22} height={22} />
              </button>
            )}
            {/* Show edit button for archived inquiries as well */}
            {isInquiriesArchiveView && (
              <button
                type="button"
                aria-label="Edit archived inquiries"
                className="p-2 rounded-lg text-[#b08b2e] hover:bg-[#a07a1e] transition shadow"
                onClick={onInquiriesEdit}
              >
                <Icon icon="solar:pen-2-broken" width={22} height={22} />
              </button>
            )}
            <button
              type="button"
              aria-label={isInquiriesArchiveView ? "Show active inquiries" : "Show archived inquiries"}
              className={`p-2 rounded-lg transition shadow ${
                isInquiriesArchiveView
                  ? 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'
                  : 'bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10'
              }`}
              onClick={onInquiriesArchive}
            >
              <Icon 
                icon={isInquiriesArchiveView ? "solar:archive-minimalistic-broken" : "solar:archive-broken"} 
                width={22} 
                height={22} 
              />
            </button>
            {/* New buttons for archive view and edit mode toggles */}
           
          </div>
        )}

        {context === "inquiries" && isInquiriesEditMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cancel edit mode"
              className="p-2 rounded-lg flex items-center bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10 transition shadow"
              onClick={onInquiriesCancelEdit}
            >
              <Icon icon="solar:close-circle-broken" width={22} height={22} />
              <a>Cancel</a>
            </button>
            
            {/* Show bulk action buttons in edit mode for both active and archived inquiries */}
            {selectedInquiriesCount > 0 && (
              <>
                {!isInquiriesArchiveView && ( // For active inquiries, show archive option
                  <button
                    type="button"
                    aria-label="Archive selected inquiries"
                    className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow flex items-center gap-1"
                    onClick={onInquiriesMassArchive}
                  >
                    <Icon icon="solar:archive-broken" width={22} height={22} />
                    <span className="text-xs">({selectedInquiriesCount})</span>
                  </button>
                )}
                {isInquiriesArchiveView && ( // For archived inquiries, show delete option
                  <button
                    type="button"
                    aria-label="Delete selected inquiries"
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition shadow flex items-center gap-1"
                    onClick={onInquiriesMassDelete}
                  >
                    <Icon icon="solar:trash-bin-trash-broken" width={22} height={22} />
                    <span className="text-xs">({selectedInquiriesCount})</span>
                  </button>
                )}
              </>
            )}
            
            {/* Add archive view toggle in edit mode as well */}
            {/* <button 
              onClick={onInquiriesArchiveViewToggle}
              className="px-3 py-1 text-sm rounded-lg bg-[#b08b2e] text-white hover:bg-[#a07a1e]"
            >
              {isInquiriesArchiveViewState ? "Active" : "Archived"}
            </button> */}
          </div>
        )}

        {context === "projects" && (
          <div className="flex items-center gap-2">
                        <button
              type="button"
              aria-label={isProjectArchive ? "Show projects" : "Show archive"}
              className={`p-2 rounded-lg transition shadow ${
                isProjectArchive
                  ? 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'
                  : 'bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10'
              }`}
              onClick={onProjectToggleArchive}
            >
              <Icon icon={isProjectArchive ? 'solar:archive-minimalistic-broken' : 'solar:archive-broken'} width={22} height={22} />
            </button>
          </div>
        )}

        {context === "page-management" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Edit content"
              className="p-2 rounded-lg bg-[#b08b2e] text-white hover:bg-[#a07a1e] transition shadow"
              onClick={onPageEdit}
            >
              <Icon icon="solar:pen-2-broken" width={22} height={22} />
            </button>
            <button
              type="button"
              aria-label="Placeholder action"
              className="p-2 rounded-lg bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10 transition shadow"
              onClick={onPlaceholder}
            >
              <Icon icon="solar:stars-minimalistic-broken" width={22} height={22} />
            </button>
          </div>
        )}

      
      </div>
    </nav>
  );
};

export default NavBar;
