import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { SmoothHoverMenuItem } from "./SmoothHoverMenuItem";
import { motion } from "framer-motion";
import LoadingIndicator from "./LoadingIndicator";

// Create a safety wrapper component to prevent direct object rendering
const SafeText: React.FC<{ children: any }> = ({ children }) => {
  if (typeof children === 'object' && children !== null) {
    // Check if it's an object with label and url properties
    if ('label' in children && 'url' in children) {
      return <>{children.label}</>;
    }
    // For any other object, convert to string
    return <>{JSON.stringify(children)}</>;
  }
  return <>{children}</>;
};

// 创建一个带缓存的响应式图片组件
const CachedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);

  useEffect(() => {
    // 检查浏览器缓存
    const checkCache = () => {
      const img = new Image();
      img.onload = () => {
        setIsLoading(false);
        setCachedSrc(src);
      };
      img.onerror = () => {
        setIsLoading(false);
        setIsError(true);
      };
      img.src = src;
    };

    checkCache();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 flex items-center justify-center ${className}`}>
        <LoadingIndicator size="sm" message="Loading image..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed rounded-xl w-full h-40 flex flex-col items-center justify-center ${className}`}>
        <Icon icon="solar:cloud-cross-broken" width="32" height="32" className="text-red-400 mb-2" />
        <span className="text-xs text-gray-500">Failed to load</span>
      </div>
    );
  }

  return (
    <img 
      src={cachedSrc || src} 
      alt={alt} 
      className={`${className} w-full h-40 object-cover rounded-lg border`}
      loading="lazy"
    />
  );
};

interface Project {
  id?: string;
  title: string;
  formalName?: string;
  description?: string;
  description2?: string;
  image?: string;
  iframeSrc?: string | string[];
  address?: string;
  developer?: string;
  sm?: string;
  gallery?: string[];
  project_type?: string;
  productmix?: string;
  noofunits?: string;
  design_team?: string;
  tours360?: string | string[];
}

type ProjectDetailMode = "add" | "edit" | "preview";

type ProjectDetailContainerProps = {
  mode: ProjectDetailMode;
  project: Partial<Project> | Omit<Project, "id">;
  onChange?: (field: keyof Project, value: any) => void;
  onSave?: () => void;
  onAdd?: () => void;
  onImageUpload?: (file: File) => void;
  onGalleryUpload?: (file: File) => void;
  onRemove?: () => void;
  onClose?: () => void;
  loading?: boolean;
  uploadProgress?: number | null;
  addUploadProgress?: number | null;
  showRemoveModal?: boolean;
  setShowRemoveModal?: (v: boolean) => void;
  removing?: boolean;
  isArchived?: boolean;
};

