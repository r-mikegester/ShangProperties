import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // adjust path as needed
import { useNotification } from "../../context/NotificationContext";
import { toast } from "react-toastify";

// Define the Inquiry type
type Inquiry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  property: string;
  // add other fields as needed
};

const InquiryRealtimeListener = () => {
  const { addNotification } = useNotification();
  const lastSeenId = useRef<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Inquiry, 'id'>) }));
      
      // Handle initial load
      if (isFirstLoad.current) {
        // Set the first document as the last seen on initial load if it exists
        if (docs.length > 0) {
          lastSeenId.current = docs[0].id;
        }
        isFirstLoad.current = false;
        return;
      }
      
      // Check for new inquiries
      if (docs.length > 0 && docs[0].id !== lastSeenId.current) {
        const n = docs[0] as Inquiry;
        const message = `${n.firstName} ${n.lastName} (${n.email}) inquired about ${n.property}`;
        addNotification({
          type: "inquiry",
          title: "New Inquiry",
          message,
        });
        toast.success(message, { icon: <span>📩</span>, position: "top-right" });
        lastSeenId.current = docs[0].id;
      }
    });
    return () => unsubscribe();
  }, [addNotification]);

  return null;
};

export default InquiryRealtimeListener;