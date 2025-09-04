import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import LoadingIndicator from "./LoadingIndicator";

interface ChangeLogEntry {
  id: string;
  section: string;
  action: string;
  details?: any;
  timestamp: Timestamp;
  userId?: string;
  userEmail?: string;
}

const ChangeLogViewer: React.FC = () => {
  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<ChangeLogEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchChangeLogs = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "settings", "changeLog", "entries"),
          orderBy("timestamp", "desc"),
          limit(100)
        );

        const querySnapshot = await getDocs(q);
        const logs: ChangeLogEntry[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp as Timestamp
          } as ChangeLogEntry);
        });

        setChangeLogs(logs);
      } catch (err) {
        console.error("Error fetching change logs:", err);
        setError("Failed to fetch change logs");
      } finally {
        setLoading(false);
      }
    };

    fetchChangeLogs();
  }, []);

  const formatTimestamp = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString();
  };

  const formatDateForMobile = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openDetailsModal = (log: ChangeLogEntry) => {
    setSelectedLog(log);
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsDrawerOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDrawerOpen(false);
    setSelectedLog(null);
  };

  if (loading) {
    return <LoadingIndicator message="Loading change logs..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 pb-20 bg-gradient-to-br h-full overflow-y-auto from-[#b08b2e]/10 to-[#b08b2e]/30 border border-[#b08b2e] rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#b08b2e]/50 rounded-lg">
            <Icon icon="solar:clipboard-list-broken" width="24" height="24" className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Change Log</h2>
            <p className="text-slate-600 text-sm"> This page shows a log of all changes made to the website content.</p>
          </div>
        </div>
        {changeLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No change logs found.
          </div>
        ) : (
          <div className="overflow-y-auto h-full pb-20 overflow-x-auto ">
            {/* Desktop view - full table */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {changeLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.section}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.userEmail || log.userId || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.details ? (
                        <button 
                          onClick={() => openDetailsModal(log)}
                          className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                          aria-label="View details"
                        >
                          <Icon icon="mdi:eye" width="20" height="20" />
                        </button>
                      ) : (
                        'No details'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Mobile view - simplified list */}
            <div className="md:hidden space-y-3">
              {changeLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-[#b08b2e]/50 rounded-lg p-4 bg-white shadow-sm"
                  onClick={() => openDetailsModal(log)}
                >
                  <div className="flex justify-between items-center h-full">
                    <div className="flex flex-col min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {log.action}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDateForMobile(log.timestamp)}
                      </div>
                    </div>
                    <div className="flex justify-center items-center h-full">
                      <Icon icon="solar:alt-arrow-right-broken" width="24" height="24" className="text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed left-0 md:left-auto md:right-0 top-0 w-full md:w-[90vw] lg:w-[70vw] xl:w-[60vw] h-full bg-white shadow-2xl flex flex-col max-h-screen overflow-hidden z-[2999]"
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Change Log Details</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <Icon icon="mdi:close" width="24" height="24" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {selectedLog && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Section</h4>
                          <p className="text-gray-900">{selectedLog.section}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Action</h4>
                          <p className="text-gray-900">{selectedLog.action}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Timestamp</h4>
                          <p className="text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">User</h4>
                          <p className="text-gray-900">{selectedLog.userEmail || selectedLog.userId || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    {selectedLog.details && (
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-700 text-sm mb-3">Details</h4>
                        <pre className="text-sm text-gray-900 bg-white p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedLog.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <DragCloseDrawer 
        open={isDrawerOpen} 
        setOpen={setIsDrawerOpen}
        onClose={closeModal}
      >
        <div className="p-3 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Change Log Details</h3>
            <button 
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <Icon icon="mdi:close" width="24" height="24" />
            </button>
          </div>
          
          {selectedLog && (
            <div className="space-y-6">
              <div className="bg-[#b08b2e]/30 p-6 rounded-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Section</h4>
                    <p className="text-gray-900">{selectedLog.section}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Action</h4>
                    <p className="text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">Timestamp</h4>
                    <p className="text-gray-900">{formatTimestamp(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-1">User</h4>
                    <p className="text-gray-900 truncate ellipsis w-40">{selectedLog.userEmail || selectedLog.userId || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              
              {selectedLog.details && (
                <div className="bg-[#b08b2e]/30 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">Details</h4>
                  <pre className="text-sm text-gray-900 bg-white p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </DragCloseDrawer>
    </>
  );
};

export default ChangeLogViewer;