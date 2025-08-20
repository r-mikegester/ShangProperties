import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { put } from '@vercel/blob';
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface HeroContent {
  backgroundUrl: string;
  headline: string;
  paragraph: string;
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
  isEditing?: boolean;
}

const HeroEditor: React.FC<SectionEditorProps<HeroContent>> = ({ initialData, onSave, isEditing }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Get the editing state from the outlet context
  const { isPageEditing } = useOutletContext<{ isPageEditing: boolean }>();
  const effectiveIsEditing = isEditing !== undefined ? isEditing : isPageEditing;

  // Default base URL for background images
  const DEFAULT_BASE_URL = "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/";

  useEffect(() => {
    setData({
      ...initialData,
      backgroundUrl: initialData.backgroundUrl || DEFAULT_BASE_URL
    });
    
    // Extract filename from the full URL if it exists
    if (initialData.backgroundUrl && initialData.backgroundUrl !== DEFAULT_BASE_URL) {
      try {
        const url = new URL(initialData.backgroundUrl);
        const pathParts = url.pathname.split('/');
        if (pathParts.length > 0) {
          setFilename(pathParts[pathParts.length - 1]);
        }
      } catch (e) {
        // If it's not a valid URL, treat it as a filename
        setFilename(initialData.backgroundUrl);
      }
    } else if (initialData.backgroundUrl && initialData.backgroundUrl !== DEFAULT_BASE_URL) {
      // If it's just a filename, use it directly
      setFilename(initialData.backgroundUrl);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // Handle filename change
  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilename(value);
    
    // When filename changes, construct the full URL
    const fullUrl = value ? `${DEFAULT_BASE_URL}${value}` : DEFAULT_BASE_URL;
    setData(prev => ({ ...prev, backgroundUrl: fullUrl }));
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

      // Extract and set filename from the returned URL
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        if (pathParts.length > 0) {
          const fileName = pathParts[pathParts.length - 1];
          setFilename(fileName);
          
          // Set the full URL in the data
          setData(prev => ({ ...prev, backgroundUrl: url }));
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

  // Construct full URL for preview
  const getFullImageUrl = () => {
    if (!data.backgroundUrl) return DEFAULT_BASE_URL;
    
    // If it's already a full URL, return as is
    try {
      new URL(data.backgroundUrl);
      return data.backgroundUrl;
    } catch {
      // If it's not a valid URL, treat as filename and prepend base URL
      return `${DEFAULT_BASE_URL}${data.backgroundUrl}`;
    }
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

  // Custom file upload component with animations
  const AnimatedFileUpload = () => {
    return (
      <div className="mb-6">
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Background Image
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
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#b08b2e] file:text-white hover:file:bg-[#a07a1e] file:transition file:duration-300 file:cursor-pointer"
              disabled={!effectiveIsEditing}
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
          {data.backgroundUrl && (
            <motion.div 
              className="mt-4 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <img 
                  src={getFullImageUrl()} 
                  alt="Preview" 
                  className="h-24 w-32 object-cover rounded-lg border-2 border-[#b08b2e]"
                />
                {effectiveIsEditing && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      setData(prev => ({ ...prev, backgroundUrl: DEFAULT_BASE_URL }));
                      setFilename("");
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
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Live Preview - on top for mobile, on right for desktop */}
      <div className="border border-gray-200 rounded-lg w-full lg:w-1/2 bg-gray-50 lg:order-2">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Browser Mockup */}
          <div className="flex items-center px-4 py-2 bg-gray-100 border-b">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-gray-500 ml-2">www.guidetoshangproperties.com</div>
          </div>
          
          {/* Preview Content */}
          <div className="relative min-h-[300px] w-full">
            {/* Background with overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getFullImageUrl()})` }}
            />
            <div className="absolute inset-0 bg-black/70 bg-opacity-70" />
            
            {/* Content */}
            <div className="absolute bottom-0 z-10 flex flex-col items-center justify-end w-full h-full p-4 sm:p-6 md:p-10 text-center">
              <h1 
                className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-[#f4e3c1] drop-shadow-lg castoro-titling-regular leading-tight mb-4"
                dangerouslySetInnerHTML={{ 
                  __html: data.headline || "Curating Spaces <br className=\"hidden sm:block\" /> as Fine As You." 
                }}
              />
              <div className="text-xs sm:text-xs md:text-xs max-w-2xl text-[#c2b498]">
                {/* Paragraph with continue reading functionality */}
                {data.paragraph && data.paragraph.length > 100 ? (
                  <>
                    {data.paragraph.slice(0, 100)}
                    <span className="ml-2 text-[#b08b2e] underline cursor-pointer select-none">
                      ... Continue reading
                    </span>
                  </>
                ) : (
                  data.paragraph || "Shang Properties, Inc. (SPI) has been involved in property investment and development in the Philippines since 1987 and was listed on the Philippine Stock Exchange (PSE) in 1991."
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form - on bottom for mobile, on left for desktop */}
      <div className="w-full lg:w-1/2 lg:order-1">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedFileUpload />
          
          <AnimatedInput
            id="filename"
            label="Background Image Filename"
            value={filename}
            onChange={(e) => handleFilenameChange(e as React.ChangeEvent<HTMLInputElement>)}
            placeholder="image.jpg"
            readOnly={!effectiveIsEditing}
          />
          <p className="text-xs text-gray-500 mt-1 mb-6">Enter just the filename. It will be automatically prefixed with the default base URL.</p>
          
          <AnimatedInput
            id="headline"
            label="Headline (H1) - Supports HTML"
            value={data.headline}
            onChange={handleChange}
            placeholder="Hero Headline"
            textarea
            rows={3}
            readOnly={!effectiveIsEditing}
          />
          <p className="text-xs text-gray-500 mt-1 mb-6">Supports HTML tags like &lt;br&gt; for line breaks</p>
          
          <AnimatedInput
            id="paragraph"
            label="Paragraph"
            value={data.paragraph}
            onChange={handleChange}
            placeholder="Hero paragraph text..."
            textarea
            rows={4}
            readOnly={!effectiveIsEditing}
          />
          
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
                    "Save Hero Section"
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroEditor;