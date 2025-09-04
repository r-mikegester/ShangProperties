import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

interface ChangeLogEntry {
  section: string;
  action: string;
  details?: any;
  timestamp: any;
  userId?: string;
  userEmail?: string;
}

export const logChange = async (section: string, action: string, details?: any) => {
  try {
    const changeLogEntry: ChangeLogEntry = {
      section,
      action,
      details,
      timestamp: serverTimestamp(),
    };

    // Try to get user info if available
    const auth = await import("firebase/auth");
    const user = auth.getAuth().currentUser;
    if (user) {
      changeLogEntry.userId = user.uid;
      changeLogEntry.userEmail = user.email || undefined;
    }

    await addDoc(collection(db, "settings", "changeLog", "entries"), changeLogEntry);
    console.log(`Change logged: ${section} - ${action}`);
  } catch (error) {
    console.error("Failed to log change:", error);
  }
};