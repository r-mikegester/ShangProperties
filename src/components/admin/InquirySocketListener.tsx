import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNotification } from "../../context/NotificationContext";
import { toast, ToastOptions } from "react-toastify";
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
  const isFirstLoad = useRef(true);
  const processedIds = useRef<Set<string>>(new Set());
  const activeToasts = useRef<Map<string, any>>(new Map());

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
            const toastOptions: ToastOptions = { 
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              className: "bg-transparent backdrop-blur-sm shadow-none p-0 border-0 mb-2",
            };
            
            const toastId = toast.success(
              <CustomInquiryToast 
                name={fullName} 
                email={email} 
                property={property}
              />, 
              toastOptions
            );
            
            // Store toast ID for later dismissal
            activeToasts.current.set(inquiry.id, toastId);
            
            // Remove from active toasts after autoClose duration
            setTimeout(() => {
              activeToasts.current.delete(inquiry.id);
            }, 5000);
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
      // Dismiss all active toasts on unmount
      activeToasts.current.forEach((toastId) => {
        toast.dismiss(toastId);
      });
      activeToasts.current.clear();
    };
  }, [addNotification]);

  return null;
};

export default InquiryRealtimeListener;