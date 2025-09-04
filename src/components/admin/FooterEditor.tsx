import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { put } from '@vercel/blob';
import { Icon } from "@iconify/react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logChange } from "../../utils/changeLogger";
import Footer from "../shared/Footer";

// Add environment variable declaration
declare global {
  interface ImportMetaEnv {
    VITE_BLOB_READ_WRITE_TOKEN: string;
  }
}

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
  // Add state for preview toggle
  const [showPreview, setShowPreview] = useState(true);
  // Add states for section toggles
  const [showLogoSection, setShowLogoSection] = useState(true);
  const [showContactSection, setShowContactSection] = useState(true);
  const [showDevelopmentsSection, setShowDevelopmentsSection] = useState(true);
  const [showLegalSection, setShowLegalSection] = useState(true);
  
  // Get the editing state from the outlet context
  const { isPageEditing } = useOutletContext<{ isPageEditing: boolean }>();
  const effectiveIsEditing = isEditing !== undefined ? isEditing : isPageEditing;

  // Default base URL for images
  const DEFAULT_BASE_URL = "https://6ovgprfdguxo1bkn.public.blob.vercel-storage.com/";

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

  const handleChange = (id: keyof FooterContent, value: any) => {
    setData(prev => {
      const updatedData = { ...prev, [id]: value };
      onSave(updatedData);
      return updatedData;
    });
  };

  // Handle changes to links (New Developments)
  const handleLinkChange = (index: number, field: string, value: string) => {
    setData(prev => {
      const links = [...prev.links];
      links[index] = { ...links[index], [field]: value };
      const updatedData = { ...prev, links };
      onSave(updatedData);
      return updatedData;
    });
  };

  // Handle adding a new link
  const addLink = () => {
    setData(prev => {
      const links = [...prev.links, { label: '', url: '' }];
      const updatedData = { ...prev, links };
      onSave(updatedData);
      return updatedData;
    });
  };

  // Handle removing a link
  const removeLink = (index: number) => {
    setData(prev => {
      const links = [...prev.links];
      links.splice(index, 1);
      const updatedData = { ...prev, links };
      onSave(updatedData);
      return updatedData;
    });
  };

  const handleSocialLinkChange = (index: number, field: keyof { label: string; url: string; icon: string }, value: string) => {
    setData(prev => {
      const socialLinks = [...prev.socialLinks];
      socialLinks[index] = { ...socialLinks[index], [field]: value };
      const updatedData = { ...prev, socialLinks };
      onSave(updatedData);
      return updatedData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      await logChange("Footer", "UPDATE", data);
      toast.success("Footer section saved successfully!");
    } catch (error) {
      await logChange("Footer", "UPDATE_ERROR", { error: (error as Error).message });
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

  // Footer preview component that matches the actual Footer component
  const FooterPreview: React.FC = () => {
    // Use default data if footerData is not loaded yet
    const previewData = {
      logoUrl: data.logoUrl || "",
      kuokGroupLogoUrl: data.kuokGroupLogoUrl || "",
      corSealUrl: data.corSealUrl || "",
      address: data.address || `Shangri-La Plaza, Shang Central,
                                    EDSA corner Shaw Boulevard,
                                    Mandaluyong City,
                                    Metro Manila 1550,
                                    Philippines`,
      copyright: data.copyright || new Date().getFullYear() + " Shang Properties, Inc. All Rights Reserved.",
      termsUrl: data.termsUrl || "#",
      privacyUrl: data.privacyUrl || "#",
      email: data.email || "",
      links: data.links || [
        { label: "Shang Summit", url: "/ShangSummit" },
        { label: "Haraya Residences", url: "/Haraya" },
        { label: "Aurelia Residences", url: "/Aurelia" },
        { label: "Laya Residences", url: "/Laya" },
        { label: "Shang Residences at Wack Wack", url: "/WackWack" },
      ],
      socialLinks: data.socialLinks || [
        { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100084197640848', icon: 'streamline-flex:facebook-logo-1-remix' },
        { label: 'Instagram', url: 'https://www.instagram.com/shangproperties.venezia/', icon: 'fa6-brands:instagram' },
        { label: 'Viber', url: 'tel:+639972964320', icon: 'basil:viber-outline' },
        { label: 'WhatsApp', url: 'tel:+639972964320', icon: 'fa6-brands:whatsapp' },
        { label: 'Telegram', url: 'tel:+639972964320', icon: 'gravity-ui:logo-telegram' },
        { label: 'Email', url: 'mailto:guide@shangproperties.com', icon: 'cib:mail-ru' },
      ]
    };

    return (
      <div className="w-full bg-[#686058] text-white rounded-lg p-6">
        <div className="container px-4 py-8 sm:p-6 pt-10 mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-10 text-center lg:text-left">
            <div className="flex flex-col items-center w-full lg:w-1/5 px-2 sm:px-6 mb-8 lg:mb-0">
              <div className="flex flex-col items-center text-xs space-y-3 text-white">
                {previewData.logoUrl ? (
                  <img src={previewData.logoUrl} className="w-32 sm:w-40 mx-auto" alt="Footer Logo" />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
                )}
                <pre className="text-center whitespace-pre-wrap text-white">{previewData.address}</pre>
              </div>
              {previewData.kuokGroupLogoUrl ? (
                <img className="mt-3 w-32 sm:w-40 mx-auto" src={previewData.kuokGroupLogoUrl} alt="Kuok Group Logo" />
              ) : (
                <div className="mt-3 bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32" />
              )}
            </div>
            <div className="flex flex-col md:flex-row items-start justify-around w-full lg:w-4/5 gap-8">
              <div className="flex flex-col max-w-96 w-full text-center items-center">
                <h3 className="text-white uppercase font-semibold">New Developments</h3>
                {previewData.links && previewData.links.length > 0 ? (
                  previewData.links.map((link: any, idx: number) => (
                    link ? (
                      <a
                        key={idx}
                        href={link.url}
                        className="block mt-2 text-sm text-white hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : null
                  ))
                ) : (
                  <>
                    <div className="block mt-2 text-sm text-white">Shang Summit</div>
                    <div className="block mt-2 text-sm text-white">Haraya Residences</div>
                    <div className="block mt-2 text-sm text-white">Aurelia Residences</div>
                    <div className="block mt-2 text-sm text-white">Laya Residences</div>
                    <div className="block mt-2 text-sm text-white">Shang Residences at Wack Wack</div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <h3 className="text-white text-center uppercase font-semibold">Connect with me</h3>
                <div className="mt-3 xs:w-40 w-full md:max-w-lg grid grid-cols-3 sm:grid-cols-6 px-6 md:grid-cols-2 gap-4 justify-center items-center">
                  {previewData.socialLinks && previewData.socialLinks.length > 0 ? (
                    previewData.socialLinks.map((social: any, idx: number) => (
                      social ? (
                        <a 
                          key={idx} 
                          href={social.label === 'Email' && social.url ? `mailto:${social.url}` : (social.url || '#')}
                          className="flex justify-center items-center text-white hover:text-[#b08b2e]"
                        >
                          <Icon icon={social.icon} className="size-8" />
                          <span className="hidden md:inline ml-3">{social.label}</span>
                        </a>
                      ) : null
                    ))
                  ) : (
                    <>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="streamline-flex:facebook-logo-1-remix" className="size-8" />
                        <span className="hidden md:inline ml-3">Facebook</span>
                      </div>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="fa6-brands:instagram" className="size-8" />
                        <span className="hidden md:inline ml-3">Instagram</span>
                      </div>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="basil:viber-outline" className="size-8" />
                        <span className="hidden md:inline ml-3">Viber</span>
                      </div>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="fa6-brands:whatsapp" className="size-8" />
                        <span className="hidden md:inline ml-3">WhatsApp</span>
                      </div>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="gravity-ui:logo-telegram" className="size-8" />
                        <span className="hidden md:inline ml-3">Telegram</span>
                      </div>
                      <div className="flex justify-center items-center text-white">
                        <Icon icon="cib:mail-ru" className="size-8" />
                        <span className="hidden md:inline ml-3">Email</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center md:max-w-40 justify-center w-full">
                {previewData.corSealUrl ? (
                  <img src={previewData.corSealUrl} className="max-w-[100px] sm:max-w-40 w-40 h-auto mx-auto" alt="COR Seal" />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-40 h-40" />
                )}
              </div>
            </div>
          </div>
          <div className="pt-5 mt-5 border-t border-white">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center">
              <div className="flex flex-wrap items-center gap-3 justify-center w-full md:w-auto">
                <div className="space-x-4 text-sm">
                  <a className="inline-flex gap-x-2 text-gray-300 hover:text-white" href={previewData.termsUrl}>Terms</a>
                  <a className="inline-flex gap-x-2 text-gray-300 hover:text-white" href={previewData.privacyUrl}>Privacy</a>
                  <button
                    className="inline-flex gap-x-2 text-gray-300 hover:text-white bg-transparent border-none p-0 m-0 cursor-pointer"
                    type="button"
                  >
                    Admin
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-3 w-full md:w-auto">
                <div>
                  <div className="text-sm text-gray-300">
                    <p>© {previewData.copyright}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          
          // Set the full URL in the data
          setData(prev => ({ ...prev, logoUrl: url }));
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
          
          // Set the full URL in the data
          setData(prev => ({ ...prev, kuokGroupLogoUrl: url }));
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
          
          // Set the full URL in the data
          setData(prev => ({ ...prev, corSealUrl: url }));
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

  const handleLogoFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filename = e.target.value;
    setLogoFilename(filename);
    setData(prev => ({ ...prev, logoUrl: filename ? `${DEFAULT_BASE_URL}${filename}` : DEFAULT_BASE_URL }));
  };

  const handleKuokGroupLogoFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filename = e.target.value;
    setKuokGroupLogoFilename(filename);
    setData(prev => ({ ...prev, kuokGroupLogoUrl: filename ? `${DEFAULT_BASE_URL}${filename}` : DEFAULT_BASE_URL }));
  };

  const handleCorSealFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filename = e.target.value;
    setCorSealFilename(filename);
    setData(prev => ({ ...prev, corSealUrl: filename ? `${DEFAULT_BASE_URL}${filename}` : DEFAULT_BASE_URL }));
  };

  // Custom file upload component with animations
  const AnimatedFileUpload = ({ 
    id,
    label,
    onFileSelect,
    filename,
    onFilenameChange,
    readOnly = false
  }: {
    id: string;
    label: string;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filename: string;
    onFilenameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
  }) => {
    return (
      <div className="mb-6">
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.label>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <motion.div 
            className="relative flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#b08b2e] file:text-white hover:file:bg-[#a07a1e] file:transition file:duration-300 file:cursor-pointer"
              disabled={!effectiveIsEditing || readOnly}
            />
          </motion.div>
          
          {uploadProgress !== null && (
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {uploadProgress}%
            </motion.div>
          )}
        </div>
        
        <AnimatePresence>
          {(filename || (data as any)[`${id}Url`]) && (
            <motion.div 
              className="mt-4 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-4">
                <img 
                  src={filename ? `${DEFAULT_BASE_URL}${filename}` : (data as any)[`${id}Url`]} 
                  alt="Preview" 
                  className="h-32 w-32 object-contain rounded-lg border-2 border-[#b08b2e]"
                />
                {effectiveIsEditing && !readOnly && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      setData(prev => ({ ...prev, [`${id}Url`]: DEFAULT_BASE_URL }));
                      if (id === 'logo') setLogoFilename("");
                      if (id === 'kuok-group-logo') setKuokGroupLogoFilename("");
                      if (id === 'cor-seal') setCorSealFilename("");
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove Image
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Filename input */}
        <div className="mt-2">
          <input
            type="text"
            value={filename}
            onChange={onFilenameChange}
            placeholder="Enter filename (e.g., image.jpg)"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b08b2e] focus:border-[#b08b2e] sm:text-sm"
            readOnly={!effectiveIsEditing || readOnly}
          />
          <p className="text-xs text-gray-500 mt-1">Enter just the filename. It will be automatically prefixed with the default base URL.</p>
        </div>
      </div>
    );
  };

  const removeSocialLink = (index: number) => {
    setData(prev => {
      const socialLinks = [...prev.socialLinks];
      socialLinks.splice(index, 1);
      const updatedData = { ...prev, socialLinks };
      onSave(updatedData);
      return updatedData;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Preview Section - Shows how the footer will look on the live site */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-[#b08b2e]">Live Preview</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-[#b08b2e] text-white rounded-md"
          >
            <Icon icon={showPreview ? "mdi:eye-off" : "mdi:eye"} width="16" height="16" />
            {showPreview ? "Hide" : "Show"} Preview
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <FooterPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Footer Section Management</h2>
        <p className="text-gray-600 mb-6">
          Manage the content of your footer section. Changes will be reflected on the homepage.
        </p>
        
        {/* Logo Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">Logo Management</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoSection(!showLogoSection)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              <Icon icon={showLogoSection ? "mdi:chevron-up" : "mdi:chevron-down"} width="16" height="16" />
              {showLogoSection ? "Collapse" : "Expand"}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showLogoSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <AnimatedFileUpload 
                    id="logo"
                    label="Footer Logo"
                    onFileSelect={handleLogoUpload}
                    filename={logoFilename}
                    onFilenameChange={handleLogoFilenameChange}
                    readOnly={!effectiveIsEditing}
                  />
                  
                  <AnimatedFileUpload 
                    id="kuok-group-logo"
                    label="Kuok Group Logo"
                    onFileSelect={handleKuokGroupLogoUpload}
                    filename={kuokGroupLogoFilename}
                    onFilenameChange={handleKuokGroupLogoFilenameChange}
                    readOnly={!effectiveIsEditing}
                  />
                  
                  <AnimatedFileUpload 
                    id="cor-seal"
                    label="COR Seal"
                    onFileSelect={handleCorSealUpload}
                    filename={corSealFilename}
                    onFilenameChange={handleCorSealFilenameChange}
                    readOnly={!effectiveIsEditing}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Contact Information Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">Contact Information</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactSection(!showContactSection)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              <Icon icon={showContactSection ? "mdi:chevron-up" : "mdi:chevron-down"} width="16" height="16" />
              {showContactSection ? "Collapse" : "Expand"}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showContactSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <AnimatedInput
                  id="address"
                  label="Address"
                  value={data.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Company address..."
                  textarea
                  rows={4}
                  readOnly={!effectiveIsEditing}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <AnimatedInput
                    id="email"
                    label="Email"
                    value={data.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    type="email"
                    placeholder="contact@example.com"
                    readOnly={!effectiveIsEditing}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* New Developments Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">New Developments</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDevelopmentsSection(!showDevelopmentsSection)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              <Icon icon={showDevelopmentsSection ? "mdi:chevron-up" : "mdi:chevron-down"} width="16" height="16" />
              {showDevelopmentsSection ? "Collapse" : "Expand"}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showDevelopmentsSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Manage the links that appear in the "New Developments" section of the footer.
                  </p>
                  {effectiveIsEditing && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addLink}
                      className="px-3 py-1 bg-[#b08b2e] text-white rounded-md text-sm flex items-center"
                    >
                      <Icon icon="mdi:plus" className="mr-1" /> Add Development
                    </motion.button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {data.links.map((link, index) => (
                    <motion.div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b08b2e] focus:border-[#b08b2e] sm:text-sm"
                          readOnly={!effectiveIsEditing}
                          placeholder="Development name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#b08b2e] focus:border-[#b08b2e] sm:text-sm"
                          readOnly={!effectiveIsEditing}
                          placeholder="/project-url"
                        />
                      </div>
                      {effectiveIsEditing && (
                        <div className="flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeLink(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <Icon icon="mdi:trash-can-outline" width="20" height="20" />
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Legal Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">Legal Information</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLegalSection(!showLegalSection)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              <Icon icon={showLegalSection ? "mdi:chevron-up" : "mdi:chevron-down"} width="16" height="16" />
              {showLegalSection ? "Collapse" : "Expand"}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showLegalSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedInput
                    id="copyright"
                    label="Copyright Text"
                    value={data.copyright}
                    onChange={(e) => handleChange('copyright', e.target.value)}
                    placeholder="2025 Company Name"
                    readOnly={!effectiveIsEditing}
                  />

                  <AnimatedInput
                    id="termsUrl"
                    label="Terms URL"
                    value={data.termsUrl}
                    onChange={(e) => handleChange('termsUrl', e.target.value)}
                    placeholder="/terms"
                    readOnly={!effectiveIsEditing}
                  />

                  <AnimatedInput
                    id="privacyUrl"
                    label="Privacy URL"
                    value={data.privacyUrl}
                    onChange={(e) => handleChange('privacyUrl', e.target.value)}
                    placeholder="/privacy"
                    readOnly={!effectiveIsEditing}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;