import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

const ContactEditor: React.FC = () => {
  const [contact, setContact] = useState<ContactContent>({
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    viber: "",
    whatsapp: "",
    telegram: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "homepage_content", "contact");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setContact(snap.data() as ContactContent);
        }
      } catch (err: any) {
        setError("Failed to load contact content");
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "homepage_content", "contact");
      await setDoc(docRef, contact, { merge: true });
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to save contact content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Live Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
            <div className="mb-2 font-bold text-lg text-[#b08b2e]">Live Preview</div>
            <div className="mb-2"><span className="font-semibold">Address:</span> {contact.address}</div>
            <div className="mb-2"><span className="font-semibold">Phone:</span> {contact.phone}</div>
            <div className="mb-2"><span className="font-semibold">Email:</span> {contact.email}</div>
            <div className="mb-2"><span className="font-semibold">Facebook:</span> {contact.facebook}</div>
            <div className="mb-2"><span className="font-semibold">Instagram:</span> {contact.instagram}</div>
            <div className="mb-2"><span className="font-semibold">Viber:</span> {contact.viber}</div>
            <div className="mb-2"><span className="font-semibold">WhatsApp:</span> {contact.whatsapp}</div>
            <div className="mb-2"><span className="font-semibold">Telegram:</span> {contact.telegram}</div>
          </div>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={contact.address}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 min-h-[60px]"
                placeholder="Address"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={contact.phone}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Email"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={contact.facebook}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Facebook URL"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={contact.instagram}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Instagram URL"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Viber</label>
                <input
                  type="text"
                  name="viber"
                  value={contact.viber}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Viber Link or Number"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={contact.whatsapp}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="WhatsApp Link or Number"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={contact.telegram}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                  placeholder="Telegram Link or Number"
                />
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">Saved!</div>}
            <button
              type="submit"
              className="bg-[#b08b2e] text-white px-4 py-2 rounded font-semibold hover:bg-[#a07a1e] transition"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactEditor;
