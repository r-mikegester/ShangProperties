import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";
import { useDashboardStats } from "../context/DashboardStatsContext";
import Sidebar from "../components/admin/Sidebar";
import Dock from "../components/admin/Dock";
import NavBar from "../components/admin/NavBar";
import { useAdminToolbar } from "../context/AdminToolbarContext";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markAllAsRead } = useNotification();
  const { refreshDashboard } = useDashboardStats();
  const { state: toolbarState } = useAdminToolbar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const [isProjectArchive, setIsProjectArchive] = useState(false);
  const [isInquiriesArchive, setIsInquiriesArchive] = useState(false);
  const [isInquiriesEditMode, setIsInquiriesEditMode] = useState(false);
  const [selectedInquiriesCount, setSelectedInquiriesCount] = useState(0);
  const isMobile = useIsMobile();

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

  // Determine current context
  const context = location.pathname.startsWith("/dashboard/projects") || location.pathname.startsWith("/admin/projects")
    ? "projects"
    : location.pathname.startsWith("/dashboard/inquiries") || location.pathname.startsWith("/admin/inquiries")
    ? "inquiries"
    : location.pathname.startsWith("/dashboard/page-management") || location.pathname.startsWith("/admin/page-management")
    ? "page-management"
    : location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin")
    ? "dashboard"
    : "other";

  // Update archive state when location changes
  useEffect(() => {
    if (context === "projects") {
      const params = new URLSearchParams(location.search);
      setIsProjectArchive(params.get("archived") === "true");
    } else if (context === "inquiries") {
      const params = new URLSearchParams(location.search);
      setIsInquiriesArchive(params.get("archived") === "true");
    }
  }, [location, context]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle project archive toggle
  const handleProjectToggleArchive = () => {
    const params = new URLSearchParams(location.search);
    if (isProjectArchive) {
      params.delete("archived");
    } else {
      params.set("archived", "true");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Handle inquiries archive toggle
  const handleInquiriesToggleArchive = () => {
    const params = new URLSearchParams(location.search);
    if (isInquiriesArchive) {
      params.delete("archived");
    } else {
      params.set("archived", "true");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Handle inquiries archive view toggle (for the button in the content area)
  const handleInquiriesArchiveViewToggle = () => {
    setIsInquiriesArchive(!isInquiriesArchive);
    // Update URL params as well
    const params = new URLSearchParams(location.search);
    if (isInquiriesArchive) {
      params.delete("archived");
    } else {
      params.set("archived", "true");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Functions to handle mass operations - these will be called from NavBar
  const handleInquiriesMassArchive = () => {
    // This will be handled by the Inquiries component through context
    // We're just triggering the state change here
    console.log("Mass archive requested from NavBar");
    // Dispatch a custom event that the Inquiries component can listen to
    window.dispatchEvent(new CustomEvent('inquiriesMassArchive'));
  };

  const handleInquiriesMassDelete = () => {
    // This will be handled by the Inquiries component through context
    // We're just triggering the state change here
    console.log("Mass delete requested from NavBar");
    // Dispatch a custom event that the Inquiries component can listen to
    window.dispatchEvent(new CustomEvent('inquiriesMassDelete'));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <NavBar
          toolbarActions={undefined}
          onRefresh={refreshDashboard}
          onProjectToggleArchive={handleProjectToggleArchive}
          isProjectArchive={isProjectArchive}
          onInquiriesArchive={handleInquiriesToggleArchive}
          isInquiriesArchiveView={isInquiriesArchive}
          isInquiriesEditMode={isInquiriesEditMode}
          selectedInquiriesCount={selectedInquiriesCount}
          onInquiriesEdit={() => setIsInquiriesEditMode(true)}
          onInquiriesCancelEdit={() => {
            setIsInquiriesEditMode(false);
            setSelectedInquiriesCount(0);
          }}
          onInquiriesMassArchive={handleInquiriesMassArchive}
          onInquiriesMassDelete={handleInquiriesMassDelete}
          // Additional props for the archive view and edit mode toggles
          onInquiriesArchiveViewToggle={handleInquiriesArchiveViewToggle}
          isInquiriesArchiveViewState={isInquiriesArchive}
          onInquiriesEditModeToggle={() => setIsInquiriesEditMode(!isInquiriesEditMode)}
          isInquiriesEditModeActive={isInquiriesEditMode}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{
            isProjectArchive,
            setIsProjectArchive,
            isInquiriesArchive,
            setIsInquiriesArchive,
            isInquiriesEditMode,
            setIsInquiriesEditMode,
            selectedInquiriesCount,
            setSelectedInquiriesCount
          }} />
        </main>
      </div>
      {isMobile && <Dock />}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminLayout;