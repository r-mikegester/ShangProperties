import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/inquiry";

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
}

function formatDateTime(ts: FirestoreTimestamp | string | null | undefined): string {
  if (!ts) return "-";
  try {
    if (typeof ts === 'object' && ts !== null && 'seconds' in ts) {
      const date = new Date((ts as FirestoreTimestamp).seconds * 1000);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    } else if (typeof ts === 'string') {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    }
  } catch {
    return "-";
  }
  return "-";
}

const Inquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Inquiry>>({});

  // Fetch all inquiries
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setInquiries(res.data.inquiries || []);
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
      await axios.delete(`${API_URL}/${id}`);
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
      await axios.put(`${API_URL}/${editingId}`, editForm);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-3 w-full max-w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 castoro-titling-regular text-[#b08b2e]">Inquiries</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border">Date/Time</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Country</th>
                  <th className="px-4 py-2 border">Property</th>
                  <th className="px-4 py-2 border">Message</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-4">No inquiries found.</td></tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="border-t">
                      {editingId === inq.id ? (
                        <>
                          <td className="border px-2 py-1">-</td>
                          <td className="border px-2 py-1"><input name="firstName" value={editForm.firstName || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1"><input name="email" value={editForm.email || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1"><input name="phone" value={editForm.phone || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1"><input name="country" value={editForm.country || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1"><input name="property" value={editForm.property || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1"><input name="message" value={editForm.message || ''} onChange={handleEditFormChange} className="border rounded p-1 w-full" /></td>
                          <td className="border px-2 py-1 flex gap-2">
                            <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-800"><Icon icon="mdi:content-save" width={22} height={22} /></button>
                            <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700"><Icon icon="mdi:cancel" width={22} height={22} /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border px-2 py-1">{formatDateTime(inq.createdAt)}</td>
                          <td className="border px-2 py-1">{inq.firstName} {inq.lastName}</td>
                          <td className="border px-2 py-1">{inq.email}</td>
                          <td className="border px-2 py-1">{inq.phone}</td>
                          <td className="border px-2 py-1">{inq.country}</td>
                          <td className="border px-2 py-1">{inq.property}</td>
                          <td className="border px-2 py-1">{inq.message}</td>
                          <td className="border px-2 py-1 flex gap-2">
                            <button onClick={() => handleEdit(inq)} className="text-blue-600 hover:text-blue-800"><Icon icon="mdi:pencil" width={22} height={22} /></button>
                            <button onClick={() => handleDelete(inq.id)} className="text-red-600 hover:text-red-800"><Icon icon="mdi:delete" width={22} height={22} /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquiries;
