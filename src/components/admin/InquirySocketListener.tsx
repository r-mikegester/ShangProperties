import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNotification } from "../../context/NotificationContext";
import { toast } from "react-toastify";
import CustomInquiryToast from "./CustomInquiryToast";

// Define the Inquiry type
type Inquiry = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  property?: string;
  createdAt?: any;
};

const InquiryRealtimeListener = () => {
  const { addNotification } = useNotification();
  const lastSeenId = useRef<string | null>(null);
  const isFirstLoad = useRef(true);
  const processedIds = useRef<Set<string>>(new Set());
  const activeToasts = useRef<Set<string>>(new Set());

  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const docs = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        }) as Inquiry[];
        
        // Handle initial load
        if (isFirstLoad.current) {
          // Add all existing document IDs to the processed set to avoid duplicate notifications
          docs.forEach(doc => processedIds.current.add(doc.id));
          isFirstLoad.current = false;
          return;
        }
        
        // Check for new inquiries that haven't been processed yet
        const newInquiries = docs.filter(doc => !processedIds.current.has(doc.id));
        
        // Process each new inquiry
        newInquiries.forEach(inquiry => {
          // Mark as processed to avoid duplicate notifications
          processedIds.current.add(inquiry.id);
          
          const firstName = inquiry.firstName || "Unknown";
          const lastName = inquiry.lastName || "";
          const email = inquiry.email || "No email";
          const property = inquiry.property || "Unknown property";
          
          const fullName = `${firstName} ${lastName}`.trim();
          const message = `${fullName} (${email}) inquired about ${property}`;
          
          // Add to notification center with inquiry ID
          addNotification({
            type: "inquiry",
            title: "New Inquiry",
            message,
            inquiryId: inquiry.id, // Add inquiry ID to notification
          });
          
          // Show custom toast notification only if not already active
          if (!activeToasts.current.has(inquiry.id)) {
            activeToasts.current.add(inquiry.id);
            
            const toastId = toast.success(
              <CustomInquiryToast 
                name={fullName} 
                email={email} 
                property={property} 
              />, 
              { 
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: "bg-transparent backdrop-blur-sm shadow-none p-0 border-0",
                onClose: () => {
                  // Remove from active toasts when closed
                  activeToasts.current.delete(inquiry.id);
                }
              }
            );
          }
        });
      } catch (error) {
        console.error("Error processing inquiry notifications:", error);
      }
    }, (error) => {
      console.error("Error in inquiry listener:", error);
    });
    
    return () => {
      unsubscribe();
      // Clear all active toasts on unmount
      activeToasts.current.clear();
    };
  }, [addNotification]);

  return null;
};

export default InquiryRealtimeListener;