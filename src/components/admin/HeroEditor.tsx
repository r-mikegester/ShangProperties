import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { put } from '@vercel/blob';

interface HeroContent {
  backgroundUrl: string;
  headline: string;
  paragraph: string;
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
}

const HeroEditor: React.FC<SectionEditorProps<HeroContent>> = ({ initialData, onSave }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [filename, setFilename] = useState<string>("");

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
    setData(prev => ({ ...prev, backgroundUrl: value }));
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
          setData(prev => ({ ...prev, backgroundUrl: fileName }));
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
      <div className="space-y-4 w-full lg:w-1/2 lg:order-1">
        <div>
          <label className="block font-medium mb-1">Background Image</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                src={getFullImageUrl()} 
                alt="Preview" 
                className="h-24 w-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => {
                  setData(prev => ({ ...prev, backgroundUrl: "" }));
                  setFilename("");
                }}
                className="mt-1 text-sm text-red-500 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        
        <div>
          <label className="block font-medium mb-1">Background Image Filename</label>
          <input
            type="text"
            value={filename}
            onChange={handleFilenameChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e]"
            placeholder="image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Enter just the filename. It will be automatically prefixed with the default base URL.</p>
          <p className="text-xs text-gray-500 mt-1">Current full URL: {getFullImageUrl()}</p>
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

export default HeroEditor;