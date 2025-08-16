import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface FooterContent {
  logoUrl: string;
  address: string;
  copyright: string;
  termsUrl: string;
  privacyUrl: string;
  facebook: string;
  instagram: string;
  viber: string;
  whatsapp: string;
  telegram: string;
  email: string;
  links: { label: string; url: string }[];
}

const FooterEditor: React.FC = () => {
  const [footer, setFooter] = useState<FooterContent>({
    logoUrl: "",
    address: "",
    copyright: "",
    termsUrl: "",
    privacyUrl: "",
    facebook: "",
    instagram: "",
    viber: "",
    whatsapp: "",
    telegram: "",
    email: "",
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "homepage_content", "footer");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFooter(snap.data() as FooterContent);
        }
      } catch (err: any) {
        setError("Failed to load footer content");
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFooter({ ...footer, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (idx: number, field: "label" | "url", value: string) => {
    setFooter((prev) => {
      const links = [...prev.links];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, links };
    });
  };

  const addLink = () => {
    setFooter((prev) => ({ ...prev, links: [...prev.links, { label: "", url: "" }] }));
  };

  const removeLink = (idx: number) => {
    setFooter((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const docRef = doc(db, "homepage_content", "footer");
      await setDoc(docRef, footer, { merge: true });
      setSuccess(true);
    } catch (err: any) {
      setError("Failed to save footer content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block font-semibold mb-1">Footer Logo URL</label>
            <input
              type="text"
              name="logoUrl"
              value={footer.logoUrl}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="Logo URL"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              name="address"
              value={footer.address}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 min-h-[60px]"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Copyright</label>
            <input
              type="text"
              name="copyright"
              value={footer.copyright}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="Copyright text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Terms URL</label>
              <input
                type="text"
                name="termsUrl"
                value={footer.termsUrl}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Terms URL"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Privacy URL</label>
              <input
                type="text"
                name="privacyUrl"
                value={footer.privacyUrl}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Privacy URL"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={footer.facebook}
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
                value={footer.instagram}
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
                value={footer.viber}
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
                value={footer.whatsapp}
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
                value={footer.telegram}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Telegram Link or Number"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={footer.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                placeholder="Email"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Footer Links</label>
            {footer.links.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={e => handleLinkChange(idx, "label", e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={e => handleLinkChange(idx, "url", e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="URL"
                />
                <button type="button" className="text-red-500 px-2" onClick={() => removeLink(idx)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" onClick={addLink}>
              Add Link
            </button>
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
      )}
    </div>
  );
};

export default FooterEditor;
