import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { put } from '@vercel/blob';
import { Icon } from "@iconify/react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface FooterContent {
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
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
  isEditing?: boolean;
}

const FooterEditor: React.FC<SectionEditorProps<FooterContent>> = ({ initialData, onSave, isEditing }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [logoFilename, setLogoFilename] = useState<string>("");
  const [kuokGroupLogoFilename, setKuokGroupLogoFilename] = useState<string>("");
  const [corSealFilename, setCorSealFilename] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  // Add state for new social link
  const [newSocialLink, setNewSocialLink] = useState({ label: '', url: '', icon: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Get the editing state from the outlet context
  const { isPageEditing } = useOutletContext<{ isPageEditing: boolean }>();
  const effectiveIsEditing = isEditing !== undefined ? isEditing : isPageEditing;

  // Default base URL for images
  const DEFAULT_BASE_URL = "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/";

  useEffect(() => {
    // Initialize socialLinks if not present
    if (!initialData.socialLinks || initialData.socialLinks.length === 0) {
      setData({
        ...initialData,
        socialLinks: [
          { label: 'Facebook', url: '', icon: 'streamline-flex:facebook-logo-1-remix' },
          { label: 'Instagram', url: '', icon: 'fa6-brands:instagram' },
          { label: 'Viber', url: '', icon: 'basil:viber-outline' },
          { label: 'WhatsApp', url: '', icon: 'fa6-brands:whatsapp' },
          { label: 'Telegram', url: '', icon: 'gravity-ui:logo-telegram' },
          { label: 'Email', url: '', icon: 'cib:mail-ru' },
        ]
      });
    } else {
      setData(initialData);
    }

    // Extract filename from the full URL if it exists for main logo
    if (initialData.logoUrl) {
      try {
        const url = new URL(initialData.logoUrl);
        const pathParts = url.pathname.split('/');
        if (pathParts.length > 0) {
          setLogoFilename(pathParts[pathParts.length - 1]);
        }
      } catch (e) {
        // If it's not a valid URL, treat it as a filename
        setLogoFilename(initialData.logoUrl);
      }
    }

    // Extract filename for Kuok Group logo
    if (initialData.kuokGroupLogoUrl) {
      try {
        const url = new URL(initialData.kuokGroupLogoUrl);
        const pathParts = url.pathname.split('/');
        if (pathParts.length > 0) {
          setKuokGroupLogoFilename(pathParts[pathParts.length - 1]);
        }
      } catch (e) {
        setKuokGroupLogoFilename(initialData.kuokGroupLogoUrl);
      }
    }

    // Extract filename for COR seal
    if (initialData.corSealUrl) {
      try {
        const url = new URL(initialData.corSealUrl);
        const pathParts = url.pathname.split('/');
        if (pathParts.length > 0) {
          setCorSealFilename(pathParts[pathParts.length - 1]);
        }
      } catch (e) {
        setCorSealFilename(initialData.corSealUrl);
      }
    }
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

  const handleSocialLinkChange = (index: number, field: keyof { label: string; url: string; icon: string }, value: string) => {
    setData(prev => {
      const socialLinks = [...prev.socialLinks];
      socialLinks[index] = { ...socialLinks[index], [field]: value };
      return { ...prev, socialLinks };
    });
  };

  // Handle logo filename change
  const handleLogoFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLogoFilename(value);
    setData(prev => ({ ...prev, logoUrl: value }));
  };

  // Handle Kuok Group logo filename change
  const handleKuokGroupLogoFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKuokGroupLogoFilename(value);
    setData(prev => ({ ...prev, kuokGroupLogoUrl: value }));
  };

  // Handle COR seal filename change
  const handleCorSealFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCorSealFilename(value);
    setData(prev => ({ ...prev, corSealUrl: value }));
  };

  // Upload image to Vercel Blob and return URL
  const uploadToVercelBlob = async (file: File): Promise<string> => {
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
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Extract and set filename from the returned URL
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length > 0) {
          const fileName = pathParts[pathParts.length - 1];
          setLogoFilename(fileName);
          setData(prev => ({ ...prev, logoUrl: fileName }));
        }
      } catch (e) {
        // Handle error if URL parsing fails
        console.error("Error parsing URL:", e);
      }
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

  // Handle Kuok Group logo upload
  const handleKuokGroupLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Extract and set filename from the returned URL
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length > 0) {
          const fileName = pathParts[pathParts.length - 1];
          setKuokGroupLogoFilename(fileName);
          setData(prev => ({ ...prev, kuokGroupLogoUrl: fileName }));
        }
      } catch (e) {
        // Handle error if URL parsing fails
        console.error("Error parsing URL:", e);
      }
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

  // Handle COR seal upload
  const handleCorSealUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Extract and set filename from the returned URL
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length > 0) {
          const fileName = pathParts[pathParts.length - 1];
          setCorSealFilename(fileName);
          setData(prev => ({ ...prev, corSealUrl: fileName }));
        }
      } catch (e) {
        // Handle error if URL parsing fails
        console.error("Error parsing URL:", e);
      }
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

  const addLink = () => {
    setData(prev => ({ ...prev, links: [...prev.links, { label: "", url: "" }] }));
  };

  const removeLink = (idx: number) => {
    setData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const addSocialLink = () => {
    if (newSocialLink.label && newSocialLink.icon) {
      setData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, { ...newSocialLink }]
      }));
      setNewSocialLink({ label: '', url: '', icon: '' });
    } else {
      toast.error("Please provide both label and icon for the social link");
    }
  };

  const removeSocialLink = (index: number) => {
    setData(prev => {
      const socialLinks = [...prev.socialLinks];
      socialLinks.splice(index, 1);
      return { ...prev, socialLinks };
    });
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

  // Construct full URL for preview
  const getFullLogoUrl = () => {
    if (!data.logoUrl) return "";
    // If it's already a full URL, return as is
    try {
      new URL(data.logoUrl);
      return data.logoUrl;
    } catch {
      // If it's not a valid URL, treat as filename and prepend base URL
      return `${DEFAULT_BASE_URL}${data.logoUrl}`;
    }
  };

  // Construct full URL for Kuok Group logo
  const getFullKuokGroupLogoUrl = () => {
    if (!data.kuokGroupLogoUrl) return "";
    try {
      new URL(data.kuokGroupLogoUrl);
      return data.kuokGroupLogoUrl;
    } catch {
      return `${DEFAULT_BASE_URL}${data.kuokGroupLogoUrl}`;
    }
  };

  // Construct full URL for COR seal
  const getFullCorSealUrl = () => {
    if (!data.corSealUrl) return "";
    try {
      new URL(data.corSealUrl);
      return data.corSealUrl;
    } catch {
      return `${DEFAULT_BASE_URL}${data.corSealUrl}`;
    }
  };

  // Custom input component with animations
  const AnimatedInput = ({ 
    id, 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = "text",
    readOnly = false,
    textarea = false,
    rows
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    type?: string;
    readOnly?: boolean;
    textarea?: boolean;
    rows?: number;
  }) => {
    const InputComponent = textarea ? "textarea" : "input";
    
    return (
      <div className="mb-6 relative">
        <motion.label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
        
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-[#b08b2e] rounded-lg shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <InputComponent
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            readOnly={readOnly}
            rows={rows}
            className={`relative block w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-[#b08b2e] placeholder-gray-400 transition-all duration-300 ${
              textarea ? 'min-h-[100px]' : ''
            }`}
            onFocus={() => setFocusedField(id)}
            onBlur={() => setFocusedField(null)}
          />
          
          {focusedField === id && (
            <motion.div
              className="absolute -inset-0.5 rounded-lg bg-[#b08b2e] opacity-20"
              initial={{ scale: 1 }}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Live Preview - on top for mobile, on right for desktop */}
      <div className="border border-gray-200 rounded-lg w-full lg:w-full bg-gray-50 lg:order-1">
        {/* <h3 className="font-semibold text-lg text-[#b08b2e] mb-3 p-4">Live Preview</h3> */}

        <div className="overflow-auto">
          {/* Exact copy of Footer.tsx with dynamic data */}
          <footer className="w-full bg-[#686058] text-white">
            <div className="container px-4 py-8 sm:p-6 pt-10 mx-auto">
              <div className="flex flex-col lg:flex-row items-start justify-center gap-10 text-center lg:text-left">
                <div className="flex flex-col items-center w-full lg:w-1/5 px-2 sm:px-6 mb-8 lg:mb-0">
                  <a className="flex flex-col items-center text-xs space-y-3 text-white focus:outline-hidden focus:opacity-80" href="#" aria-label="Brand">
                    {data.logoUrl ? (
                      <img src={getFullLogoUrl()} className="w-32 sm:w-40 mx-auto" alt="Footer Logo" />
                    ) : (
                      <div className="border-2 border-dashed border-[#b08b2e] text-white bg-[#b08b2e]/30] text-white bg-[#b08b2e]/30 rounded-xl w-32 h-12 flex items-center justify-center text-gray-500">
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
                    {/* Kuok Group Logo */}
                    {data.kuokGroupLogoUrl ? (
                      <img src={getFullKuokGroupLogoUrl()} className="w-32 h-full mb-2 object-contain" alt="Kuok Group Logo" />
                    ) : (
                      <div className=" border-2 border-dashed border-[#b08b2e] text-white bg-[#b08b2e]/30 rounded-xl w-32 h-12 mb-2" />
                    )}
                    {/* <span className="text-xs text-gray-300">Kuok Group Logo</span> */}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start justify-around w-full lg:w-4/5 gap-8">
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
                    <div className="mt-3 w-full md:max-w-lg grid grid-cols-6 px-6 md:grid-cols-2 gap-4 justify-center items-center">
                      {data.socialLinks && data.socialLinks.map((social, idx) => (
                        social.url ? (
                          <a 
                            key={idx} 
                            href={social.label === 'Email' ? `mailto:${social.url}` : social.url}
                            className="flex justify-center md:justify-start items-center text-white hover:text-[#b08b2e] space-x-0 md:space-x-3 focus:outline-hidden focus:text-[#b08b2e]"
                          >
                            <Icon icon={social.icon} className="size-8" />
                            <h1 className="hidden md:flex">{social.label}</h1>
                          </a>
                        ) : (
                          <div 
                            key={idx}
                            className="flex justify-center md:justify-start items-center text-white hover:text-[#b08b2e] space-x-0 md:space-x-3 focus:outline-hidden focus:text-[#b08b2e]"
                          >
                            <Icon icon={social.icon} className="size-8" />
                            <h1 className="hidden md:flex">{social.label}</h1>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center md:max-w-40 justify-center w-full">
                    {/* COR Seal */}
                    {data.corSealUrl ? (
                      <img src={getFullCorSealUrl()} className="max-w-[100px] sm:max-w-40 w-40 h-full mx-auto object-contain" alt="COR Seal" />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl max-w-[100px] sm:max-w-40 w-40 h-20 mx-auto" />
                    )}
                    {/* <span className="text-xs text-gray-300 mt-1">COR Seal</span> */}
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center">
                  <div className="flex flex-wrap items-center gap-3 justify-center w-full md:w-auto">
                    <div className="space-x-4 text-sm">
                      <a className="inline-flex gap-x-2 text-gray-300 hover:text-white focus:outline-hidden focus:text-white" href={data.termsUrl || "#"}>Terms</a>
                      <a className="inline-flex gap-x-2 text-gray-300 hover:text-white focus:outline-hidden focus:text-white" href={data.privacyUrl || "#"}>Privacy</a>
                      <button
                        className="inline-flex gap-x-2 text-gray-300 hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e] castoro-titling-regular bg-transparent border-none p-0 m-0 cursor-pointer"
                        type="button"
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-3 w-full md:w-auto">
                    <div>
                      <div className="text-sm text-gray-300 hover:text-white focus:outline-hidden focus:text-white">
                        <p>© {data.copyright || new Date().getFullYear()} Shang Properties, Inc. All Rights Reserved.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Edit Form - on bottom for mobile, on left for desktop */}
      <motion.div 
        className="space-y-4 w-full lg:w-full lg:order-2 bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Uploads in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Footer Logo */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Footer Logo</label>
            <div 
              className="border-2 border-dashed border-[#b08b2e] text-white bg-[#b08b2e]/30 rounded-lg p-4 flex flex-col items-center justify-center relative group"
            >
              {data.logoUrl ? (
                <>
                  <img 
                    src={getFullLogoUrl()} 
                    alt="Logo Preview" 
                    className="h-32 w-full object-contain rounded"
                  />
                  {effectiveIsEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setData(prev => ({ ...prev, logoUrl: "" }));
                        setLogoFilename("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Footer Logo</p>
                  <p className="text-sm">No file selected</p>
                </div>
              )}
              {effectiveIsEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!effectiveIsEditing}
                />
              )}
            </div>
            <div>
              <input
                type="text"
                value={logoFilename}
                onChange={handleLogoFilenameChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
                placeholder="logo.webp"
                readOnly={!effectiveIsEditing}
              />
              <p className="text-xs text-gray-500 mt-1">Enter just the filename</p>
            </div>
          </div>
          
          {/* Kuok Group Logo */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Kuok Group Logo</label>
            <div 
              className="border-2 border-dashed border-[#b08b2e] text-white bg-[#b08b2e]/30 rounded-lg p-4 flex flex-col items-center justify-center relative group"
            >
              {data.kuokGroupLogoUrl ? (
                <>
                  <img 
                    src={getFullKuokGroupLogoUrl()} 
                    alt="Kuok Group Logo Preview" 
                    className="h-32 w-full object-contain rounded"
                  />
                  {effectiveIsEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setData(prev => ({ ...prev, kuokGroupLogoUrl: "" }));
                        setKuokGroupLogoFilename("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Kuok Group Logo</p>
                  <p className="text-sm">No file selected</p>
                </div>
              )}
              {effectiveIsEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleKuokGroupLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!effectiveIsEditing}
                />
              )}
            </div>
            <div>
              <input
                type="text"
                value={kuokGroupLogoFilename}
                onChange={handleKuokGroupLogoFilenameChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
                placeholder="kuok-group-logo.webp"
                readOnly={!effectiveIsEditing}
              />
              <p className="text-xs text-gray-500 mt-1">Enter just the filename</p>
            </div>
          </div>
          
          {/* COR Seal */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">COR Seal</label>
            <div 
              className="border-2 border-dashed border-[#b08b2e] text-white bg-[#b08b2e]/30 rounded-lg p-4 flex flex-col items-center justify-center relative group"
            >
              {data.corSealUrl ? (
                <>
                  <img 
                    src={getFullCorSealUrl()} 
                    alt="COR Seal Preview" 
                    className="h-32 w-full object-contain rounded"
                  />
                  {effectiveIsEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setData(prev => ({ ...prev, corSealUrl: "" }));
                        setCorSealFilename("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">COR Seal</p>
                  <p className="text-sm">No file selected</p>
                </div>
              )}
              {effectiveIsEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCorSealUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={!effectiveIsEditing}
                />
              )}
            </div>
            <div>
              <input
                type="text"
                value={corSealFilename}
                onChange={handleCorSealFilenameChange}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
                placeholder="cor-seal.webp"
                readOnly={!effectiveIsEditing}
              />
              <p className="text-xs text-gray-500 mt-1">Enter just the filename</p>
            </div>
          </div>
        </div>

        <AnimatedInput
          id="address"
          label="Address"
          value={data.address}
          onChange={handleChange}
          placeholder="Company address..."
          textarea
          rows={2}
          readOnly={!effectiveIsEditing}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedInput
            id="copyright"
            label="Copyright Text"
            value={data.copyright}
            onChange={handleChange}
            placeholder="2025 Company Name"
            readOnly={!effectiveIsEditing}
          />

          <AnimatedInput
            id="email"
            label="Email"
            value={data.email || ''}
            onChange={handleChange}
            type="email"
            placeholder="contact@example.com"
            readOnly={!effectiveIsEditing}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedInput
            id="termsUrl"
            label="Terms URL"
            value={data.termsUrl}
            onChange={handleChange}
            placeholder="/terms"
            readOnly={!effectiveIsEditing}
          />

          <AnimatedInput
            id="privacyUrl"
            label="Privacy URL"
            value={data.privacyUrl}
            onChange={handleChange}
            placeholder="/privacy"
            readOnly={!effectiveIsEditing}
          />
        </div>

        {/* Social Media Links Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Social Media Links</label>
            {effectiveIsEditing && (
              <motion.button
                type="button"
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
                onClick={addSocialLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Social Link
              </motion.button>
            )}
          </div>

          {/* Add new social link form */}
          <AnimatePresence>
            {effectiveIsEditing && (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedInput
                  id="newSocialLinkLabel"
                  label="Label"
                  value={newSocialLink.label}
                  onChange={(e) => setNewSocialLink({...newSocialLink, label: e.target.value})}
                  placeholder="Label (e.g. Facebook)"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatedInput
                  id="newSocialLinkIcon"
                  label="Icon"
                  value={newSocialLink.icon}
                  onChange={(e) => setNewSocialLink({...newSocialLink, icon: e.target.value})}
                  placeholder="Icon (e.g. fa6-brands:facebook)"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatedInput
                  id="newSocialLinkUrl"
                  label="URL"
                  value={newSocialLink.url}
                  onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                  placeholder="URL"
                  readOnly={!effectiveIsEditing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Existing social links */}
          <div className="space-y-4">
            {data.socialLinks && data.socialLinks.map((social, idx) => (
              <motion.div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <Icon icon={social.icon} className="size-6" />
                  <span>{social.label}</span>
                </div>
                <AnimatedInput
                  id={`social-icon-${idx}`}
                  label="Icon"
                  value={social.icon}
                  onChange={(e) => handleSocialLinkChange(idx, 'icon', e.target.value)}
                  placeholder="Icon name"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatedInput
                  id={`social-url-${idx}`}
                  label="URL"
                  value={social.url}
                  onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                  placeholder="URL"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatePresence>
                  {effectiveIsEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        type="button"
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium"
                        onClick={() => removeSocialLink(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Links Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">Footer Links</label>
            {effectiveIsEditing && (
              <motion.button
                type="button"
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-lg"
                onClick={addLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Link
              </motion.button>
            )}
          </div>

          <div className="space-y-4">
            {data.links.map((link, idx) => (
              <motion.div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <AnimatedInput
                  id={`link-label-${idx}`}
                  label="Label"
                  value={link.label}
                  onChange={(e) => handleLinkChange(idx, "label", e.target.value)}
                  placeholder="Link Label"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatedInput
                  id={`link-url-${idx}`}
                  label="URL"
                  value={link.url}
                  onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                  placeholder="Link URL"
                  readOnly={!effectiveIsEditing}
                />
                <AnimatePresence>
                  {effectiveIsEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.button
                        type="button"
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium"
                        onClick={() => removeLink(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {effectiveIsEditing && (
            <motion.div
              className="flex justify-end mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
                  "Save Footer Section"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FooterEditor;