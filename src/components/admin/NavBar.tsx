import { Icon } from "@iconify/react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationCenter from "./NotificationCenter";
import { useNotification } from "../../context/NotificationContext";
import { useDashboardStats } from "../../context/DashboardStatsContext";

const PAGE_TITLES: Record<string, string> = {
  "/Admin": "Dashboard",
  "/Admin/Dashboard": "Dashboard",
  "/Admin/Inquiries": "Inquiries",
  "/Admin/Projects": "Project Management",
  "/Admin/PageManagement": "Page Management",
  "/Admin/Settings": "Settings",
};

const getPageTitle = (pathname: string, context?: string, isArchived?: boolean) => {
  if (pathname.startsWith("/Admin/Projects")) return "Projects";
  if (pathname.startsWith("/Admin/Inquiries")) {
    if (context === "inquiries" && isArchived) return "Archives";
    return "Inquiries";
  }
  if (pathname.startsWith("/Admin/PageManagement")) return "Page Setup";
  if (pathname === "/Admin" || pathname === "/Admin/Dashboard") return "Dashboard";
  if (pathname.startsWith("/Admin/Settings")) return "Settings";
  return "Admin Panel";
};

interface NavBarProps {
  toolbarActions?: React.ReactNode;
  // Common
  onToggleMenu?: () => void;
  onLogout?: () => void;
  // Dashboard
  onRefresh?: () => void;
  // Inquiries
  onInquiriesEdit?: () => void;
  onInquiriesArchive?: () => void;
  // Projects
  onProjectAdd?: () => void;
  onProjectToggleArchive?: () => void;
  isProjectArchive?: boolean;
  onViewModeToggle?: () => void;
  viewMode?: "grid" | "list";
  // Page Management
  onPageEdit?: () => void;
  onPlaceholder?: () => void;

  // New props
  isInquiriesEditMode?: boolean;
  isInquiriesArchiveView?: boolean;
  selectedInquiriesCount?: number;
  onInquiriesCancelEdit?: () => void;
  onInquiriesMassArchive?: () => void;
  onInquiriesMassDelete?: () => void;

  // Additional props for the archive view and edit mode toggles in nav
  onInquiriesArchiveViewToggle?: () => void;
  isInquiriesArchiveViewState?: boolean;
  onInquiriesEditModeToggle?: () => void;
  isInquiriesEditModeActive?: boolean;

  // Page management editing mode
  isPageEditing?: boolean;
  onPageEditToggle?: () => void;
  onPageSave?: () => void;
  onPageCancel?: () => void;
  onPageRefresh?: () => void;
  
