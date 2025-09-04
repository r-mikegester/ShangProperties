import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Dock from "../components/admin/Dock";
import NavBar from "../components/admin/NavBar";
import InquirySocketListener from "../components/admin/InquirySocketListener";
import { useNotification } from "../context/NotificationContext";
import { onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useDashboardStats } from "../context/DashboardStatsContext";
import useIsMobile from "../hooks/useIsMobile";
import { getAuth, signOut } from "firebase/auth";
import { addDoc, serverTimestamp, collection as firestoreCollection } from "firebase/firestore";
import { toast } from "react-toastify";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { refreshDashboard } = useDashboardStats();
  const isMobile = useIsMobile(768);
  
  // State for projects
  const [isProjectArchive, setIsProjectArchive] = useState(false);
  const [isProjectAddMode, setIsProjectAddMode] = useState(false);
  const [projectsViewMode, setProjectsViewMode] = useState<"grid" | "list">(() => {
    // Get view mode from localStorage or default to "grid"
    const savedViewMode = localStorage.getItem("projectsViewMode");
    return savedViewMode === "list" ? "list" : "grid";
  });
  
  // State for inquiries
  const [isInquiriesArchive, setIsInquiriesArchive] = useState(false);
  const [isInquiriesEditMode, setIsInquiriesEditMode] = useState(false);
  const [selectedInquiriesCount, setSelectedInquiriesCount] = useState(0);

  // State for page management
  const [isPageEditing, setIsPageEditing] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("projectsViewMode", projectsViewMode);
  }, [projectsViewMode]);

  // Determine page context based on location
  const context = location.pathname.startsWith("/Admin/Projects")
    ? "projects"
    : location.pathname.startsWith("/Admin/Inquiries")
      ? "inquiries"
      : location.pathname.startsWith("/Admin/PageManagement")
        ? "page-management"
        : "dashboard";

  // Debug: Log context changes
  React.useEffect(() => {
    console.log(`[AdminLayout] Context determined: ${context}`);
  }, [context]);

  // Listen for new inquiries
  useEffect(() => {
    console.log('[AdminLayout] Setting up inquiry listener');
    
    // First get all recent inquiries ordered by timestamp
    const q = query(
      collection(db, "inquiries"),
      orderBy("timestamp", "desc"),
      limit(10) // Get more than 1 to ensure we catch unread ones
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`[AdminLayout] Received snapshot with ${snapshot.size} inquiries`);
      
      // Filter for unread inquiries on the client side
      const unreadChanges = snapshot.docChanges().filter(change => 
        change.type === "added" && change.doc.data().status === "unread"
      );
      
      // Process only the first unread inquiry to avoid duplicates
      if (unreadChanges.length > 0) {
        const change = unreadChanges[0];
        const inquiryData = change.doc.data();
        console.log(`[AdminLayout] New unread inquiry from ${inquiryData.name}`);
        
        addNotification({
          type: "inquiry",
          title: "New Inquiry",
          message: `New inquiry from ${inquiryData.name}`,
          inquiryId: change.doc.id,
        });

        // Refresh dashboard stats when new inquiry arrives
        refreshDashboard();
      }
    });

    return () => {
      console.log('[AdminLayout] Unsubscribing from inquiry listener');
      unsubscribe();
    };
  }, [addNotification, refreshDashboard]);

  // Handle inquiry opening from notification
  useEffect(() => {
    console.log('[AdminLayout] Setting up openInquiry event listener');
    
    const handleOpenInquiry = (event: CustomEvent) => {
      const inquiryId = event.detail;
      console.log(`[AdminLayout] Opening inquiry: ${inquiryId}`);
      navigate(`/Admin/Inquiries?open=${inquiryId}`);
    };

    window.addEventListener('openInquiry', handleOpenInquiry as EventListener);
    return () => {
      console.log('[AdminLayout] Removing openInquiry event listener');
      window.removeEventListener('openInquiry', handleOpenInquiry as EventListener);
    };
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    console.log('[AdminLayout] Initiating logout');
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      // Log the logout event
      if (user) {
        console.log(`[AdminLayout] Recording logout event for user: ${user.email}`);
        await addDoc(firestoreCollection(db, "adminLogs"), {
          type: "logout",
          userId: user.uid,
          email: user.email,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent
        });
      }
      
      await signOut(auth);
      console.log('[AdminLayout] Logout successful');
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  // Prepare context value for child components
  const outletContext = {
    // Projects context
    isProjectArchive,
    setIsProjectArchive,
    isProjectAddMode,
    setIsProjectAddMode,
    projectsViewMode,
    setProjectsViewMode,
    
    // Inquiries context
    isInquiriesArchive,
    setIsInquiriesArchive,
    isInquiriesEditMode,
    setIsInquiriesEditMode,
    selectedInquiriesCount,
    setSelectedInquiriesCount,
    
    // Page management context
    isPageEditing,
    setIsPageEditing,
  };
  

  return (
    <div className="flex h-screen" data-component="AdminLayout">
      
      {/* Sidebar - hidden on mobile, shown on desktop */}
      {!isMobile && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NavBar */}
        <NavBar 
          isProjectArchive={isProjectArchive}
          onProjectToggleArchive={() => setIsProjectArchive(!isProjectArchive)}
          onProjectAdd={() => setIsProjectAddMode(true)}
          onViewModeToggle={() => setProjectsViewMode(prev => prev === "grid" ? "list" : "grid")}
          viewMode={projectsViewMode}
          isInquiriesArchiveView={isInquiriesArchive}
          onInquiriesArchive={() => setIsInquiriesArchive(!isInquiriesArchive)}
          isInquiriesEditMode={isInquiriesEditMode}
          onInquiriesEdit={() => setIsInquiriesEditMode(!isInquiriesEditMode)}
          selectedInquiriesCount={selectedInquiriesCount}
          onInquiriesCancelEdit={() => {
            setIsInquiriesEditMode(false);
            setSelectedInquiriesCount(0);
          }}
          onLogout={handleLogout}
          isPageEditing={isPageEditing}
          onPageEditToggle={() => setIsPageEditing(!isPageEditing)}
          onPageCancel={() => {
            setIsPageEditing(false);
            // Dispatch event to PageManagement component
            window.dispatchEvent(new CustomEvent('pageCancelRequested'));
          }}
          onPageSave={() => {
            // Dispatch event to PageManagement component
            window.dispatchEvent(new CustomEvent('pageSaveRequested'));
            setIsPageEditing(false);
          }}
          onPageRefresh={() => {
            // Dispatch event to PageManagement component
            window.dispatchEvent(new CustomEvent('pageRefreshRequested'));
          }}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-full mx-auto h-full">
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>

      {/* Mobile Dock Navigation */}
      {isMobile && <Dock />}

      {/* Socket Listener for Real-time Updates */}
      <InquirySocketListener />
    </div>
  );
};

export default AdminLayout;