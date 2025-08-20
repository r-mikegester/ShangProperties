import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { put } from '@vercel/blob';

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
    enabled: boolean;
  };
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
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
    enabled: true,
  },
};

const HeroEditor: React.FC<SectionEditorProps<HomepageContent["hero"]>> = ({ initialData, onSave }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setData({
      ...initialData,
      backgroundUrl: initialData.backgroundUrl || "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/"
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Upload image to Vercel Blob and return URL
  const uploadToVercelBlob = useCallback(async (file: File): Promise<string> => {
    console.log("Starting upload for file:", file.name, file.type, file.size);
    
    // Check if we have the required token
    const blobToken = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    console.log("Blob token:", blobToken ? "Available" : "Missing");
    
    if (!blobToken) {
      const error = new Error("Vercel Blob token is not configured. Please set VITE_BLOB_READ_WRITE_TOKEN in your environment variables.");
      toast.error(error.message);
      throw error;
    }

    try {
      console.log("Using Vercel Blob client to upload file...");
      
      // Use the official Vercel Blob client
      const blob = await put(file.name, file, {
        access: 'public',
        token: blobToken,
      });
      
      console.log("Upload successful, URL:", blob.url);
      return blob.url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + (error as Error).message);
      throw error;
    }
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.info(`Uploading ${file.name}...`, {
      progress: 0,
      autoClose: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    });

    try {
      const url = await uploadToVercelBlob(file);

      toast.update(toastId, {
        render: "Upload complete!",
        type: "success",
        autoClose: 2000,
        progress: undefined,
      });

      setData(prev => ({ ...prev, backgroundUrl: url }));
    } catch (error) {
      toast.update(toastId, {
        render: `Upload failed: ${(error as Error).message}`,
        type: "error",
        autoClose: 5000,
        progress: undefined,
      });
    }
    
    // Reset file input
    e.target.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success("Hero section saved successfully!");
    } catch (error) {
      toast.error("Failed to save hero section: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-[#b08b2e]">Live Preview</h3>
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
        
        <div className={`overflow-auto ${previewMode === 'mobile' ? 'max-w-xs mx-auto' : ''}`}>
          {/* Hero Section Preview - More accurate representation */}
          <div className="relative min-h-[300px] w-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${data.backgroundUrl || 'https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/'})` }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-70" />
            <div className="relative z-10 flex flex-col items-center md:items-start justify-end w-full h-full p-6 md:p-10">
              <h1 
                className="text-2xl md:text-4xl font-bold text-[#f4e3c1] drop-shadow-lg castoro-titling-regular text-center md:text-left leading-tight"
                dangerouslySetInnerHTML={{ 
                  __html: data.headline || "Curating Spaces <br className=\"hidden xs:block\" /> as Fine As You." 
                }}
              />
              <p className="mt-3 text-sm md:text-base max-w-2xl text-center md:text-left text-[#c2b498]">
                {data.paragraph || "Shang Properties, Inc. (SPI) has been involved in property investment and development in the Philippines since 1987 and was listed on the Philippine Stock Exchange (PSE) in 1991."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Background Image</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#b08b2e] file:text-white hover:file:bg-[#a07a1e]"
            />
            {uploadProgress !== null && (
              <div className="text-sm text-gray-500">{uploadProgress}%</div>
            )}
          </div>
          {data.backgroundUrl && (
            <div className="mt-2">
              <img 
                src={data.backgroundUrl} 
                alt="Preview" 
                className="h-24 w-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setData(prev => ({ ...prev, backgroundUrl: "" }))}
                className="mt-1 text-sm text-red-500 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        
        <div>
          <label className="block font-medium mb-1">Background Image URL</label>
          <input
            type="text"
            name="backgroundUrl"
            value={data.backgroundUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">You can either upload an image or enter a URL directly</p>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Headline (H1) - Supports HTML</label>
          <textarea
            name="headline"
            value={data.headline}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
            placeholder="Hero Headline"
          />
          <p className="text-xs text-gray-500 mt-1">Supports HTML tags like &lt;br&gt; for line breaks</p>
        </div>
        
        <div>
          <label className="block font-medium mb-1">Paragraph</label>
          <textarea
            name="paragraph"
            value={data.paragraph}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
            placeholder="Hero paragraph text..."
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#b08b2e] text-white px-4 py-2 rounded font-medium hover:bg-[#a07a1e] transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Hero Section"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ContactEditor: React.FC<SectionEditorProps<HomepageContent["contact"]>> = ({ initialData, onSave }) => {
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
      {/* Live Preview */}
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

const FooterEditor: React.FC<SectionEditorProps<HomepageContent["footer"]>> = ({ initialData, onSave }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (idx: number, field: "label" | "url", value: string) => {
    setData(prev => {
      const links = [...prev.links];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, links };
    });
  };

  const addLink = () => {
    setData(prev => ({ ...prev, links: [...prev.links, { label: "", url: "" }] }));
  };

  const removeLink = (idx: number) => {
    setData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success("Footer section saved successfully!");
    } catch (error) {
      toast.error("Failed to save footer section: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-[#b08b2e]">Live Preview</h3>
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
        
        <div className={`overflow-auto ${previewMode === 'mobile' ? 'max-w-xs mx-auto' : ''}`}>
          {/* Exact copy of Footer.tsx with dynamic data */}
          <footer className="w-full bg-[#686058] text-white">
            <div className={`container px-4 py-8 ${previewMode === 'mobile' ? 'pt-10' : 'sm:p-6 pt-10'} mx-auto`}>
              <div className={`flex flex-col ${previewMode === 'mobile' ? '' : 'lg:flex-row'} items-start justify-center gap-10 text-center ${previewMode === 'mobile' ? '' : 'lg:text-left'}`}>
                <div className={`flex flex-col items-center w-full ${previewMode === 'mobile' ? '' : 'lg:w-1/5'} px-2 ${previewMode === 'mobile' ? '' : 'sm:px-6'} mb-8 ${previewMode === 'mobile' ? '' : 'lg:mb-0'}`}>
                  <a className="flex flex-col items-center text-xs space-y-3 text-white focus:outline-hidden focus:opacity-80" href="#" aria-label="Brand">
                    {data.logoUrl ? (
                      <img src={data.logoUrl} className={`${previewMode === 'mobile' ? 'w-32' : 'w-32 sm:w-40'} mx-auto`} alt="Footer Logo" />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12 flex items-center justify-center text-gray-500">
                        Logo
                      </div>
                    )}
                    <pre className="text-center whitespace-pre-wrap text-white">
                      {data.address || `Shangri-La Plaza, Shang Central,
EDSA corner Shaw Boulevard,
Mandaluyong City,
Metro Manila 1550,
Philippines`}
                    </pre>
                  </a>
                  <div className="mt-3 flex flex-col items-center">
                    {/* Kuok Group Logo Placeholder */}
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-12 mb-2" />
                    <span className="text-xs text-gray-300">Kuok Group Logo</span>
                  </div>
                </div>
                <div className={`flex flex-col ${previewMode === 'mobile' ? 'md:flex-row' : 'md:flex-row'} items-start justify-around w-full ${previewMode === 'mobile' ? '' : 'lg:w-4/5'} gap-8`}>
                  <div className="flex flex-col max-w-96 w-full text-center items-center">
                    <h3 className="text-white uppercase font-semibold">New Developments</h3>
                    {data.links && data.links.length > 0 ? (
                      data.links.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.url} 
                          className="block mt-2 text-sm text-white hover:underline"
                        >
                          {link.label}
                        </a>
                      ))
                    ) : (
                      <>
                        <a href="/ShangSummit" className="block mt-2 text-sm text-white hover:underline">Shang Summit</a>
                        <a href="/Haraya" className="block mt-2 text-sm text-white hover:underline">Haraya Residences</a>
                        <a href="/Aurelia" className="block mt-2 text-sm text-white hover:underline">Aurelia Residences</a>
                        <a href="/Laya" className="block mt-2 text-sm text-white hover:underline">Laya Residences</a>
                        <a href="/WackWack" className="block mt-2 text-sm text-white hover:underline">Shang Residences at Wack Wack</a>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center w-full">
                    <h3 className="text-white text-center uppercase font-semibold">Connect with me</h3>
                    <div className={`mt-3 ${previewMode === 'mobile' ? 'xs:w-40' : ''} w-full ${previewMode === 'mobile' ? '' : 'md:max-w-lg'} grid ${previewMode === 'mobile' ? 'grid-cols-3' : 'grid-cols-6 px-6 md:grid-cols-2'} gap-4 justify-center items-center`}>
                      {data.facebook && (
                        <a href={data.facebook} className="flex justify-center md:justify-start items-center text-white hover:text-[#b08b2e] space-x-0 md:space-x-3 focus:outline-hidden focus:text-[#b08b2e]">
                          <svg className="size-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                          <h1 className="hidden md:flex">Facebook</h1>
                        </a>
                      )}
                      {data.instagram && (
                        <a href={data.instagram} className="flex justify-center md:justify-start items-center text-white hover:text-[#b08b2e] space-x-0 md:space-x-3 focus:outline-hidden focus:text-[#b08b2e]">
                          <svg className="size-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                          <h1 className="hidden md:flex">Instagram</h1>
import React, { useEffect, useState } from "react";
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
  };
  // Footer section
  footer: {
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
                <p className="text-gray-500 mt-2">Contact information will appear here</p>
                
                <div className="mt-4 text-left max-w-2xl mx-auto">
                  <div className="space-y-2">
                    <p><span className="font-medium">Address:</span> {content.contact.address || "Not set"}</p>
                    <p><span className="font-medium">Phone:</span> {content.contact.phone || "Not set"}</p>
                    <p><span className="font-medium">Email:</span> {content.contact.email || "Not set"}</p>
                    
                    <div className="mt-3">
                      <p className="font-medium">Social Links:</p>
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
                      <p className="text-gray-300 text-sm">© {content.footer.copyright || new Date().getFullYear()}</p>
                      <div className="flex flex-wrap gap-2">
                        {content.footer.facebook && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">FB</span>}
                        {content.footer.instagram && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">IG</span>}
                        {content.footer.viber && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">VB</span>}
                        {content.footer.whatsapp && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">WA</span>}
                        {content.footer.telegram && <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">TG</span>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
                  <p>Additional footer elements would appear here (Kuok Group logo, COR seal, etc.)</p>
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

export default Homepage;