import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export type AnalyticsEvent = {
  type: "page_view" | "button_click" | "conversion";
  route?: string; // e.g., "/laya"
  label?: string; // e.g., "floating_button"
  extra?: Record<string, any>;
};

export async function logEvent(event: AnalyticsEvent) {
  await addDoc(collection(db, "analytics_events"), {
    ...event,
    timestamp: serverTimestamp(),
  });
}
