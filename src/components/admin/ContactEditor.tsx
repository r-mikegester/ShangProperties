import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { logChange } from "../../utils/changeLogger";

interface ContactContent {
  // Existing fields
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  viber: string;
  whatsapp: string;
  telegram: string;
  
  // New fields for editable text content
  headline: string;
  subheading: string;
  socialMediaHeading: string;
}

interface SectionEditorProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
  isEditing?: boolean;
}

const ContactEditor: React.FC<SectionEditorProps<ContactContent>> = ({ initialData, onSave, isEditing }) => {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  // Add state for preview toggle
  const [showPreview, setShowPreview] = useState(true);
  // Add states for section toggles
  const [showContentSection, setShowContentSection] = useState(true);
  const [showContactSection, setShowContactSection] = useState(true);
  
  // Get the editing state from the outlet context
  const context = useOutletContext<any>();
  const { isPageEditing } = context || {};
  const effectiveIsEditing = isEditing !== undefined ? isEditing : isPageEditing;

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const updatedData = { ...prev, [name]: value };
      onSave(updatedData);
      return updatedData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      await logChange("Contact", "UPDATE", data);
      toast.success("Contact section saved successfully!");
    } catch (error) {
      await logChange("Contact", "UPDATE_ERROR", { error: (error as Error).message });
      toast.error("Failed to save contact section: " + (error as Error).message);
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
            className={`relative block w-full px-4 py-3 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-[#b08b2e] placeholder-gray-400 transition-all duration-300 z-10 ${
              textarea ? 'min-h-[100px]' : ''
            }`}
            onFocus={() => setFocusedField(id)}
            onBlur={() => setFocusedField(null)}
          />
          
          {focusedField === id && !readOnly && (
            <motion.div
              className="absolute -inset-0.5 rounded-lg bg-[#b08b2e] opacity-20 z-0"
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

  // Preview component that mimics the live contact section
  const ContactPreview = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Contact Info Section */}
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 castoro-titling-regular text-[#b08b2e]">
            {data.headline || "Get in touch"}
          </h2>
          <p className="mb-6 text-gray-700">
            {data.subheading || "Please feel free to call, email, or chat with us to learn more about Shang Properties."}
          </p>
          
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <Icon icon="mdi:map-marker" className="w-6 h-6 text-[#B08B2E] mr-3 mt-1 flex-shrink-0" />
              <span>{data.address || "Shangri-La Plaza, Shang Central, EDES corner Shaw Boulevard, Mandaluyong City, Metro Manila 1550, Philippines"}</span>
            </div>
            
            <div className="flex items-start">
              <Icon icon="mdi:phone" className="w-6 h-6 text-[#B08B2E] mr-3 mt-1 flex-shrink-0" />
              <span>{data.phone || "(+63) 997 296 4320"}</span>
            </div>
            
            <div className="flex items-start">
              <Icon icon="mdi:email" className="w-6 h-6 text-[#B08B2E] mr-3 mt-1 flex-shrink-0" />
              <span>{data.email || "guidetoshangproperties.com"}</span>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="md:w-1/2">
          <div className="mt-8 md:mt-0">
            <h3 className="text-gray-600 mb-4">
              {data.socialMediaHeading || "Follow us on our socials"}
            </h3>
            <div className="flex flex-wrap gap-4">
              {data.facebook && (
                <a href={data.facebook} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="streamline-flex:facebook-logo-1-remix" className="w-6 h-6" />
                </a>
              )}
              
              {data.instagram && (
                <a href={data.instagram} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="fa6-brands:instagram" className="w-6 h-6" />
                </a>
              )}
              
              {data.viber && (
                <a href={data.viber} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="basil:viber-outline" className="w-6 h-6" />
                </a>
              )}
              
              {data.whatsapp && (
                <a href={data.whatsapp} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="fa6-brands:whatsapp" className="w-6 h-6" />
                </a>
              )}
              
              {data.telegram && (
                <a href={data.telegram} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="gravity-ui:logo-telegram" className="w-6 h-6" />
                </a>
              )}
              
              {data.email && (
                <a href={`mailto:${data.email}`} className="text-gray-400 hover:text-[#B08B2E] transition-colors">
                  <Icon icon="cib:mail-ru" className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Responsive Preview */}
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
              <ContactPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Form */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Section Management</h2>
        <p className="text-gray-600 mb-6">
          Manage the content of your contact section. Changes will be reflected on the homepage.
        </p>
        
        {/* Content Section */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800">Content Management</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContentSection(!showContentSection)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md"
            >
              <Icon icon={showContentSection ? "mdi:chevron-up" : "mdi:chevron-down"} width="16" height="16" />
              {showContentSection ? "Collapse" : "Expand"}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showContentSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mb-8">
                  <AnimatedInput
                    id="headline"
                    label="Headline"
                    value={data.headline}
                    onChange={handleChange}
                    placeholder="Get in touch"
                    readOnly={!effectiveIsEditing}
                  />
                  
                  <AnimatedInput
                    id="subheading"
                    label="Subheading"
                    value={data.subheading}
                    onChange={handleChange}
                    placeholder="Please feel free to call, email, or chat with us to learn more about Shang Properties."
                    textarea
                    rows={3}
                    readOnly={!effectiveIsEditing}
                  />
                  
                  <AnimatedInput
                    id="socialMediaHeading"
                    label="Social Media Heading"
                    value={data.socialMediaHeading}
                    onChange={handleChange}
                    placeholder="Follow us on our socials"
                    readOnly={!effectiveIsEditing}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Contact Information Section */}
        <div className="border border-gray-200 rounded-lg p-4">
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
                <div className="mb-8">
                  <AnimatedInput
                    id="address"
                    label="Address"
                    value={data.address}
                    onChange={handleChange}
                    placeholder="Company address..."
                    textarea
                    rows={3}
                    readOnly={!effectiveIsEditing}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedInput
                      id="phone"
                      label="Phone"
                      value={data.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      readOnly={!effectiveIsEditing}
                    />
                    
                    <AnimatedInput
                      id="email"
                      label="Email"
                      value={data.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="contact@example.com"
                      readOnly={!effectiveIsEditing}
                    />
                  </div>
                </div>
                
                {/* Social Media Links Note */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                  <div className="bg-[#b08b2e]/30 border border-[#b08b2e]/30 rounded-lg p-4">
                    <p className="text-[#b08b2e]">
                      <strong>Note:</strong> Social links are now managed in a dedicated section. 
                      Please go to the "Social Links" tab in Page Management to edit social media links. 
                      Changes made there will be reflected across the site.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactEditor;