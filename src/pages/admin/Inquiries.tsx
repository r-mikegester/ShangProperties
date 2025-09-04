import React, { useEffect, useState, ChangeEvent, useMemo } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import PaperNote from "../../components/admin/PaperNote";
import Modal from "../../components/shared/Modal";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import InquirySocketListener from "../../components/admin/InquirySocketListener";

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
  read?: boolean;
  archived?: boolean;
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
  // Get context from AdminLayout
  const context = useOutletContext<{
    isProjectArchive: boolean;
    setIsProjectArchive: (value: boolean) => void;
    isInquiriesArchive: boolean;
    setIsInquiriesArchive: (value: boolean) => void;
    isInquiriesEditMode: boolean;
    setIsInquiriesEditMode: (value: boolean) => void;
    selectedInquiriesCount: number;
    setSelectedInquiriesCount: (value: number) => void;
  }>();

  const location = useLocation();

  // Use context values
  const {
    isInquiriesArchive,
    setIsInquiriesArchive,
    isInquiriesEditMode,
    setIsInquiriesEditMode,
    selectedInquiriesCount,
    setSelectedInquiriesCount
  } = context;

  const isArchivedView = isInquiriesArchive;

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry>>({});
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // New state for search functionality
  const [searchTerm, setSearchTerm] = useState<string>('');
  // State to control whether to show all inquiries (both archived and active) during search
  const [showAllInquiries, setShowAllInquiries] = useState<boolean>(false);

  // New state for the requested features
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState<boolean>(isInquiriesArchive);

  // Confirmation drawer states
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // New state for single inquiry deletion
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);
  const [showDeleteSingleConfirm, setShowDeleteSingleConfirm] = useState<boolean>(false);

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
          archived: data.archived || false, // Handle archived property
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

  // Effect to handle unread filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const unreadFilter = params.get('unread') === 'true';

    // If unread filter is true and we have inquiries, automatically open the first unread inquiry
    if (unreadFilter && inquiries.length > 0) {
      const firstUnread = inquiries.find(inquiry => !inquiry.read);
      if (firstUnread) {
        setSelectedInquiry(firstUnread);
      }
    }
  }, [location.search, inquiries]);

  // Listen for mass archive event from NavBar
  useEffect(() => {
    const handleMassArchiveEvent = () => {
      handleMassArchive();
    };

    const handleMassDeleteEvent = () => {
      handleMassDelete();
    };

    window.addEventListener('inquiriesMassArchive', handleMassArchiveEvent);
    window.addEventListener('inquiriesMassDelete', handleMassDeleteEvent);

    return () => {
      window.removeEventListener('inquiriesMassArchive', handleMassArchiveEvent);
      window.removeEventListener('inquiriesMassDelete', handleMassDeleteEvent);
    };
  }, [selectedInquiries]);

  // Listen for openInquiry event
  useEffect(() => {
    const handleOpenInquiry = (event: CustomEvent) => {
      const inquiryId = event.detail;
      const inquiry = inquiries.find(inq => inq.id === inquiryId);
      if (inquiry) {
        setSelectedInquiry(inquiry);
        // For mobile, the drawer will automatically open because we set selectedInquiry
        // For desktop, the detail panel is always visible
      }
    };

    window.addEventListener('openInquiry', handleOpenInquiry as EventListener);
    return () => {
      window.removeEventListener('openInquiry', handleOpenInquiry as EventListener);
    };
  }, [inquiries]);

  // Delete inquiry
  const handleDelete = async (id: string) => {
    // Only allow deletion of archived inquiries
    const inquiry = inquiries.find(inq => inq.id === id);
    if (!inquiry || !inquiry.archived) {
      toast.error("Only archived inquiries can be deleted permanently");
      return;
    }

    // Store the ID of the inquiry to be deleted
    setInquiryToDelete(id);
    setShowDeleteSingleConfirm(true);
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

  // Archive inquiry (instead of deleting)
  const handleArchive = async (id: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { archived: true });
      toast.success("Inquiry archived");
      setInquiries(
        inquiries.map((inq) =>
          inq.id === id ? { ...inq, archived: true } : inq
        )
      );
      // Clear selection if this was the selected inquiry
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      toast.error("Failed to archive inquiry");
    }
  };

  // Restore inquiry from archive
  const handleRestore = async (id: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { archived: false });
      toast.success("Inquiry restored");
      setInquiries(
        inquiries.map((inq) =>
          inq.id === id ? { ...inq, archived: false } : inq
        )
      );
    } catch (err) {
      toast.error("Failed to restore inquiry");
    }
  };

  // Mass archive selected inquiries
  const handleMassArchive = async () => {
    if (selectedInquiries.length === 0) {
      toast.warn("No inquiries selected");
      return;
    }

    setShowArchiveConfirm(true);
  };

  // Confirm archive action
  const confirmArchive = async () => {
    try {
      const archivePromises = selectedInquiries.map(id =>
        updateDoc(doc(db, "inquiries", id), { archived: true })
      );

      await Promise.all(archivePromises);

      setInquiries(
        inquiries.map((inq) =>
          selectedInquiries.includes(inq.id)
            ? { ...inq, archived: true }
            : inq
        )
      );

      toast.success(`${selectedInquiries.length} inquiry(s) archived`);
      setSelectedInquiries([]);
      setShowArchiveConfirm(false);

      // Update the count in context
      setSelectedInquiriesCount(0);
    } catch (err) {
      toast.error("Failed to archive inquiries");
    }
  };

  // Mass delete selected inquiries (permanent delete)
  const handleMassDelete = async () => {
    if (selectedInquiries.length === 0) {
      toast.warn("No inquiries selected");
      return;
    }

    setShowDeleteConfirm(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    try {
      const deletePromises = selectedInquiries.map(id =>
        deleteDoc(doc(db, "inquiries", id))
      );

      await Promise.all(deletePromises);

      setInquiries(
        inquiries.filter((inq) => !selectedInquiries.includes(inq.id))
      );

      toast.success(`${selectedInquiries.length} inquiry(s) deleted`);
      setSelectedInquiries([]);

      // Clear selection if any deleted inquiry was selected
      if (selectedInquiry && selectedInquiries.includes(selectedInquiry.id)) {
        setSelectedInquiry(null);
      }

      // Update the count in context and reset selection count
      setSelectedInquiriesCount(0);

      setShowDeleteConfirm(false);
    } catch (err) {
      toast.error("Failed to delete inquiries");
    }
  };

  // Toggle selection of an inquiry
  const toggleInquirySelection = (id: string) => {
    if (selectedInquiries.includes(id)) {
      setSelectedInquiries(selectedInquiries.filter(inquiryId => inquiryId !== id));
    } else {
      setSelectedInquiries([...selectedInquiries, id]);
    }

    // Update the count in context
    // Use a timeout to ensure the state has been updated
    setTimeout(() => {
      setSelectedInquiriesCount(selectedInquiries.length);
    }, 0);
  };

  // Toggle selection of all inquiries
  const toggleSelectAll = () => {
    const filteredInquiries = inquiries.filter(inq =>
      isInquiriesArchive ? inq.archived : !inq.archived
    );

    if (selectedInquiries.length === filteredInquiries.length && filteredInquiries.length > 0) {
      // Deselect all
      setSelectedInquiries([]);
    } else {
      // Select all
      setSelectedInquiries(filteredInquiries.map(inq => inq.id));
    }

    // Update the count in context
    setTimeout(() => {
      const newCount = selectedInquiries.length === filteredInquiries.length && filteredInquiries.length > 0
        ? 0
        : filteredInquiries.length;
      setSelectedInquiriesCount(newCount);
    }, 0);
  };

  // Filter inquiries based on archive status and search term
  const filteredInquiries = useMemo(() => {
    // If we have a search term and showAllInquiries is true, search across all inquiries
    if (searchTerm && showAllInquiries) {
      const term = searchTerm.toLowerCase().trim();
      return inquiries.filter(inquiry =>
        inquiry.firstName?.toLowerCase().includes(term) ||
        inquiry.lastName?.toLowerCase().includes(term) ||
        inquiry.email?.toLowerCase().includes(term) ||
        inquiry.phone?.toLowerCase().includes(term) ||
        inquiry.country?.toLowerCase().includes(term) ||
        inquiry.property?.toLowerCase().includes(term) ||
        inquiry.message?.toLowerCase().includes(term) ||
        formatDateTime(inquiry.createdAt).toLowerCase().includes(term)
      );
    }

    // Otherwise, filter by archive status as before
    return inquiries.filter(inquiry =>
      isInquiriesArchive ? inquiry.archived : !inquiry.archived
    );
  }, [inquiries, isInquiriesArchive, searchTerm, showAllInquiries]);

  // Separate inquiries into active and archived when searching
  const { activeInquiries, archivedInquiries } = useMemo(() => {
    if (!searchTerm || !showAllInquiries) {
      return { activeInquiries: [], archivedInquiries: [] };
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = inquiries.filter(inquiry =>
      inquiry.firstName?.toLowerCase().includes(term) ||
      inquiry.lastName?.toLowerCase().includes(term) ||
      inquiry.email?.toLowerCase().includes(term) ||
      inquiry.phone?.toLowerCase().includes(term) ||
      inquiry.country?.toLowerCase().includes(term) ||
      inquiry.property?.toLowerCase().includes(term) ||
      inquiry.message?.toLowerCase().includes(term) ||
      formatDateTime(inquiry.createdAt).toLowerCase().includes(term)
    );

    return {
      activeInquiries: filtered.filter(inquiry => !inquiry.archived),
      archivedInquiries: filtered.filter(inquiry => inquiry.archived)
    };
  }, [inquiries, searchTerm, showAllInquiries]);

  // Sync showArchived with context
  useEffect(() => {
    setShowArchived(isInquiriesArchive);
  }, [isInquiriesArchive]);

  // Sync selectedInquiriesCount with context
  useEffect(() => {
    setSelectedInquiriesCount(selectedInquiries.length);
  }, [selectedInquiries, setSelectedInquiriesCount]);

  // Update the context's archive state when our local state changes
  useEffect(() => {
    setIsInquiriesArchive(showArchived);
  }, [showArchived, setIsInquiriesArchive]);

  // Confirm single delete action
  const confirmSingleDelete = async () => {
    if (!inquiryToDelete) return;

    try {
      await deleteDoc(doc(db, "inquiries", inquiryToDelete));
      toast.success("Inquiry deleted");
      setInquiries(inquiries.filter((inq) => inq.id !== inquiryToDelete));

      // Clear selection if this was the selected inquiry
      if (selectedInquiry?.id === inquiryToDelete) {
        setSelectedInquiry(null);
      }

      // Update the count in context
      setSelectedInquiriesCount(Math.max(0, selectedInquiriesCount - 1));
    } catch (err) {
      toast.error("Failed to delete inquiry");
    } finally {
      setShowDeleteSingleConfirm(false);
      setInquiryToDelete(null);
    }
  };

  // Function to render an inquiry item
  const renderInquiryItem = (inq: Inquiry) => {
    return (
      <li key={inq.id} className="my-2 relative">
        <SmoothHoverMenuItem
          onClick={async () => {
            if (!isInquiriesEditMode) {
              setSelectedInquiry(inq);
              await markAsRead(inq);
            }
          }}
        >
          <div className={isInquiriesEditMode ? "" : ""}>
            <div className="flex flex-col md:flex-row md:items-center space-x- md:gap-4 justify-between w-full">
              <div className="flex flex-row items-center gap-2">
                {isInquiriesEditMode && (
                  <div className="">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInquiries.includes(inq.id)}
                        onChange={() => toggleInquirySelection(inq.id)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 bg-white border border-gray-300 rounded-lg peer-checked:bg-[#b08b2e] text-white peer-checked:border-[#b08b2e] peer-focus:ring-2 peer-focus:ring-[#b08b2e] flex items-center justify-center transition-colors duration-200">
                        <Icon icon="mingcute:check-2-fill" width="24" height="24" />
                      </div>
                    </label>
                  </div>
                )}
                {inq.read ? (
                  <Icon icon="solar:letter-broken" className="text-[#b08b2e] size-10" />
                ) : (
                  <Icon icon="solar:letter-unread-broken" className="text-red-400 size-10" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">{inq.firstName} {inq.lastName}</span>
                  <span className="text-xs text-slate-500">{inq.email}</span>
                </div>
                 <div className="flex flex-col md:flex-row md:items-center md:gap-2 md:ml-10 ml-2">
                <span className="text-xs text-right text-slate-400">{formatDateTime(inq.createdAt) === '-' ? 'No date' : formatDateTime(inq.createdAt)}</span>
              </div>
              </div>
             
            </div>
          </div>
        </SmoothHoverMenuItem>
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white pb-24 md:pb-0">
      <InquirySocketListener />
      <div className="flex p-0 flex-col items-center bg-white justify-center h-full md:min-h-[85vh] md:h-[90vh] max-h-full overflow-hidden">
        <div className="bg-white p-3 w-full max-w-full flex flex-col md:flex-row items-stretch gap-6 h-full">
          {/* Inquiry List (scrollable) */}
          <div className="flex-1 min-w-[260px] max-w-md border-r border-slate-100 pr-2 h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white pb-2 shadow-b-md pt-2 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                {/* Search Input */}
                <div className="w-full p-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search inquiries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b08b2e] focus:border-transparent"
                    />
                    <div className="flex space-x-3">
                      {searchTerm && (
                        <button
                          onClick={() => setShowAllInquiries(!showAllInquiries)}
                          className={`absolute right-8  top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 rounded ${showAllInquiries ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-gray-700'}`}
                          title={showAllInquiries ? "Show filtered results only" : "Show all results (active and archived)"}
                        >
                          ALL
                        </button>
                      )}
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <Icon icon="mdi:close" width={20} height={20} />
                        </button>
                      )}

                    </div>
                  </div>
                  {searchTerm && showAllInquiries && (
                    <div className="text-xs text-center text-gray-500 mt-1">
                      Showing results across all inquiries
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isInquiriesEditMode && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={toggleSelectAll}
                  className="px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  {selectedInquiries.length === filteredInquiries.length && filteredInquiries.length > 0
                    ? "Deselect All"
                    : "Select All"}
                </button>
                {!isInquiriesArchive && ( // For active inquiries, show archive option
                  <button
                    onClick={() => {
                      if (selectedInquiries.length === 0) {
                        toast.warn("No inquiries selected");
                        return;
                      }
                      setShowArchiveConfirm(true);
                      toast.info(`Archiving ${selectedInquiries.length} inquiry(s)`);
                    }}
                    disabled={selectedInquiries.length === 0}
                    className={`px-3 py-1 text-sm rounded-lg ${selectedInquiries.length === 0 ? 'bg-gray-300' : 'bg-[#b08b2e] hover:bg-[#b08b2e]'} text-white`}
                  >
                    Archive ({selectedInquiries.length})
                  </button>
                )}
                {isInquiriesArchive && ( // For archived inquiries, show delete option
                  <button
                    onClick={() => {
                      if (selectedInquiries.length === 0) {
                        toast.warn("No inquiries selected");
                        return;
                      }
                      setShowDeleteConfirm(true);
                      toast.info(`Deleting ${selectedInquiries.length} inquiry(s)`);
                    }}
                    disabled={selectedInquiries.length === 0}
                    className={`px-3 py-1 text-sm rounded-lg ${selectedInquiries.length === 0 ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Delete ({selectedInquiries.length})
                  </button>
                )}
              </div>
            )}

            {showArchived && (
              <div className="text-xs text-slate-500 mb-4 italic">
                Note: Archived inquiries not deleted within 90 days will be permanently deleted automatically.
              </div>
            )}

            {/* Show edit button for both active and archived inquiries */}
            {/* <button 
              onClick={() => setIsInquiriesEditMode(!isInquiriesEditMode)}
              className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 mb-4"
            >
              {isInquiriesEditMode ? "Cancel" : "Edit"}
            </button> */}

            {loading ? (
              <div>
                <div>
                  <ul className="p-3">
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
              <ul className="p-3">
                {searchTerm && showAllInquiries ? (
                  <>
                    {activeInquiries.length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-gray-500 mb-2 mt-4 px-2">
                          ACTIVE INQUIRIES
                        </div>
                        {activeInquiries.map((inq) => renderInquiryItem(inq))}
                      </>
                    )}
                    {archivedInquiries.length > 0 && (
                      <>
                        <div className="text-sm font-semibold text-gray-500 mb-2 mt-6 px-2">
                          ARCHIVED INQUIRIES
                        </div>
                        {archivedInquiries.map((inq) => renderInquiryItem(inq))}
                      </>
                    )}
                    {activeInquiries.length === 0 && archivedInquiries.length === 0 && (
                      <div className="text-slate-400 py-4 text-center">
                        No inquiries found matching "{searchTerm}"
                      </div>
                    )}
                  </>
                ) : filteredInquiries.length === 0 ? (
                  <div className="text-slate-400 py-4 text-center">
                    {isInquiriesArchive
                      ? "No archived inquiries found."
                      : "No inquiries found."}
                  </div>
                ) : (
                  <ul>
                    {filteredInquiries.map((inq) => renderInquiryItem(inq))}
                  </ul>
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
              <div className="p-4 flex flex-col h-full">
                {selectedInquiry ? (
                  <>
                    <div className="flex items-center justify-between w-full py-2 ">
                      <div><span className="font-semibold">from: </span> {selectedInquiry.firstName} {selectedInquiry.lastName}</div>
                      <div>
                        <div className="">
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                if (selectedInquiry) {
                                  await markAsRead(selectedInquiry);
                                  // Update local state to reflect the change
                                  setSelectedInquiry({ ...selectedInquiry, read: true });
                                  toast.success("Inquiry marked as read");
                                }
                              }}
                              disabled={selectedInquiry?.read}
                              className={`flex-1 p-2 rounded-lg transition flex items-center justify-center gap-1 ${selectedInquiry?.read
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                              {/* {selectedInquiry?.read ? (
                                <>
                                  <Icon icon="solar:letter-opened-broken" width="24" height="24" />
                                  <span className="hidden md:inline">Marked as Read</span>
                                </>
                              ) : (
                                <>
                                  <Icon icon="solar:letter-check-broken" width="24" height="24" />
                                  <span className="hidden md:inline">Mark as Read</span>
                                </>
                              )} */}
                            </button>
                            {!isInquiriesArchive && (
                              <button
                                onClick={() => {
                                  if (selectedInquiry) {
                                    handleArchive(selectedInquiry.id);
                                    setSelectedInquiry(null);
                                    toast.info("Inquiry archived");
                                  }
                                }}
                                className="flex-1 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <Icon icon="solar:archive-broken" width="24" height="24" />
                                <span className="hidden md:inline">Archive</span>
                              </button>
                            )}
                            {isInquiriesArchive && (
                              <button
                                onClick={() => {
                                  if (selectedInquiry) {
                                    handleRestore(selectedInquiry.id);
                                    setSelectedInquiry(null);
                                    toast.success("Inquiry restored");
                                  }
                                }}
                                className="flex-1 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center gap-1"
                              >
                                <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
                                <span className="hidden md:inline">Restore</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <PaperNote className="h-full w-full">
                        <div className="p-6 pl-0 h-full overflow-y-auto">
                          <div className="space-y-3">
                            <div><span className="font-semibold">Date:</span> {formatDateTime(selectedInquiry?.createdAt)}</div>
                            {/* <div><span className="font-semibold">Name:</span> {selectedInquiry.firstName} {selectedInquiry.lastName}</div> */}
                            <div><span className="font-semibold">Email:</span> {selectedInquiry.email}</div>
                            <div><span className="font-semibold">Phone:</span> {selectedInquiry.phone}</div>
                            <div><span className="font-semibold">Country:</span> {selectedInquiry.country}</div>
                            <div><span className="font-semibold">Property:</span> {selectedInquiry.property}</div>
                            <div><span className="font-semibold">Message:</span> {selectedInquiry.message}</div>
                          </div>
                        </div>
                      </PaperNote>
                    </div>

                    {/* Action buttons for mobile preview - properly positioned at the bottom */}
                    {/* <div className="pt-2 mb-10">
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (selectedInquiry) {
                              await markAsRead(selectedInquiry);
                              // Update local state to reflect the change
                              setSelectedInquiry({ ...selectedInquiry, read: true });
                            }
                          }}
                          disabled={selectedInquiry?.read}
                          className={`flex-1 py-2 px-4 rounded-lg transition ${selectedInquiry?.read
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                          {selectedInquiry?.read ? 'Marked as Read' : 'Mark as Read'}
                        </button>
                        {!isInquiriesArchive && (
                          <button
                            onClick={() => {
                              if (selectedInquiry) {
                                handleArchive(selectedInquiry.id);
                                setSelectedInquiry(null);
                              }
                            }}
                            className="flex-1 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                          >
                            Archive
                          </button>
                        )}
                        {isInquiriesArchive && (
                          <button
                            onClick={() => {
                              if (selectedInquiry) {
                                handleRestore(selectedInquiry.id);
                                setSelectedInquiry(null);
                              }
                            }}
                            className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </div> */}
                  </>
                ) : (
                  <div className="text-slate-400 flex items-center justify-center h-full">Select an inquiry to preview details.</div>
                )}
              </div>
            </DragCloseDrawer>
          ) : (
            <div className="flex-1 min-w-[260px] p-4 h-full overflow-hidden hidden md:flex md:flex-col">
              {selectedInquiry ? (
                <PaperNote className="h-[500px] w-full">
                  <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold text-[#b08b2e]">from: {selectedInquiry.firstName} {selectedInquiry.lastName} </h2>
                      {/* <div className="flex gap-2">
                        <button onClick={() => handleEdit(selectedInquiry)} className="text-blue-600 hover:text-blue-800">
                          <Icon icon="mdi:pencil" width={22} height={22} />
                        </button>
                        <button onClick={() => handleDelete(selectedInquiry.id)} className="text-red-600 hover:text-red-800">
                          <Icon icon="mdi:delete" width={22} height={22} />
                        </button>
                      </div> */}
                      <div><span className="font-semibold">Date:</span> {formatDateTime(selectedInquiry.createdAt)}</div>
                    </div>

                    <div className="space-y-3">
                      {/* <div><span className="font-semibold">Name:</span> {selectedInquiry.firstName} {selectedInquiry.lastName}</div> */}
                      <div><span className="font-semibold">Email:</span> {selectedInquiry.email}</div>
                      <div><span className="font-semibold">Phone:</span> {selectedInquiry.phone}</div>
                      <div><span className="font-semibold">Country:</span> {selectedInquiry.country}</div>
                      <div><span className="font-semibold">Property:</span> {selectedInquiry.property}</div>
                      <div><span className="font-semibold">Message:</span> {selectedInquiry.message}</div>
                    </div>
                  </div>
                </PaperNote>
              ) : (
                <div className="text-slate-400">Select an inquiry to preview details.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Archive Confirmation - Modal for desktop, Drawer for mobile */}
      {isMobile ? (
        <DragCloseDrawer
          open={showArchiveConfirm}
          setOpen={setShowArchiveConfirm}
          drawerHeight="30vh"
        >
          <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:archive-broken" width={48} height={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Archive Inquiries</h3>
              <p className="text-slate-600">
                Are you sure you want to archive {selectedInquiries.length} selected inquiry(s)?
                They will be moved to the archived section.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
                className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-medium transition"
              >
                Archive
              </button>
            </div>
          </div>
        </DragCloseDrawer>
      ) : (
        <Modal
          open={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:archive-broken" width={48} height={48} className="text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Archive Inquiries</h3>
              <p className="text-slate-600">
                Are you sure you want to archive {selectedInquiries.length} selected inquiry(s)?
                They will be moved to the archived section.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmArchive}
                className="flex-1 px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-medium transition"
              >
                Archive
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation - Modal for desktop, Drawer for mobile */}
      {isMobile ? (
        <DragCloseDrawer
          open={showDeleteConfirm}
          setOpen={setShowDeleteConfirm}
          drawerHeight="30vh"
        >
          <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:trash-bin-trash-broken" width={48} height={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Inquiries</h3>
              <p className="text-slate-600">
                Are you sure you want to permanently delete {selectedInquiries.length} selected inquiry(s)?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </DragCloseDrawer>
      ) : (
        <Modal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:trash-bin-trash-broken" width={48} height={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Inquiries</h3>
              <p className="text-slate-600">
                Are you sure you want to permanently delete {selectedInquiries.length} selected inquiry(s)?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Single Delete Confirmation - Modal for desktop, Drawer for mobile */}
      {isMobile ? (
        <DragCloseDrawer
          open={showDeleteSingleConfirm}
          setOpen={setShowDeleteSingleConfirm}
          drawerHeight="30vh"
        >
          <div className="p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:trash-bin-trash-broken" width={48} height={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Inquiry</h3>
              <p className="text-slate-600">
                Are you sure you want to permanently delete this inquiry?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setShowDeleteSingleConfirm(false);
                  setInquiryToDelete(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSingleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </DragCloseDrawer>
      ) : (
        <Modal
          open={showDeleteSingleConfirm}
          onClose={() => {
            setShowDeleteSingleConfirm(false);
            setInquiryToDelete(null);
          }}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <Icon icon="solar:trash-bin-trash-broken" width={48} height={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Inquiry</h3>
              <p className="text-slate-600">
                Are you sure you want to permanently delete this inquiry?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  setShowDeleteSingleConfirm(false);
                  setInquiryToDelete(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-slate-700 hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSingleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* End of confirmation modals */}
    </div>
    // End of main container

  );
};

export default Inquiries;
