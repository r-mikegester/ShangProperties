import React from "react";
import { useNotification } from "../../context/NotificationContext";
import { Icon } from "@iconify/react";
import { Notification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const NotificationCenter: React.FC = () => {
  const { notifications, markAllAsRead, updateNotification } = useNotification();
  const navigate = useNavigate();

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const formatDateForMobile = (timestamp: Date) => {
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openDetails = (notification: Notification) => {
    // Mark as read when opening details
    if (!notification.read) {
      updateNotification(notification.id, { read: true });
    }
    
    // If it's an inquiry notification, navigate to inquiries page and open the inquiry
    if (notification.type === "inquiry" && notification.inquiryId) {
      navigate("/Admin/Inquiries");
      // Dispatch a custom event with the inquiry ID
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openInquiry', { detail: notification.inquiryId }));
      }, 100);
    }
  };

  const markAsRead = (id: string) => {
    updateNotification(id, { read: true });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 pb-20 bg-gradient-to-br h-full overflow-y-auto from-[#b08b2e]/10 to-[#b08b2e]/50 border border-[#b08b2e] rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="overflow-y-auto h-full pb-20 overflow-x-auto">
          {/* Desktop view - full table */}
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr 
                  key={notification.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => openDetails(notification)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(notification.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.type === 'inquiry' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'success' ? 'bg-green-100 text-green-800' :
                      notification.type === 'error' ? 'bg-red-100 text-red-800' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {notification.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {notification.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                      >
                        Mark as read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Mobile view - simplified list */}
          <div className="md:hidden space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  !notification.read ? 'border-[#b08b2e]/50 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                onClick={() => openDetails(notification)}
              >
                <div className="flex justify-between items-start h-full">
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDateForMobile(notification.timestamp)}
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded whitespace-nowrap ml-2"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;