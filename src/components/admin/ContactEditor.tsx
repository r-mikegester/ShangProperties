import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ContactContent {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  viber: string;
  whatsapp: string;
  telegram: string;
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
  
  // Get the editing state from the outlet context
  const { isPageEditing } = useOutletContext<{ isPageEditing: boolean }>();
  const effectiveIsEditing = isEditing !== undefined ? isEditing : isPageEditing;

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
    <div className="space-y-6">
      {/* Responsive Preview */}
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
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedInput
            id="facebook"
            label="Facebook URL"
            value={data.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
            readOnly={!effectiveIsEditing}
          />
          
          <AnimatedInput
            id="instagram"
            label="Instagram URL"
            value={data.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            readOnly={!effectiveIsEditing}
          />
          
          <AnimatedInput
            id="viber"
            label="Viber Link"
            value={data.viber}
            onChange={handleChange}
            placeholder="Viber link or number"
            readOnly={!effectiveIsEditing}
          />
          
          <AnimatedInput
            id="whatsapp"
            label="WhatsApp Link"
            value={data.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp link or number"
            readOnly={!effectiveIsEditing}
          />
          
          <AnimatedInput
            id="telegram"
            label="Telegram Link"
            value={data.telegram}
            onChange={handleChange}
            placeholder="Telegram link or number"
            readOnly={!effectiveIsEditing}
          />
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
                  "Save Contact Section"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactEditor;