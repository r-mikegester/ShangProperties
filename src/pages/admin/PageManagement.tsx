import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import HeroEditor from "../../components/admin/HeroEditor";
import ContactEditor from "../../components/admin/ContactEditor";
import FooterEditor from "../../components/admin/FooterEditor";
import SocialLinksEditor from "../../components/admin/SocialLinksEditor";
import LoadingIndicator from "../../components/admin/LoadingIndicator";
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
    headline: string;
    subheading: string;
    socialMediaHeading: string;
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
    headline: "",
    subheading: "",
    socialMediaHeading: "",
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
  const [activeTab, setActiveTab] = useState<"hero" | "contact" | "footer" | "social">("hero");
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
      handleSaveAll();
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

  // Deep equality function for comparing objects
  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    
    if (obj1 == null || obj2 == null) return false;
    
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!deepEqual(obj1[key], obj2[key])) return false;
    }
    
    return true;
  };

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
      return true;
    } catch (err: any) {
      console.error(`Error saving ${section} section:`, err);
      return false;
    }
  };

  const handleSaveAll = async () => {
    // Compare current edited content with original content to find what has changed
    const sectionsToSave: (keyof HomepageContent)[] = [];
    
    if (!deepEqual(content.hero, editedContent.hero)) {
      sectionsToSave.push('hero');
    }
    
    if (!deepEqual(content.contact, editedContent.contact)) {
      sectionsToSave.push('contact');
    }
    
    if (!deepEqual(content.footer, editedContent.footer)) {
      sectionsToSave.push('footer');
    }
    
    // If no changes detected
    if (sectionsToSave.length === 0) {
      toast.info("No changes to save");
      return;
    }
    
    let successfulSaves = 0;
    
    for (const section of sectionsToSave) {
      const success = await handleSaveSection(section, editedContent[section]);
      if (success) {
        successfulSaves++;
      }
    }
    
    if (successfulSaves > 0) {
      const sectionNames = sectionsToSave
        .map(section => {
          switch (section) {
            case 'hero': return 'Hero';
            case 'contact': return 'Contact';
            case 'footer': return 'Footer';
            default: return section;
          }
        })
        .join(', ');
      
      toast.success(`Successfully saved changes to: ${sectionNames}`);
    } else {
      toast.error("Failed to save changes");
    }
  };

  const handleEditorChange = useCallback((section: keyof HomepageContent, data: HomepageContent[keyof HomepageContent]) => {
    setEditedContent(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading homepage content..." />;
  }

  return (
    <div className=" h-full overflow-y-auto">
      <div className="mb-6 sticky top-0 bg-slate-50 z-40">
        <div className="border-b border-gray-200">
          <nav className="flex justify-center md:justify-start space-x-8 md:mx-3">
            <button
              onClick={() => setActiveTab("hero")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hero"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Hero
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "contact"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab("footer")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "footer"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Footer
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "social"
                  ? "border-[#b08b2e] text-[#b08b2e]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Social Links
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "hero" && (
        <div className="p-3">
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
        <div className="p-3">
          <div className="pb-20">
            <ContactEditor
              initialData={editedContent.contact}
              onSave={(data) => {
                handleEditorChange("contact", data);
                return Promise.resolve();
              }}
              isEditing={isPageEditing}
            />
          </div>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="p-3">
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

      {activeTab === "social" && (
        <div className="p-3">
          <div className="pb-20">
            <SocialLinksEditor />
          </div>
        </div>
      )}

    </div>
  );
};

export default PageManagement;