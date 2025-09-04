import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getPageViewsByRoute(start: Date, end: Date) {
  const q = query(
    collection(db, "analytics_events"),
    where("type", "==", "page_view"),
    where("timestamp", ">=", Timestamp.fromDate(start)),
    where("timestamp", "<=", Timestamp.fromDate(end))
  );
  const snapshot = await getDocs(q);
  const counts: Record<string, number> = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    const route = data.route || "unknown";
    counts[route] = (counts[route] || 0) + 1;
  });
  return counts;
}

export async function getButtonClicksByLabel(start: Date, end: Date) {
  const q = query(
    collection(db, "analytics_events"),
    where("type", "==", "button_click"),
    where("timestamp", ">=", Timestamp.fromDate(start)),
    where("timestamp", "<=", Timestamp.fromDate(end))
  );
  const snapshot = await getDocs(q);
  const counts: Record<string, number> = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    const label = data.label || "unknown";
    counts[label] = (counts[label] || 0) + 1;
  });
  return counts;
}
