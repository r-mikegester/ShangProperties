import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ContactContent {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  viber: string;
  whatsapp: string;
  telegram: string;
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
}

const ContactEditor: React.FC<SectionEditorProps<ContactContent>> = ({ initialData, onSave }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success("Contact section saved successfully!");
    } catch (error) {
      toast.error("Failed to save contact section: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Responsive Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-lg mb-3 text-[#b08b2e]">Live Preview</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="mt-2 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span> {data.address || "123 Example Street, City, Country"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {data.phone || "+1 (555) 123-4567"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {data.email || "info@example.com"}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connect With Us</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {data.facebook && (
                  <a href={data.facebook} className="text-blue-600 hover:underline">Facebook</a>
                )}
                {data.instagram && (
                  <a href={data.instagram} className="text-blue-600 hover:underline">Instagram</a>
                )}
                {data.viber && (
                  <a href={data.viber} className="text-blue-600 hover:underline">Viber</a>
                )}
                {data.whatsapp && (
                  <a href={data.whatsapp} className="text-blue-600 hover:underline">WhatsApp</a>
                )}
                {data.telegram && (
                  <a href={data.telegram} className="text-blue-600 hover:underline">Telegram</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={data.address}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
            placeholder="Company address..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="+1234567890"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="contact@example.com"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Facebook URL</label>
            <input
              type="text"
              name="facebook"
              value={data.facebook}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="https://facebook.com/..."
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Instagram URL</label>
            <input
              type="text"
              name="instagram"
              value={data.instagram}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="https://instagram.com/..."
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Viber Link</label>
            <input
              type="text"
              name="viber"
              value={data.viber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="Viber link or number"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">WhatsApp Link</label>
            <input
              type="text"
              name="whatsapp"
              value={data.whatsapp}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="WhatsApp link or number"
            />
          </div>
          
          <div>
            <label className="block font-medium mb-1">Telegram Link</label>
            <input
              type="text"
              name="telegram"
              value={data.telegram}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
              placeholder="Telegram link or number"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#b08b2e] text-white px-4 py-2 rounded font-medium hover:bg-[#a07a1e] transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Contact Section"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactEditor;