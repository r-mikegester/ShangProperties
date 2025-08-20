import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import HeroEditor from "../../components/admin/HeroEditor";
import ContactEditor from "../../components/admin/ContactEditor";
import FooterEditor from "../../components/admin/FooterEditor";
import { useOutletContext } from "react-router-dom";

interface HomepageContent {
  // Hero section
  hero: {
    backgroundUrl: string;
    headline: string;
    paragraph: string;
  };
  // Contact section
  contact: {
    address: string;
    phone: string;
    email: string;
    facebook: string;
    instagram: string;
    viber: string;
    whatsapp: string;
    telegram: string;
  };
  // Footer section
  footer: {
    logoUrl: string;
    kuokGroupLogoUrl: string;
    corSealUrl: string;
    address: string;
    copyright: string;
    termsUrl: string;
    privacyUrl: string;
    email: string;
    links: { label: string; url: string }[];
    socialLinks: { label: string; url: string; icon: string }[];
    enabled: boolean;
  };
}

const initialContent: HomepageContent = {
  hero: {
    backgroundUrl: "",
    headline: "",
    paragraph: "",
  },
  contact: {
    address: "",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    viber: "",
    whatsapp: "",
    telegram: "",
  },
  footer: {
    logoUrl: "",
    kuokGroupLogoUrl: "",
    corSealUrl: "",
    address: "",
    copyright: "",
    termsUrl: "",
    privacyUrl: "",
    email: "",
    links: [],
    socialLinks: [
      { label: 'Facebook', url: '', icon: 'streamline-flex:facebook-logo-1-remix' },
      { label: 'Instagram', url: '', icon: 'fa6-brands:instagram' },
      { label: 'Viber', url: '', icon: 'basil:viber-outline' },
      { label: 'WhatsApp', url: '', icon: 'fa6-brands:whatsapp' },
      { label: 'Telegram', url: '', icon: 'gravity-ui:logo-telegram' },
      { label: 'Email', url: '', icon: 'cib:mail-ru' },
    ],
    enabled: true,
  },
};

const PageManagement: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>(initialContent);
  const [activeTab, setActiveTab] = useState<"hero" | "contact" | "footer">("hero");
  const [loading, setLoading] = useState(true);
  const [editedContent, setEditedContent] = useState<HomepageContent>(initialContent);

  // Get the editing state from the outlet context
  const { isPageEditing } = useOutletContext<{ isPageEditing: boolean }>();

  const fetchHomepage = useCallback(async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "homepage", "content");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as HomepageContent;
        setContent(data);
        setEditedContent(data);
      }
    } catch (err: any) {
      toast.error("Failed to load homepage content");
      console.error("Error fetching homepage content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepage();
  }, [fetchHomepage]);

  // Listen for custom events from NavBar
  useEffect(() => {
    const handleSave = () => {
      // Save all sections
      handleSaveSection("hero", editedContent.hero);
      handleSaveSection("contact", editedContent.contact);
      handleSaveSection("footer", editedContent.footer);
    };

    const handleCancel = () => {
      // Reset to original content
      setEditedContent(content);
    };

    const handleRefresh = () => {
      // Reload content from database
      fetchHomepage();
    };

    window.addEventListener('pageSaveRequested', handleSave);
    window.addEventListener('pageCancelRequested', handleCancel);
    window.addEventListener('pageRefreshRequested', handleRefresh);

    return () => {
      window.removeEventListener('pageSaveRequested', handleSave);
      window.removeEventListener('pageCancelRequested', handleCancel);
      window.removeEventListener('pageRefreshRequested', handleRefresh);
    };
  }, [content, editedContent, fetchHomepage]);

  const handleSaveSection = async (section: keyof HomepageContent, data: HomepageContent[keyof HomepageContent]) => {
    try {
      const updatedHomepage = {
        ...editedContent,
        [section]: data,
      };
      
      const docRef = doc(db, "homepage", "content");
      await setDoc(docRef, updatedHomepage, { merge: true });
      
      setEditedContent(updatedHomepage);
      setContent(updatedHomepage);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully!`);
    } catch (err: any) {
      toast.error(`Failed to save ${section} section`);
      console.error(`Error saving ${section} section:`, err);
    }
  };

  const handleEditorChange = (section: keyof HomepageContent, data: HomepageContent[keyof HomepageContent]) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: data
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Loading homepage content...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("hero")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hero"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Hero Section
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "contact"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Contact Section
            </button>
            <button
              onClick={() => setActiveTab("footer")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "footer"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Footer Section
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="pb-20">
            <HeroEditor
              initialData={editedContent.hero}
              onSave={(data) => {
                handleEditorChange("hero", data);
                return Promise.resolve();
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="pb-20">
            <ContactEditor
              initialData={editedContent.contact}
              onSave={(data) => {
                handleEditorChange("contact", data);
                return Promise.resolve();
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="space-y-6">
          <div className="pb-20">
            <FooterEditor
              initialData={editedContent.footer}
              onSave={(data) => {
                handleEditorChange("footer", data);
                return Promise.resolve();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PageManagement;