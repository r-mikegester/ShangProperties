import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import HeroEditor from "../../components/admin/HeroEditor";
import ContactEditor from "../../components/admin/ContactEditor";
import FooterEditor from "../../components/admin/FooterEditor";

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
    socialLinks: [],
    enabled: true,
  },
};

const Homepage: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>(initialContent);
  const [activeTab, setActiveTab] = useState<"hero" | "contact" | "footer">("hero");
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const fetchHomepage = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "homepage", "content");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setContent(snap.data() as HomepageContent);
        }
      } catch (err: any) {
        toast.error("Failed to load homepage content");
        console.error("Error fetching homepage content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepage();
  }, []);

  const handleSave = async (section: keyof HomepageContent, data: HomepageContent[keyof HomepageContent]) => {
    try {
      const updatedHomepage = {
        ...content,
        [section]: data,
      };
      
      const docRef = doc(db, "homepage", "content");
      await setDoc(docRef, updatedHomepage, { merge: true });
      
      setContent(updatedHomepage);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully!`);
    } catch (err: any) {
      toast.error(`Failed to save ${section} section`);
      console.error(`Error saving ${section} section:`, err);
    }
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
        <h1 className="text-2xl font-bold text-[#b08b2e]">Homepage Management</h1>
        <p className="text-gray-600">Manage the content of your homepage sections</p>
      </div>

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
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <HeroEditor
            initialData={content.hero}
            onSave={(data) => handleSave("hero", data)}
          />
        </div>
      )}

      {activeTab === "contact" && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <ContactEditor
            initialData={content.contact}
            onSave={(data) => handleSave("contact", data)}
          />
        </div>
      )}

      {activeTab === "footer" && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <FooterEditor
            initialData={content.footer}
            onSave={(data) => handleSave("footer", data)}
          />
        </div>
      )}

      {/* Page Preview Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Full Page Preview</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 text-sm rounded ${previewMode === 'desktop' ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Desktop
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 text-sm rounded ${previewMode === 'mobile' ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Mobile
            </button>
          </div>
        </div>
        
        <div className={`overflow-auto ${previewMode === 'mobile' ? 'max-w-xs mx-auto border rounded-lg' : ''}`}>
          <div className="min-h-screen bg-white">
            {/* Hero Section Preview */}
            <div className="relative min-h-[50vh] bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">Hero Section</h2>
                <p className="text-gray-500 mt-2">Background: {content.hero.backgroundUrl || "Default"}</p>
                <p className="text-gray-500 mt-1">Headline: {content.hero.headline || "Default headline"}</p>
              </div>
            </div>

            {/* Contact Section Preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 my-6 mx-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Inquiry Form</h3>
                <p className="text-gray-500 mt-2">{content.contact.subheading || "Contact information will appear here"}</p>
                
                <div className="mt-4 text-left max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {content.contact.address || "Not set"}</p>
                    <p><span className="font-medium">Phone:</span> {content.contact.phone || "Not set"}</p>
                    <p><span className="font-medium">Email:</span> {content.contact.email || "Not set"}</p>
                    
                    <div className="mt-3">
                      <p className="font-medium">{content.contact.socialMediaHeading || "Social Links"}:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {content.contact.facebook && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Facebook</span>}
                        {content.contact.instagram && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Instagram</span>}
                        {content.contact.viber && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Viber</span>}
                        {content.contact.whatsapp && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">WhatsApp</span>}
                        {content.contact.telegram && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Telegram</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section Preview */}
            <div className="bg-gray-800 text-white p-6 mt-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Footer Content</h3>
                    <p className="text-gray-300 text-sm">
                      {content.footer.address || "Address not set"}
                    </p>
                    
                    {content.footer.logoUrl && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-xs">Logo:</p>
                        <img src={content.footer.logoUrl} alt="Footer logo" className="h-10 mt-1" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Links</h3>
                    <div className="space-y-1">
                      {content.footer.links.map((link, idx) => (
                        <p key={idx} className="text-gray-300 text-sm">{link.label}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Legal & Social</h3>
                    <div className="space-y-2">
                      {/* Copyright */}
                      <p className="text-gray-300 text-sm">© {content.footer.copyright || new Date().getFullYear()}</p>
                      
                      {/* Terms and Privacy Links */}
                      <div className="flex flex-wrap gap-3">
                        {content.footer.termsUrl && (
                          <a href={content.footer.termsUrl} className="text-gray-300 text-sm hover:text-[#b08b2e]">
                            Terms of Service
                          </a>
                        )}
                        {content.footer.privacyUrl && (
                          <a href={content.footer.privacyUrl} className="text-gray-300 text-sm hover:text-[#b08b2e]">
                            Privacy Policy
                          </a>
                        )}
                      </div>
                      
                      {/* Email */}
                      {content.footer.email && (
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium">Email:</span> {content.footer.email}
                        </p>
                      )}
                      
                      {/* Social Links */}
                      <div className="flex flex-wrap gap-2">
                        {content.footer.socialLinks.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.url}
                            className="flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded hover:bg-[#b08b2e] hover:text-white transition-colors"
                          >
                            {/* In a real implementation, the icon would be rendered here */}
                            <span>{link.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Footer Elements */}
                <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
                  <div className="flex flex-col items-center space-y-3">
                    {/* Logo */}
                    {content.footer.logoUrl && (
                      <img src={content.footer.logoUrl} alt="Footer logo" className="h-10" />
                    )}
                    
                    {/* Kuok Group Logo and COR Seal */}
                    <div className="flex gap-4">
                      {content.footer.kuokGroupLogoUrl && (
                        <img src={content.footer.kuokGroupLogoUrl} alt="Kuok Group logo" className="h-8" />
                      )}
                      {content.footer.corSealUrl && (
                        <img src={content.footer.corSealUrl} alt="COR Seal" className="h-8" />
                      )}
                    </div>
                    
                    {/* Address */}
                    {content.footer.address && (
                      <p className="text-gray-400 text-sm mt-2">{content.footer.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
