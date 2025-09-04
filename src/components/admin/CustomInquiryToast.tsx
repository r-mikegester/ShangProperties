import React from "react";
import { Icon } from "@iconify/react";

interface CustomInquiryToastProps {
  name: string;
  email: string;
  property: string;
}

const CustomInquiryToast: React.FC<CustomInquiryToastProps> = ({ name, email, property }) => {
  // Get current date and time
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex items-start p-3 bg-white rounded-lg shadow-lg max-w-md">
      <div className="mr-3 flex items-center justify-center">
        <Icon icon="mdi:email" width="32" height="32" className="text-blue-500" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-800 text-sm mb-1">New Inquiry</div>
        <div className="text-gray-700 text-sm mb-2">
          {name} ({email}) inquired about {property}
        </div>
        <div className="text-xs text-gray-500">
          {timeString} · {dateString}
        </div>
      </div>
    </div>
  );
};

export default CustomInquiryToast;