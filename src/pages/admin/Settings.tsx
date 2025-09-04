    import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Modal from "../../components/shared/Modal";
import ChangeLogViewer from "../../components/admin/ChangeLogViewer";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface LoginLogEntry {
  id: string;
  type: string;
  userId: string;
  email: string;
  timestamp: any;
  userAgent: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loginLogs, setLoginLogs] = useState<LoginLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setStateActiveSection] = useState("changelog");
  
  const setActiveSection = (section: string) => {
    setStateActiveSection(section);
  };

  useEffect(() => {
    fetchLoginLogs();
  }, []);

  const fetchLoginLogs = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        // Fetch login logs from Firestore
        const q = query(
          collection(db, "adminLogs"), 
          orderBy("timestamp", "desc"), 
          limit(20)
        );
        
        const querySnapshot = await getDocs(q);
        const logs: LoginLogEntry[] = [];
        
        querySnapshot.forEach((doc) => {
          logs.push({
            id: doc.id,
            ...doc.data()
          } as LoginLogEntry);
        });
        
        setLoginLogs(logs);
      }
    } catch (error) {
      console.error("Error fetching login logs:", error);
      toast.error("Failed to load login logs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      // Log the logout event
      if (user) {
        await addDoc(collection(db, "adminLogs"), {
          type: "logout",
          userId: user.uid,
          email: user.email,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent
        });
      }
      
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "Unknown";
    
    try {
      let date: Date;
      
      // Handle Firestore Timestamp
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } 
      // Handle plain object with seconds
      else if (typeof timestamp === 'object' && timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } 
      // Handle Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      } 
      // Handle milliseconds number
      else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } 
      // Handle ISO string
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } 
      else {
        return "Invalid date";
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Settings sections configuration
  const settingsSections = [
    { id: "changelog", title: "Change Log", icon: "solar:clipboard-list-broken" },
    { id: "history", title: "Login History", icon: "solar:history-broken" },
    { id: "account", title: "Account", icon: "solar:shield-user-broken" },
    // { id: "notifications", title: "Notifications", icon: "mdi:bell" },
    // { id: "appearance", title: "Appearance", icon: "mdi:palette" },
  ];

  if (loading) {
    return <LoadingIndicator message="Loading settings..." />;
  }

  return (
    <div className="flex flex-col max-h-full pb-24 md:pb-0">
      <div className="flex p-0 flex-col items-center justify-center h-[100dvh] min-h-full rounded-xl overflow-hidden">
        <div className="bg-white rounded-xl shadow-lg p-3 w-full min-h-full min-w-full">
          {/* <div className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
          </div> */}

          <div className="flex flex-col md:flex-row h-full gap-3">
            {/* Settings Sidebar */}
            <div className="md:w-64 flex-shrink-0  ">
              <div className="bg-[#b08b2e]/10 rounded-xl border border-[#b08b2e] p-4 h-full">
                <nav className="space-y-1 flex md:flex-col">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors md:justify-start justify-center ${
                        activeSection === section.id
                          ? "bg-[#b08b2e]/20 text-[#b08b2e] font-medium"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Icon icon={section.icon} width={20} height={20} />
                      <span className="md:inline-block hidden">{section.title}</span>
                      {activeSection === section.id && (
                        <span className="md:hidden inline-flex items-center gap-1">
                          <span className="truncate max-w-[80px]">{section.title}</span>
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {activeSection === "account" && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <Icon icon="solar:shield-user-broken" width="24" height="24"  className="text-white"/>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Account Management</h2>
                      <p className="text-slate-600 text-sm">Manage your account settings and security</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between py-3 border-b border-red-200">
                      <div>
                        <h3 className="font-medium text-slate-800">Logout</h3>
                        <p className="text-slate-600 text-sm">End your current session</p>
                      </div>
                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}

 
              {activeSection === "history" && (
                <div className="bg-gradient-to-br pb-20 from-blue-50 to-blue-100 h-full overflow-y-auto border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Icon icon="solar:history-broken" width="24" height="24" className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Login History</h2>
                      <p className="text-slate-600 text-sm">View your recent login activity</p>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                    </div>
                  ) : loginLogs.length > 0 ? (
                    <div className="overflow-x-auto overflow-y-auto h-full pb-20">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {loginLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                {formatDate(log.timestamp)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  log.type === 'login' 
                                    ? 'bg-green-100 text-green-800' 
                                    : log.type === 'logout' 
                                      ? 'bg-orange-100 text-orange-800' 
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {log.type === 'login' ? 'Login' : log.type === 'logout' ? 'Logout' : 'Unknown'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-500">
                                {log.email || 'Unknown user'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No login history found.
                    </div>
                  )}
                </div>
              )}

              {activeSection === "changelog" && (
                <div className="h-full">
                  <ChangeLogViewer />
                </div>
              )}

              {/* Placeholder sections for other settings */}
              {/* {activeSection !== "account" && activeSection !== "history" && activeSection !== "changelog" && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-12 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="p-3 bg-slate-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon 
                      icon={
                        activeSection === "security" ? "mdi:security" :
                        activeSection === "notifications" ? "mdi:bell" :
                        activeSection === "appearance" ? "mdi:palette" : "mdi:cog"
                      } 
                      width={32} 
                      height={32} 
                      className="text-slate-500" 
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {settingsSections.find(s => s.id === activeSection)?.title}
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    This section is under development. Please check back later for updates.
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      >
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:logout" width={32} height={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Logout</h3>
            <p className="text-slate-600">
              Are you sure you want to logout from your account?
            </p>
          </div>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;