  // Project image text overlay toggle
  showProjectImageText?: boolean;
  onToggleProjectImageText?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  toolbarActions,
  onToggleMenu,
  onLogout,
  onRefresh,
  onProjectToggleArchive,
  onProjectAdd,
  isProjectArchive,
  onViewModeToggle,
  viewMode,
  onInquiriesArchive,
  isInquiriesArchiveView,
  isInquiriesEditMode,
  selectedInquiriesCount,
  onInquiriesEdit,
  onInquiriesCancelEdit,
  onInquiriesMassArchive,
  onInquiriesMassDelete,
  // Additional props for the archive view and edit mode toggles
  onInquiriesArchiveViewToggle,
  isInquiriesArchiveViewState,
  onInquiriesEditModeToggle,
  isInquiriesEditModeActive,
  // Page management props
  isPageEditing,
  onPageEditToggle,
  onPageSave,
  onPageCancel,
  onPageRefresh,
  // Project image text overlay toggle
  showProjectImageText,
  onToggleProjectImageText,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markAllAsRead } = useNotification();
  const { refreshDashboard } = useDashboardStats();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  // Determine page title based on location and context
  const context: "dashboard" | "projects" | "inquiries" | "page-management" | "settings" = location.pathname.startsWith("/Admin/Projects")
    ? "projects"
    : location.pathname.startsWith("/Admin/Inquiries")
      ? "inquiries"
      : location.pathname.startsWith("/Admin/PageManagement")
        ? "page-management"
        : location.pathname.startsWith("/Admin/Settings")
          ? "settings"
          : "dashboard";

  const isArchived = (context === "inquiries" && isInquiriesArchiveView) || (context === "projects" && isProjectArchive);
  const pageTitle = getPageTitle(location.pathname, context, isArchived);

  // Placeholder user info (replace with real user data if available)
  const user = {
    name: "Venezia Espiritu",
    info: "Shang Properties Inc.",
    avatar: "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/VeneziaEspiritu.jpg",
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/";
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
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
    <nav className="sticky top-0 z-10 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-3 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-3xl font-semibold castoro-titling-regular text-[#b08b2e]">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Dynamic tools based on current context */}
        {context === "dashboard" && (
          <>
            <button
              className="p-2 rounded hover:bg-slate-100 hidden md:flex transition"
              aria-label="Refresh dashboard"
              onClick={() => {
                // Add spinning animation class
                const icon = document.querySelector('.refresh-icon');
                if (icon) {
                  icon.classList.add('animate-spin');
                }
                // Execute refresh function if provided
                if (onRefresh) {
                  onRefresh();
                } else {
                  refreshDashboard();
                }
                // Reload the window after a short delay to show the spinning animation
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
              title="Refresh dashboard stats"
            >
              <Icon icon="solar:refresh-circle-broken" width="24" height="24" className="text-slate-600 refresh-icon" />
            </button>
            {/* Settings icon for mobile view */}

           
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded hover:bg-slate-100 relative transition"
                aria-label="Notifications"
              >
                <Icon icon="solar:bell-broken" width={24} height={24} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Sliding Notification Panel */}
              <AnimatePresence>
                {notifOpen && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-[4000] bg-black/40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setNotifOpen(false)}
                    />
                    <motion.div
                      className="fixed right-0 top-0 w-full md:w-[90vw] lg:w-[70vw] xl:w-[60vw] h-full bg-white shadow-2xl flex flex-col max-h-screen overflow-hidden z-[4001]"
                      initial={{ x: '100%', opacity: 0.5 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: '100%', opacity: 0.5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 bg-gradient-to-br from-[#b08b2e]/10 to-[#b08b2e]/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#b08b2e]/50 rounded-lg">
                            <Icon icon="mdi:bell" width="24" height="24" className="text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-slate-800">Notifications</h2>
                            <p className="text-slate-600 text-sm">
                              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="px-3 py-1 text-sm bg-[#b08b2e]/20 hover:bg-[#b08b2e]/30 rounded-lg text-[#b08b2e] transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                          <button 
                            onClick={() => setNotifOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                          >
                            <Icon icon="mdi:close" width="24" height="24" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <NotificationCenter />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
       
            
            {/* Settings button for mobile view */}
            <button
              className="md:hidden p-2 rounded hover:bg-slate-100 transition"
              onClick={() => navigate("/Admin/Settings")}
              aria-label="Settings"
            >
              <Icon icon="solar:settings-broken" width={24} height={24} className=" text-gray-600" />
            </button>
          </>
        )}

        {context === "inquiries" && !isInquiriesEditMode && (
          <div className="flex items-center gap-2">
            {!isInquiriesArchiveView && (
              <button
                type="button"
                aria-label="Edit inquiry"
                className="p-2 rounded-lg text-gray-600 hover:bg-[#a07a1e] hover:text-white transition hover:shadow-md"
                onClick={onInquiriesEdit}
              >
                <Icon icon="solar:pen-2-broken" width={24} height={24} />
              </button>
            )}
            {/* Show edit button for archived inquiries as well */}
            {isInquiriesArchiveView && (
              <button
                type="button"
                aria-label="Edit archived inquiries"
                className="p-2 rounded-lg text-gray-600 hover:bg-[#a07a1e] hover:text-white transition hover:shadow-md"
                onClick={onInquiriesEdit}
              >
                <Icon icon="solar:pen-2-broken" width={24} height={24} />
              </button>
            )}
            <button
              type="button"
              aria-label={isInquiriesArchiveView ? "Show active inquiries" : "Show archived inquiries"}
              className={`p-2 rounded-lg transition ${isInquiriesArchiveView
                  ? 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'
                  : 'text-gray-600 hover:bg-[#b08b2e]/10'
                }`}
              onClick={onInquiriesArchive}
            >
              <Icon
                icon={isInquiriesArchiveView ? "solar:archive-minimalistic-broken" : "solar:archive-broken"}
                width={24}
                height={24}
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
              className="p-2 rounded-lg flex items-center space-x-1 text-[#b08b2e] hover:bg-[#b08b2e]/10 transition hover:shadow-md"
              onClick={onInquiriesCancelEdit}
            >
              <Icon icon="solar:close-circle-broken" width={24} height={24} />
              <a>Cancel</a>
            </button>

            {/* Show bulk action buttons in edit mode for both active and archived inquiries */}
            {selectedInquiriesCount && selectedInquiriesCount > 0 && (
              <>
                {!isInquiriesArchiveView && ( // For active inquiries, show archive option
                  <button
                    type="button"
                    aria-label="Archive selected inquiries"
                    className="p-2 rounded-lg  text-gray-600 hover:bg-[#b08b2e] transition hover:shadow-md hover:text-white flex items-center gap-1"
                    onClick={onInquiriesMassArchive}
                  >
                    <Icon icon="solar:archive-broken" width={24} height={24} />
                    {/* <span className="text-xs">({selectedInquiriesCount})</span> */}
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
                    {/* <span className="text-xs">({selectedInquiriesCount})</span> */}
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
              aria-label="Add project"
              className="p-2  text-gray-600 hover:bg-[#b08b2e]/10 hover:text-gray-600 rounded-lg transition flex items-center gap-2"
              onClick={onProjectAdd}
            >
              <Icon icon="solar:add-folder-broken" width="24" height="24" />
              {/* <span className="hidden md:inline">Add Project</span> */}
            </button>
            {/* <button
              type="button"
              aria-label={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
              className="p-2 bg-white text-gray-600  hover:bg-[#b08b2e]/10 rounded-lg  transition"
              onClick={onViewModeToggle}
              title={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
            >
              <Icon 
                icon={viewMode === 'grid' ? "solar:server-minimalistic-broken" : "solar:gallery-wide-broken"} 
                width="24" 
                height="24" 
              />
            </button> */}
            <button
              type="button"
              aria-label={isProjectArchive ? "Show projects" : "Show archive"}
              className={`p-2 rounded-lg transition flex items-center gap-2 ${
                isProjectArchive
                  ? 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'
                  : 'text-gray-600 hover:bg-[#b08b2e]/10'
              }`}
              onClick={onProjectToggleArchive}
            >
              <Icon icon="solar:archive-broken" width="24" height="24" />
              {/* <span className="hidden md:inline">Archived Projects</span> */}
            </button>
            {onToggleProjectImageText && (
              <button
                type="button"
                aria-label={showProjectImageText ? "Hide image text" : "Show image text"}
                className={`p-2 rounded-lg transition ${showProjectImageText
                    ? 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'
                    : 'text-gray-600 hover:bg-[#b08b2e]/10'
                  }`}
                onClick={onToggleProjectImageText}
              >
                <Icon icon={showProjectImageText ? 'solar:text-field-broken' : 'solar:text-cross-bold'} width={24} height={24} />
              </button>
            )}
          </div>
        )}

        {context === "page-management" && !isPageEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Edit content"
              className="p-2 rounded-lg text-gray-600 hover:bg-[#a07a1e] hover:text-white transition"
              onClick={onPageEditToggle}
            >
              <Icon icon="solar:pen-2-broken" width={24} height={24} />
            </button>
            <button
              type="button"
              aria-label="Refresh page"
              className="p-2 rounded-lg text-gray-600 hover:bg-[#b08b2e]/10 transition"
              onClick={onPageRefresh}
            >
              <Icon icon="solar:refresh-circle-broken" width={24} height={24} />
            </button>
          </div>
        )}

        {context === "page-management" && isPageEditing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cancel edit"
              className="p-2 rounded-lg flex items-center bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10 transition shadow"
              onClick={onPageCancel}
            >
              <Icon icon="solar:close-circle-broken" width={24} height={24} />
              <span className="ml-1">Cancel</span>
            </button>
            {/* Removed save button - save functionality will be handled by individual editors */}
          </div>
        )}

        {context === "settings" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Logout"
              className="p-2 rounded-lg text-[#b08b2e] hover:bg-[#a07a1e] hover:text-white transition flex items-center gap-1"
              onClick={onLogout}
            >
              <Icon icon="solar:logout-2-broken" width={24} height={24} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;