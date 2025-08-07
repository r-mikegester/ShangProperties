import React, { useEffect, useState, ChangeEvent } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import "react-toastify/dist/ReactToastify.css";

// const API_URL = "http://localhost:5000/api/inquiry";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  property: string;
  message: string;
  createdAt?: FirestoreTimestamp | string | null;
  read?: boolean; // <-- add this line
}

function formatDateTime(ts: any): string {
  if (!ts) return "-";
  try {
    // Firestore Timestamp object (from Firestore SDK)
    if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof ts.toDate === 'function') {
      const date = ts.toDate();
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    }
    // Plain object from API: { seconds, nanoseconds }
    if (typeof ts === 'object' && ts !== null && 'seconds' in ts) {
      const date = new Date(ts.seconds * 1000);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    }
    // ISO string
    if (typeof ts === 'string') {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    }
  } catch {
    return "-";
  }
  return "-";
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry>>({});
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mark as read in Firestore and local state
  const markAsRead = async (inq: Inquiry) => {
    if (inq.read) return;
    try {
      await updateDoc(doc(db, "inquiries", inq.id), { read: true });
      setInquiries((prev) => prev.map((item) => item.id === inq.id ? { ...item, read: true } : item));
    } catch (err) {
      // ignore error for now
    }
  };

  // Fetch all inquiries (from Firestore, like Dashboard)
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setInquiries(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          country: data.country || '',
          property: data.property || '',
          message: data.message || '',
          createdAt: data.createdAt || null,
          read: data.read || false,
        } as Inquiry;
      }));
    } catch (err) {
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Delete inquiry
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await import("firebase/firestore").then(({ deleteDoc, doc }) =>
        deleteDoc(doc(db, "inquiries", id))
      );
      toast.success("Inquiry deleted");
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    } catch (err) {
      toast.error("Failed to delete inquiry");
    }
  };

  // Start editing
  const handleEdit = (inquiry: Inquiry) => {
    setEditingId(inquiry.id);
    setEditForm({ ...inquiry });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      if (!editingId) return;
      await import("firebase/firestore").then(({ updateDoc, doc }) =>
        updateDoc(doc(db, "inquiries", editingId), editForm)
      );
      toast.success("Inquiry updated");
      setInquiries(
        inquiries.map((inq) => (inq.id === editingId ? { ...inq, ...editForm } as Inquiry : inq))
      );
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      toast.error("Failed to update inquiry");
    }
  };

  // Handle edit form change
  const handleEditFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex p-3 flex-col items-center justify-center min-h-[85vh] h-[90vh] max-h-full rounded-xl overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg p-3 w-full max-w-full flex flex-col md:flex-row items-stretch gap-6 h-full">
        {/* Inquiry List (scrollable) */}
        <div className="flex-1 min-w-[260px] max-w-md border-r border-slate-100 pr-2 h-full overflow-y-auto">
          {/* <h1 className="text-3xl font-bold mb-4 castoro-titling-regular text-[#b08b2e]">Inquiries</h1> */}
          {loading ? (
            <div>
              <div>
                <ul className="py-2">
                  {Array.from({ length: 15 }).map((_, idx) => (
                    <li key={idx} className="my-4 px-6">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-4 justify-between w-full animate-pulse">
                        <div className="flex flex-row items-center gap-2">
                          {/* <div className="bg-gray-200 rounded-full size-10" /> */}
                          <Icon icon="solar:letter-broken" className="text-gray-400 size-10" />
                          <div className="flex flex-col">
                            <span className="h-4 w-24 bg-gray-200 rounded mb-1"></span>
                            <span className="h-3 w-32 bg-gray-200 rounded"></span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-2 ml-auto">
                          <span className="h-3 w-16 bg-gray-200 rounded"></span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <ul className="w-full p-3">
              {inquiries.length === 0 ? (
                <li className="text-center py-4 text-slate-400">No inquiries found.</li>
              ) : (
                inquiries.map((inq) => {
                  // Debug log for createdAt
                  // eslint-disable-next-line no-console
                  console.log('Inquiry createdAt:', inq.createdAt, 'for inquiry:', inq.id);
                  return (
                    <li key={inq.id} className="my-2">
                      <SmoothHoverMenuItem onClick={async () => {
                        setSelectedInquiry(inq);
                        await markAsRead(inq);
                      }}>
                        <div className="flex flex-col md:flex-row md:items-center space-x-10 md:gap-4 justify-between w-full">
                          <div className="flex flex-row items-center gap-2">
                            {inq.read ? (
                              <Icon icon="solar:letter-broken" className="text-[#b08b2e] size-10" />
                            ) : (
                              <Icon icon="solar:letter-unread-broken" className="text-red-400 size-10" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-800">{inq.firstName} {inq.lastName}</span>
                              <span className="text-xs text-slate-500">{inq.email}</span>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:gap-2 ml-auto">
                            <span className="text-xs text-right text-slate-400">{formatDateTime(inq.createdAt) === '-' ? 'No date' : formatDateTime(inq.createdAt)}</span>
                          </div>
                        </div>
                      </SmoothHoverMenuItem>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </div>
        {/* Preview Panel (responsive) */}
        {isMobile ? (
          <DragCloseDrawer
            open={!!selectedInquiry}
            setOpen={(v) => {
              if (typeof v === 'function') {
                if (!v(true)) setSelectedInquiry(null);
              } else {
                if (!v) setSelectedInquiry(null);
              }
            }}
            onClose={() => setSelectedInquiry(null)}
            drawerHeight="80vh"
          >
            <div className="p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-[#b08b2e]">Inquiry Preview</h2>
              {selectedInquiry ? (
                <div className="bg-[#b08b2e]/50 border border-gray-100 rounded-lg shadow p-4">
                  <div className="mb-2"><span className="font-semibold">Name:</span> {selectedInquiry.firstName} {selectedInquiry.lastName}</div>
                  <div className="mb-2"><span className="font-semibold">Email:</span> {selectedInquiry.email}</div>
                  <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedInquiry.phone}</div>
                  <div className="mb-2"><span className="font-semibold">Country:</span> {selectedInquiry.country}</div>
                  <div className="mb-2"><span className="font-semibold">Property:</span> {selectedInquiry.property}</div>
                  <div className="mb-2"><span className="font-semibold">Message:</span> {selectedInquiry.message}</div>
                  <div className="mb-2"><span className="font-semibold">Date:</span>  {formatDateTime(selectedInquiry?.createdAt)}</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleEdit(selectedInquiry)} className="text-blue-600 hover:text-blue-800"><Icon icon="mdi:pencil" width={22} height={22} /></button>
                    <button onClick={() => handleDelete(selectedInquiry.id)} className="text-red-600 hover:text-red-800"><Icon icon="mdi:delete" width={22} height={22} /></button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">Select an inquiry to preview details.</div>
              )}
            </div>
          </DragCloseDrawer>
        ) : (
          <div className="flex-1 min-w-[260px] max-w-xl p-4 h-full overflow-hidden hidden md:flex md:flex-col">
            {selectedInquiry ? (
              <>
                <div>
                  <div className="flex gap-2 items-center justify-between ">
                    <h2 className="text-xl font-semibold mb-4 text-[#b08b2e]">Inquiry Preview</h2>
                    <div>
                      <button onClick={() => handleEdit(selectedInquiry)} className="text-blue-600 hover:text-blue-800"><Icon icon="mdi:pencil" width={22} height={22} /></button>
                      <button onClick={() => handleDelete(selectedInquiry.id)} className="text-red-600 hover:text-red-800"><Icon icon="mdi:delete" width={22} height={22} /></button>
                    </div>
                  </div>

                </div><div className="bg-[#b08b2e]/50 border border-gray-100 rounded-lg shadow p-4">
                  <div className="mb-2"><span className="font-semibold">Name:</span> {selectedInquiry.firstName} {selectedInquiry.lastName}</div>
                  <div className="mb-2"><span className="font-semibold">Email:</span> {selectedInquiry.email}</div>
                  <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedInquiry.phone}</div>
                  <div className="mb-2"><span className="font-semibold">Country:</span> {selectedInquiry.country}</div>
                  <div className="mb-2"><span className="font-semibold">Property:</span> {selectedInquiry.property}</div>
                  <div className="mb-2"><span className="font-semibold">Message:</span> {selectedInquiry.message}</div>
                  <div className="mb-2"><span className="font-semibold">Date:</span> {formatDateTime(selectedInquiry.createdAt)}</div>

                </div></>
            ) : (
              <div className="text-slate-400">Select an inquiry to preview details.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