const ProjectDetailContainer: React.FC<ProjectDetailContainerProps> = ({
  mode,
  project,
  onChange,
  onSave,
  onAdd,
  onImageUpload,
  onGalleryUpload,
  onRemove,
  onClose,
  loading,
  uploadProgress,
  addUploadProgress,
  showRemoveModal,
  setShowRemoveModal,
  removing,
  isArchived = false,
}) => {
  const isEdit = mode === "edit";
  const isAdd = mode === "add";
  const isPreview = mode === "preview";
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [activeTab, setActiveTab] = useState<'project-details' | 'descriptions' | 'iframe360' | 'image-showcase'>('project-details');
  const [isEditing, setIsEditing] = useState(false); // New state for toggle editing in preview mode
  const [sidebarOpen, setSidebarOpen] = useState(true); // State for sidebar open/close

  // Handle change for toggle editing mode
  const handleEditChange = (field: keyof Project, value: any) => {
    if (isPreview && isEditing && onChange) {
      onChange(field, value);
    }
  };

  // Handle save for toggle editing mode
  const handleEditSave = () => {
    if (isPreview && isEditing && onSave) {
      onSave();
      setIsEditing(false); // Exit edit mode after saving
    }
  };

  // Sidebar navigation items
  const sidebarLinks = [
    {
      id: 'project-details',
      title: "Project Details",
      icon: "solar:info-square-broken",
    },
    {
      id: 'descriptions',
      title: "Descriptions",
      icon: "solar:file-text-broken",
    },
    {
      id: 'iframe360',
      title: "iFrames",
      icon: "solar:window-frame-broken",
    },
    {
      id: 'image-showcase',
      title: "Image Gallery",
      icon: "solar:gallery-wide-broken",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header for desktop modal with action buttons */}
      <div className="hidden md:flex absolute top-4 right-4 z-10 gap-2">
        {isEdit && (
          <button
            className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center gap-2"
            onClick={onSave}
            disabled={loading}
            title="Save changes"
          >
            {loading ? (
              <>
                <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                <span className="hidden md:inline">Saving...</span>
              </>
            ) : (
              <>
                <Icon icon="solar:diskette-save-bold" width="20" height="20" />
                <span className="hidden md:inline">Save</span>
              </>
            )}
          </button>
        )}
        {isAdd && (
          <button
            className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center gap-2"
            onClick={onAdd}
            disabled={loading}
            title="Add project"
          >
            {loading ? (
              <>
                <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                <span className="hidden md:inline">Adding...</span>
              </>
            ) : (
              <>
                <Icon icon="solar:add-square-bold" width="20" height="20" />
                <span className="hidden md:inline">Add Project</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Mobile top bar sidebar */}
      <nav className="md:hidden sticky top-0 z-30 w-full bg-white border-b border-gray-200">
        <div className="flex w-full items-center px-2 py-2">
          {sidebarLinks.map((link) => (
            <motion.button 
              key={link.id}
              type="button" 
              onClick={() => setActiveTab(link.id as any)} 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center rounded-lg transition-all duration-300 relative ${
                activeTab === link.id 
                  ? 'bg-[#b08b2e]/10 text-[#453610]' 
                  : 'text-[#b08b2e] hover:bg-[#b08b2e]/10'
              }`}
              style={{ flex: 1, height: '56px' }}
            > 
              <div className="flex flex-col items-center justify-center">
                <Icon icon={link.icon} width="20" height="20" />
                <motion.span 
                  className="text-xs truncate mt-1"
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ 
                    opacity: activeTab === link.id ? 1 : 0,
                    maxHeight: activeTab === link.id ? '16px' : 0
                  }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {link.title}
                </motion.span>
              </div>
            </motion.button>
          ))}
        </div>
      </nav>
      
      {/* Main content area with sticky sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar - sticky and not scrollable */}
        <nav className={`hidden md:flex sticky top-0 self-start h-full bg-white border-r border-slate-300 flex-col p-2 transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-14'}`}>
          <div className="relative mb-2">
            <div className="flex items-center justify-between pl-2 pr-1 py-2">
              {sidebarOpen && (
                <h2 className="text-4xl font-bold text-[#b08b2e] truncate" title={project.title || 'New Project'}>
                  {project.title || 'New Project'}
                </h2>
              )}
              {/* <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? (
                  <Icon icon="solar:square-double-alt-arrow-left-broken" className="text-lg text-slate-500" />
                ) : (
                  <Icon icon="solar:square-double-alt-arrow-right-broken" className="text-lg text-slate-500" />
                )}
              </button> */}
            </div>
            
            {sidebarOpen && (
              <p className="text-xs text-gray-500 px-2 mt-1">
                {isAdd ? "Add new project" : isEdit ? "Edit project" : "Project details"}
              </p>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              {sidebarLinks.map((link) => (
                <SmoothHoverMenuItem key={link.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(link.id as any)}
                    className={`w-full text-left rounded-md transition-colors flex items-center ${
                      activeTab === link.id
                        ? sidebarOpen 
                          ? "bg-[#b08b2e]/10 text-[#453610]" 
                          : "bg-[#b08b2e]/10 text-[#453610]"
                        : "text-slate-500"
                    }`}
                  >
                    <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                      <Icon icon={link.icon} width="20" height="20" />
                    </div>
                    {sidebarOpen && (
                      <span className="text-xs font-medium pr-2">{link.title}</span>
                    )}
                  </button>
                </SmoothHoverMenuItem>
              ))}
            </div>
            
            {/* Action buttons for preview mode - placed at the bottom of sidebar */}
            {isPreview && (
              <div className="mt-auto pt-2 space-y-1">
                {/* Archive/Restore button */}
                {!isArchived ? (
                  <SmoothHoverMenuItem>
                    <button
                      className={`w-full text-left rounded-md transition-colors flex items-center ${
                        sidebarOpen 
                          ? "bg-red-500/10 text-red-800" 
                          : "bg-red-500/10 text-red-800"
                      }`}
                      onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                      disabled={removing}
                      title="Archive project"
                    >
                      <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                        {removing ? (
                          <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                        ) : (
                          <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
                        )}
                      </div>
                      {sidebarOpen && (
                        <span className="text-xs font-medium pr-2">
                          {removing ? "Archiving..." : "Archive"}
                        </span>
                      )}
                    </button>
                  </SmoothHoverMenuItem>
                ) : (
                  <SmoothHoverMenuItem>
                    <button
                      className={`w-full text-left rounded-md transition-colors flex items-center ${
                        sidebarOpen 
                          ? "bg-green-500/10 text-green-800" 
                          : "bg-green-500/10 text-green-800"
                      }`}
                      onClick={onRemove}
                      disabled={removing}
                      title="Restore project"
                    >
                      <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                        {removing ? (
                          <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                        ) : (
                          <Icon icon="solar:archive-line-duotone" width="24" height="24" />
                        )}
                      </div>
                      {sidebarOpen && (
                        <span className="text-xs font-medium pr-2">
                          {removing ? "Restoring..." : "Restore"}
                        </span>
                      )}
                    </button>
                  </SmoothHoverMenuItem>
                )}
                
                {/* Edit button for non-archived projects */}
                {!isArchived && !isEditing && (
                  <SmoothHoverMenuItem>
                    <button
                      className={`w-full text-left rounded-md transition-colors flex items-center ${
                        sidebarOpen 
                          ? "bg-[#b08b2e]/10 text-[#453610]" 
                          : "bg-[#b08b2e]/10 text-[#453610]"
                      }`}
                      onClick={() => setIsEditing(true)}
                      title="Edit project"
                    >
                      <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                        <Icon icon="solar:pen-broken" width="24" height="24" />
                      </div>
                      {sidebarOpen && (
                        <span className="text-xs font-medium pr-2">Edit</span>
                      )}
                    </button>
                  </SmoothHoverMenuItem>
                )}
                
                {/* Save button when editing */}
                {!isArchived && isEditing && (
                  <SmoothHoverMenuItem>
                    <button
                      className={`w-full text-left rounded-md transition-colors flex items-center ${
                        sidebarOpen 
                          ? "bg-[#b08b2e]/10 text-[#453610]" 
                          : "bg-[#b08b2e]/10 text-[#453610]"
                      }`}
                      onClick={handleEditSave}
                      disabled={loading}
                      title="Save changes"
                    >
                      <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                        {loading ? (
                          <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                        ) : (
                          <Icon icon="solar:folder-check-broken" width="24" height="24" />
                        )}
                      </div>
                      {sidebarOpen && (
                        <span className="text-xs font-medium pr-2">
                          {loading ? "Saving..." : "Save"}
                        </span>
                      )}
                    </button>
                  </SmoothHoverMenuItem>
                )}
              </div>
            )}
            
            {/* Edit/Save button for edit mode - placed at the bottom of sidebar */}
            {isEdit && (
              <div className="mt-auto pt-2">
                <SmoothHoverMenuItem>
                  <button
                    className={`w-full text-left rounded-md transition-colors flex items-center ${
                      sidebarOpen 
                        ? "bg-[#b08b2e]/10 text-[#453610]" 
                        : "bg-[#b08b2e]/10 text-[#453610]"
                    }`}
                    onClick={onSave}
                    disabled={loading}
                    title="Save changes"
                  >
                    <div className={`grid h-10 place-content-center text-lg ${sidebarOpen ? 'w-10' : 'w-full'}`}>
                      {loading ? (
                        <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                      ) : (
                        <Icon icon="solar:folder-check-broken" width="24" height="24" />
                      )}
                    </div>
                    {sidebarOpen && (
                      <span className="text-xs font-medium pr-2">
                        {loading ? "Saving..." : "Save"}
                      </span>
                    )}
                  </button>
                </SmoothHoverMenuItem>
              </div>
            )}
          </div>
        </nav>
        
        {/* Content area - scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {/* Project Details Tab */}
          <div className={`${activeTab === 'project-details' ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
            {activeTab === 'project-details' && (
              <div id="project-details" className="mb-8 w-full max-w-full mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Icon icon="solar:info-circle-bold" width="24" height="24" className="text-[#b08b2e]" />
                      Project Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <div className="flex flex-col relative">
                          <CachedImage 
                            src={project.image || "https://placehold.co/300x200.png"} 
                            alt={project.title || "Project image"} 
                            className="w-full h-48" 
                          />
                          <label className="flex items-center justify-center mt-3 cursor-pointer rounded-lg bg-[#b08b2e]/10 hover:bg-[#b08b2e]/20 transition py-2 gap-2 border border-[#b08b2e]/30">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0] && (isEdit || (isPreview && isEditing)) && onImageUpload) onImageUpload(e.target.files[0]);
                              }} 
                              disabled={isPreview && !isEditing}
                            />
                            <Icon icon="solar:gallery-edit-broken" width="20" height="20" className="text-[#b08b2e]" />
                            <span className="font-medium text-[#b08b2e]">Change Image</span>
                          </label>
                          
                          {(uploadProgress != null && uploadProgress > 0) || (addUploadProgress != null && addUploadProgress > 0) ? (
                            <div className="mt-2 text-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-[#b08b2e] h-2 rounded-full" 
                                  style={{ width: `${(uploadProgress != null ? uploadProgress : (addUploadProgress != null ? addUploadProgress : 0)) || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1 block">
                                Uploading: {(uploadProgress != null ? uploadProgress : (addUploadProgress != null ? addUploadProgress : 0) || 0).toFixed(0)}%
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                            {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                              <input
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                                value={project.title || ""}
                                onChange={e => (isEdit || isAdd) ? onChange && onChange("title", e.target.value) : handleEditChange("title", e.target.value)}
                                placeholder="Project Title"
                                maxLength={100} 
                              />
                            ) : (
                              <div className="text-lg font-semibold text-gray-900">
                                <SafeText>{project.title || "Not specified"}</SafeText>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formal Name</label>
                            {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                              <input
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                                value={project.formalName || ""}
                                onChange={e => (isEdit || isAdd) ? onChange && onChange("formalName", e.target.value) : handleEditChange("formalName", e.target.value)}
                                placeholder="Formal Name"
                                maxLength={100} 
                              />
                            ) : (
                              <div className="text-gray-700">
                                <SafeText>{project.formalName || "Not specified"}</SafeText>
                              </div>
                            )}
                          </div>
                          
                          {isArchived && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                              <Icon icon="solar:archive-minimalistic-broken" width="16" height="16" className="mr-1" />
                              Archived Project
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.address || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("address", e.target.value) : handleEditChange("address", e.target.value)}
                              placeholder="Project Address"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.address || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.developer || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("developer", e.target.value) : handleEditChange("developer", e.target.value)}
                              placeholder="Developer"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.developer || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.project_type || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("project_type", e.target.value) : handleEditChange("project_type", e.target.value)}
                              placeholder="Project Type"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.project_type || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">No. of Units</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.noofunits || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("noofunits", e.target.value) : handleEditChange("noofunits", e.target.value)}
                              placeholder="No. of Units"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.noofunits || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Product Mix</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.productmix || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("productmix", e.target.value) : handleEditChange("productmix", e.target.value)}
                              placeholder="Product Mix"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.productmix || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Design Team</label>
                          {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                            <input
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                              value={project.design_team || ""}
                              onChange={e => (isEdit || isAdd) ? onChange && onChange("design_team", e.target.value) : handleEditChange("design_team", e.target.value)}
                              placeholder="Design Team"
                              disabled={isPreview && !isEditing}
                            />
                          ) : (
                            <div className="text-gray-700">
                              <SafeText>{project.design_team || "Not specified"}</SafeText>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile action buttons */}
                  <div className="md:hidden border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex flex-col gap-2">
                      {isPreview && !isArchived && (
                        !isEditing ? (
                          <>
                            <button
                              className="w-full py-3 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center gap-2"
                              onClick={() => setIsEditing(true)}
                            >
                              <Icon icon="solar:pen-bold" width="20" height="20" />
                              Edit Project
                            </button>
                            
                            {/* Archive button for non-editing preview mode */}
                            <button
                              className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow flex items-center justify-center gap-2"
                              onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                              disabled={removing}
                            >
                              {removing ? (
                                <>
                                  <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                                  Archiving...
                                </>
                              ) : (
                                <>
                                  <Icon icon="solar:archive-minimalistic-broken" width="20" height="20" />
                                  Archive Project
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="w-full py-3 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center gap-2"
                              onClick={handleEditSave}
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Icon icon="solar:folder-check-broken" width="20" height="20" />
                                  Save Changes
                                </>
                              )}
                            </button>
                            
                            {/* Archive button for editing preview mode */}
                            <button
                              className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow flex items-center justify-center gap-2"
                              onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                              disabled={removing}
                            >
                              {removing ? (
                                <>
                                  <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                                  Archiving...
                                </>
                              ) : (
                                <>
                                  <Icon icon="solar:archive-minimalistic-broken" width="20" height="20" />
                                  Archive Project
                                </>
                              )}
                            </button>
                          </>
                        )
                      )}
                      
                      {(isEdit || isAdd) && (
                        <>
                          <button
                            className="w-full py-3 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center gap-2"
                            onClick={isEdit ? onSave : onAdd}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                                {isEdit ? "Saving..." : "Adding..."}
                              </>
                            ) : (
                              <>
                                <Icon icon={isEdit ? "solar:folder-check-broken" : "solar:add-folder-broken"} width="20" height="20" />
                                {isEdit ? "Save Changes" : "Add Project"}
                              </>
                            )}
                          </button>
                          
                          {isEdit && (
                            <button
                              className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow flex items-center justify-center gap-2"
                              onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                              disabled={removing}
                            >
                              <Icon icon="solar:archive-minimalistic-broken" width="20" height="20" />
                              Archive Project
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* Restore button for archived projects */}
                      {isPreview && isArchived && (
                        <button
                          className="w-full py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow flex items-center justify-center gap-2"
                          onClick={onRemove} // Using onRemove for restore functionality
                          disabled={removing}
                        >
                          {removing ? (
                            <>
                              <Icon icon="svg-spinners:180-ring-with-bg" width="20" height="20" />
                              Restoring...
                            </>
                          ) : (
                            <>
                              <Icon icon="solar:archive-line-duotone" width="20" height="20" />
                              Restore Project
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        className="w-full py-3 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        onClick={onClose}
                      >
                        <Icon icon="solar:close-circle-broken" width="20" height="20" />
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Descriptions Tab */}
          <div className={`${activeTab === 'descriptions' ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
            {activeTab === 'descriptions' && (
              <div id="descriptions" className="my-6 w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Icon icon="solar:file-text-bold" width="24" height="24" className="text-[#b08b2e]" />
                      Project Descriptions
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Icon icon="solar:text-field-broken" width="18" height="18" className="text-[#b08b2e]" />
                          Description
                        </label>
                        {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                          <textarea
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                            value={project.description || ""}
                            onChange={e => (isEdit || isAdd) ? onChange && onChange("description", e.target.value) : handleEditChange("description", e.target.value)}
                            placeholder="Enter project description..."
                            disabled={isPreview && !isEditing}
                          />
                        ) : (
                          <div className="prose max-w-none">
                            {project.description ? (
                              <p className="text-gray-700 whitespace-pre-line">
                                <SafeText>{project.description}</SafeText>
                              </p>
                            ) : (
                              <p className="text-gray-400 italic">No description provided</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Icon icon="solar:text-square-broken" width="18" height="18" className="text-[#b08b2e]" />
                          Additional Description
                        </label>
                        {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                          <textarea
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                            value={project.description2 || ""}
                            onChange={e => (isEdit || isAdd) ? onChange && onChange("description2", e.target.value) : handleEditChange("description2", e.target.value)}
                            placeholder="Enter additional project description..."
                            disabled={isPreview && !isEditing}
                          />
                        ) : (
                          <div className="prose max-w-none">
                            {project.description2 ? (
                              <p className="text-gray-700 whitespace-pre-line">
                                <SafeText>{project.description2}</SafeText>
                              </p>
                            ) : (
                              <p className="text-gray-400 italic">No additional description provided</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Icon icon="solar:letter-broken" width="18" height="18" className="text-[#b08b2e]" />
                          Short Message (sm)
                        </label>
                        {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                          <input
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                            value={project.sm || ""}
                            onChange={e => (isEdit || isAdd) ? onChange && onChange("sm", e.target.value) : handleEditChange("sm", e.target.value)}
                            placeholder="Enter short message..."
                            disabled={isPreview && !isEditing}
                          />
                        ) : (
                          <div className="text-gray-700">
                            {project.sm ? (
                              <SafeText>{project.sm}</SafeText>
                            ) : (
                              <span className="text-gray-400 italic">No short message provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* iFrame & 360 Tab */}
          <div className={`${activeTab === 'iframe360' ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
            {activeTab === 'iframe360' && (
              <div id="iframe360" className="mb-8 w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Icon icon="solar:video-library-bold" width="24" height="24" className="text-[#b08b2e]" />
                      Media & Embeds
                    </h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon icon="solar:video-library-broken" width="20" height="20" className="text-[#b08b2e]" />
                          <h4 className="text-lg font-semibold text-gray-800">iFrame Links</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {(Array.isArray(project.iframeSrc) ? project.iframeSrc : project.iframeSrc ? [project.iframeSrc] : []).map((src, idx, arr) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              {((isPreview && isEditing) || (isEdit || isAdd)) ? (
                                <>
                                  <input
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                                    value={src}
                                    placeholder={`iFrame Link #${idx + 1}`}
                                    onChange={e => {
                                      const newArr = [...arr];
                                      newArr[idx] = e.target.value;
                                      (isEdit || isAdd) ? onChange && onChange("iframeSrc", newArr) : handleEditChange("iframeSrc", newArr);
                                    }}
                                    disabled={isPreview && !isEditing}
                                  />
                                  <button
                                    type="button"
                                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                                    onClick={() => {
                                      const newArr = arr.filter((_, i) => i !== idx);
                                      (isEdit || isAdd) ? onChange && onChange("iframeSrc", newArr) : handleEditChange("iframeSrc", newArr);
                                    }}
                                    aria-label="Remove iFrame link"
                                    disabled={arr.length === 1}
                                  >
                                    <Icon icon="solar:trash-bin-trash-broken" width="20" height="20" />
                                  </button>
                                </>
                              ) : (
                                <div className="flex-1 text-gray-700 font-mono text-sm break-all">
                                  <SafeText>{src || <span className="text-gray-400 italic">No link provided</span>}</SafeText>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {((isPreview && isEditing) || (isEdit || isAdd)) && (
                            <button
                              type="button"
                              className="mt-2 px-4 py-2 rounded-lg bg-[#b08b2e] text-white font-medium hover:bg-[#a07a1e] transition flex items-center gap-2"
                              onClick={() => {
                                const arr = Array.isArray(project.iframeSrc) ? project.iframeSrc : project.iframeSrc ? [project.iframeSrc] : [];
                                (isEdit || isAdd) ? onChange && onChange("iframeSrc", [...arr, ""]) : handleEditChange("iframeSrc", [...arr, ""]);
                              }}
                            >
                              <Icon icon="solar:add-circle-broken" width="20" height="20" />
                              Add iFrame Link
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon icon="solar:rotate-360-broken" width="20" height="20" className="text-[#b08b2e]" />
                          <h4 className="text-lg font-semibold text-gray-800">360° Livetour Links</h4>
                        </div>
                        
                        <div className="space-y-3">
                          {(Array.isArray(project.tours360) ? project.tours360 : project.tours360 ? [project.tours360] : []).map((link, idx, arr) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              {((isPreview && isEditing) || (isEdit || isAdd)) ? (
                                <>
                                  <input
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#b08b2e]/20 focus:border-[#b08b2e] outline-none transition"
                                    value={link || ''}
                                    placeholder={`360° Link #${idx + 1}`}
                                    onChange={e => {
                                      const newArr = [...arr];
                                      newArr[idx] = e.target.value;
                                      (isEdit || isAdd) ? onChange && onChange("tours360", newArr) : handleEditChange("tours360", newArr);
                                    }}
                                    disabled={isPreview && !isEditing}
                                  />
                                  <button
                                    type="button"
                                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition"
                                    onClick={() => {
                                      const newArr = arr.filter((_, i) => i !== idx);
                                      (isEdit || isAdd) ? onChange && onChange("tours360", newArr) : handleEditChange("tours360", newArr);
                                    }}
                                    aria-label="Remove 360 link"
                                    disabled={arr.length === 1}
                                  >
                                    <Icon icon="solar:trash-bin-trash-broken" width="20" height="20" />
                                  </button>
                                </>
                              ) : (
                                <div className="flex-1 text-gray-700 font-mono text-sm break-all">
                                  {link ? (
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      <SafeText>{link}</SafeText>
                                    </a>
                                  ) : (
                                    <span className="text-gray-400 italic">No link provided</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {((isPreview && isEditing) || (isEdit || isAdd)) && (
                            <button
                              type="button"
                              className="mt-2 px-4 py-2 rounded-lg bg-[#b08b2e] text-white font-medium hover:bg-[#a07a1e] transition flex items-center gap-2"
                              onClick={() => {
                                const arr = Array.isArray(project.tours360) ? project.tours360 : project.tours360 ? [project.tours360] : [];
                                (isEdit || isAdd) ? onChange && onChange("tours360", [...arr, ""]) : handleEditChange("tours360", [...arr, ""]);
                              }}
                            >
                              <Icon icon="solar:add-circle-broken" width="20" height="20" />
                              Add 360° Link
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Showcase Tab */}
          <div className={`${activeTab === 'image-showcase' ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
            {activeTab === 'image-showcase' && (
              <div id="image-showcase" className="mb-8 w-full max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Icon icon="solar:gallery-bold" width="24" height="24" className="text-[#b08b2e]" />
                        Image Gallery
                      </h3>
                      
                      {((isPreview && isEditing) || (isEdit || isAdd)) && (
                        <label className="px-4 py-2 rounded-lg bg-[#b08b2e] text-white font-medium hover:bg-[#a07a1e] transition cursor-pointer flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0] && onGalleryUpload) {
                                onGalleryUpload(e.target.files[0]);
                              }
                            }} 
                            disabled={isPreview && !isEditing}
                          />
                          <Icon icon="solar:gallery-add-broken" width="20" height="20" />
                          Add Image
                        </label>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {(project.gallery || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <CachedImage src={img} alt={`Gallery ${idx + 1}`} className="h-40" />
                          {((isPreview && isEditing) || (isEdit || isAdd)) && (
                            <button
                              className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                              onClick={() => {
                                const newGallery = [...(project.gallery || [])];
                                newGallery.splice(idx, 1);
                                (isEdit || isAdd) ? onChange && onChange("gallery", newGallery) : handleEditChange("gallery", newGallery);
                              }}
                              aria-label="Remove image"
                            >
                              <Icon icon="solar:trash-bin-trash-broken" width="16" height="16" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {(!project.gallery || project.gallery.length === 0) && (
                        <div className="col-span-full text-center py-12">
                          <Icon icon="solar:gallery-broken" width="48" height="48" className="text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            {((isPreview && isEditing) || (isEdit || isAdd)) 
                              ? "No images in gallery. Add images to showcase your project." 
                              : "No images available in gallery."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailContainer;