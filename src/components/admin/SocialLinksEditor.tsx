import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logChange } from "../../utils/changeLogger";
import LoadingIndicator from "./LoadingIndicator";

interface SocialLink {
  label: string;
  url: string;
  icon: string;
  type: 'url' | 'text'; // 'url' for links, 'text' for contact info like Viber, WhatsApp numbers
}

const defaultSocialLinks: SocialLink[] = [
  { label: 'Facebook', url: '', icon: 'streamline-flex:facebook-logo-1-remix', type: 'url' },
  { label: 'Instagram', url: '', icon: 'fa6-brands:instagram', type: 'url' },
  { label: 'Viber', url: '', icon: 'basil:viber-outline', type: 'text' },
  { label: 'WhatsApp', url: '', icon: 'fa6-brands:whatsapp', type: 'text' },
  { label: 'Telegram', url: '', icon: 'gravity-ui:logo-telegram', type: 'text' },
  { label: 'Email', url: '', icon: 'cib:mail-ru', type: 'url' },
];

const SocialLinksEditor: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ label: '', url: '', icon: '', type: 'url' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load social links from Firestore
  useEffect(() => {
    const fetchSocialLinks = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "settings", "socialLinks");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSocialLinks(snap.data().links || defaultSocialLinks);
        } else {
          // Create default document if it doesn't exist
          await setDoc(docRef, { links: defaultSocialLinks });
          setSocialLinks(defaultSocialLinks);
        }
      } catch (err) {
        console.error("Error fetching social links:", err);
        toast.error("Failed to load social links");
        setSocialLinks(defaultSocialLinks);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  // Save social links to Firestore
  const saveSocialLinks = async (links: SocialLink[]) => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "socialLinks");
      await setDoc(docRef, { links });
      setSocialLinks(links);
      await logChange("Social Links", "UPDATE", links);
      toast.success("Social links saved successfully!");
    } catch (err) {
      await logChange("Social Links", "UPDATE_ERROR", { error: (err as Error).message });
      console.error("Error saving social links:", err);
      toast.error("Failed to save social links");
    } finally {
      setSaving(false);
    }
  };

  const handleLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  const addSocialLink = () => {
    if (newSocialLink.label && newSocialLink.icon) {
      const updatedLinks = [...socialLinks, { ...newSocialLink }];
      setSocialLinks(updatedLinks);
      saveSocialLinks(updatedLinks);
      setNewSocialLink({ label: '', url: '', icon: '', type: 'url' });
    } else {
      toast.error("Please provide both label and icon for the social link");
    }
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
    saveSocialLinks(updatedLinks);
  };

  const handleSave = async () => {
    await saveSocialLinks(socialLinks);
  };

  if (loading) {
    return <LoadingIndicator message="Loading social links..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Social Links Management</h2>
        <p className="text-gray-600 mb-6">
          Manage your social links here. Changes made here will be reflected in both the Contact and Footer sections.
          To edit social links from the Contact or Footer editors, please come to this section.
        </p>
        
        {/* Existing social links */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800">Current Social Links</h3>
          {socialLinks.map((social, idx) => (
            <motion.div 
              key={idx} 
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <div className="flex items-center space-x-2">
                <Icon icon={social.icon} className="size-6" />
                <span>{social.label}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={social.type}
                  onChange={(e) => handleLinkChange(idx, 'type', e.target.value as 'url' | 'text')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                >
                  <option value="url">URL</option>
                  <option value="text">Text (Contact Info)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input
                  type="text"
                  value={social.icon}
                  onChange={(e) => handleLinkChange(idx, 'icon', e.target.value)}
                  placeholder="Icon name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {social.type === 'url' ? 'URL' : 'Contact Info'}
                </label>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder={social.type === 'url' ? 'URL' : 'Contact information'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
                  onClick={() => removeSocialLink(idx)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add new social link form */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Social Link</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={newSocialLink.label}
                onChange={(e) => setNewSocialLink({...newSocialLink, label: e.target.value})}
                placeholder="Label (e.g. Facebook)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newSocialLink.type}
                onChange={(e) => setNewSocialLink({...newSocialLink, type: e.target.value as 'url' | 'text'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
              >
                <option value="url">URL</option>
                <option value="text">Text (Contact Info)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                value={newSocialLink.icon}
                onChange={(e) => setNewSocialLink({...newSocialLink, icon: e.target.value})}
                placeholder="Icon (e.g. fa6-brands:facebook)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newSocialLink.type === 'url' ? 'URL' : 'Contact Info'}
              </label>
              <input
                type="text"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                placeholder={newSocialLink.type === 'url' ? 'URL' : 'Contact information'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="bg-[#b08b2e] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#a07a1e]"
              onClick={addSocialLink}
            >
              Add Social Link
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-8">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#b08b2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a07a1e] transition disabled:opacity-50 flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Social Links"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksEditor;