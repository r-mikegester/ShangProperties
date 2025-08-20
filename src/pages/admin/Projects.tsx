import React, { useEffect, useState, useCallback, useMemo } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import { Modal } from "../../components/Modal";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";
import { useAdminToolbar } from "../../context/AdminToolbarContext";
import { useProjects } from "../../hooks/useProjects";
import { Project } from "../../types/Project";
import { put } from '@vercel/blob';

// Define the empty project structure
const emptyProject: Omit<Project, "id"> = {
  title: "",
  formalName: "",
  description: "",
  description2: "",
  image: "",
  iframeSrc: "",
  address: "",
  developer: "",
  sm: "",
  gallery: [],
  project_type: "",
  productmix: "",
  noofunits: "",
  design_team: "",
  tours360: [],
};

// Define types for our component
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

// Project detail component
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
  const [activeTab, setActiveTab] = useState<'project-details' | 'descriptions' | 'iframe360' | 'image-showcase'>('project-details');

  return (
    <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh] bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-full hover:bg-slate-100"
          >
            <Icon icon="solar:close-circle-broken" width="24" height="24" className="text-slate-500" />
          </button>
          <h2 className="text-xl font-bold text-[#b08b2e]">
            {isEdit ? "Edit Project" : isAdd ? "Add Project" : project.title}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {isEdit && !isArchived && (
            <button
              onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
              className="p-2 rounded-full hover:bg-red-50 text-red-500"
            >
              <Icon icon="solar:trash-bin-trash-broken" width="24" height="24" />
            </button>
          )}
          {(isEdit || isAdd) && !isArchived && (
            <button
              onClick={isEdit ? onSave : onAdd}
              disabled={loading}
              className="px-4 py-2 bg-[#b08b2e] text-white rounded-lg hover:bg-[#b08b2e]/90 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Icon icon="svg-spinners:bars-scale-fade" width="20" height="20" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:save-bold" width="20" height="20" />
                  <span className="ml-2">Save</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'project-details' ? 'border-b-2 border-[#b08b2e] text-[#b08b2e]' : 'text-slate-500'}`}
          onClick={() => setActiveTab('project-details')}
        >
          Project Details
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'descriptions' ? 'border-b-2 border-[#b08b2e] text-[#b08b2e]' : 'text-slate-500'}`}
          onClick={() => setActiveTab('descriptions')}
        >
          Descriptions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'iframe360' ? 'border-b-2 border-[#b08b2e] text-[#b08b2e]' : 'text-slate-500'}`}
          onClick={() => setActiveTab('iframe360')}
        >
          iFrame & 360
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === 'image-showcase' ? 'border-b-2 border-[#b08b2e] text-[#b08b2e]' : 'text-slate-500'}`}
          onClick={() => setActiveTab('image-showcase')}
        >
          Image Showcase
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Project Details Tab */}
        {activeTab === 'project-details' && (
          <div className="mb-8">
            <div className="bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50 flex items-start justify-between p-3 rounded-xl space-x-3 h-full w-full">
              <div>
                <div className="flex items-start justify-between space-x-3 w-full">
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex flex-col relative">
                      <img
                        src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999">No Image</text></svg>`}
                        alt={project.title || "Project image"}
                        className="md:min-w-32 max-w-full md:min-h-44 h-44 w-32 max-h-full object-cover rounded-lg border"
                      />
                      <label className="flex items-center justify-center absolute bottom-0 cursor-pointer border w-full rounded-b-lg border-[#b08b2e] py-2 hover:bg-[#b08b2e] bg-[#b08b2e]/50 text-white gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0] && onImageUpload) {
                              onImageUpload(e.target.files[0]);
                            }
                          }}
                        />
                        <span className="font-bold text-xl">
                          <Icon icon="solar:gallery-edit-broken" width="24" height="24" />
                        </span>
                        {uploadProgress !== null && (
                          <div className="text-xs text-white mt-1">
                            <span className="hidden md:block">Uploading:</span> {uploadProgress?.toFixed(0)}%
                          </div>
                        )}
                        {addUploadProgress !== null && (
                          <div className="text-xs text-white mt-1">
                            <span className="hidden md:block">Uploading:</span> {addUploadProgress?.toFixed(0)}%
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="flex flex-col w-56">
                      {(isEdit || isAdd) ? (
                        <>
                          <input
                            className="text-3xl font-bold text-[#b08b2e] mb-1 bg-transparent border-none focus:ring-0 p-0 outline-none"
                            style={{ outline: "none" }}
                            value={project.title || ""}
                            onChange={e => onChange && onChange("title", e.target.value)}
                            placeholder="Project Title"
                            maxLength={100}
                          />
                          <input
                            className="text-slate-500 text-sm bg-transparent border-none focus:ring-0 p-0 outline-none"
                            style={{ outline: "none" }}
                            value={project.formalName || ""}
                            onChange={e => onChange && onChange("formalName", e.target.value)}
                            placeholder="Formal Name"
                            maxLength={100}
                          />
                        </>
                      ) : (
                        <>
                          <h1 className="text-3xl font-bold text-[#b08b2e] mb-1">{project.title}</h1>
                          <div className="text-slate-500 text-sm">{project.formalName}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                {(isEdit || isAdd) ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.address || ""}
                    onChange={e => onChange && onChange("address", e.target.value)}
                    placeholder="Project Address"
                  />
                ) : (
                  <div className="text-slate-900">{project.address}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Developer</label>
                {(isEdit || isAdd) ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.developer || ""}
                    onChange={e => onChange && onChange("developer", e.target.value)}
                    placeholder="Project Developer"
                  />
                ) : (
                  <div className="text-slate-900">{project.developer}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Social Media</label>
                {(isEdit || isAdd) ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.sm || ""}
                    onChange={e => onChange && onChange("sm", e.target.value)}
                    placeholder="Social Media Link"
                  />
                ) : (
                  <div className="text-slate-900">{project.sm}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Type</label>
                {(isEdit || isAdd) ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.project_type || ""}
                    onChange={e => onChange && onChange("project_type", e.target.value)}
                    placeholder="Project Type"
                  />
                ) : (
                  <div className="text-slate-900">{project.project_type}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Descriptions Tab */}
        {activeTab === 'descriptions' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                {(isEdit || isAdd) ? (
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.description || ""}
                    onChange={e => onChange && onChange("description", e.target.value)}
                    placeholder="Project Description"
                  />
                ) : (
                  <div className="text-slate-900 whitespace-pre-line">{project.description}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Description</label>
                {(isEdit || isAdd) ? (
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.description2 || ""}
                    onChange={e => onChange && onChange("description2", e.target.value)}
                    placeholder="Additional Project Description"
                  />
                ) : (
                  <div className="text-slate-900 whitespace-pre-line">{project.description2}</div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Mix</label>
                  {(isEdit || isAdd) ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                      value={project.productmix || ""}
                      onChange={e => onChange && onChange("productmix", e.target.value)}
                      placeholder="Product Mix"
                    />
                  ) : (
                    <div className="text-slate-900">{project.productmix}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Number of Units</label>
                  {(isEdit || isAdd) ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                      value={project.noofunits || ""}
                      onChange={e => onChange && onChange("noofunits", e.target.value)}
                      placeholder="Number of Units"
                    />
                  ) : (
                    <div className="text-slate-900">{project.noofunits}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Design Team</label>
                  {(isEdit || isAdd) ? (
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                      value={project.design_team || ""}
                      onChange={e => onChange && onChange("design_team", e.target.value)}
                      placeholder="Design Team"
                    />
                  ) : (
                    <div className="text-slate-900">{project.design_team}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iFrame & 360 Tab */}
        {activeTab === 'iframe360' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">iFrame Source</label>
                {(isEdit || isAdd) ? (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={project.iframeSrc || ""}
                    onChange={e => onChange && onChange("iframeSrc", e.target.value)}
                    placeholder="iFrame Source URL"
                  />
                ) : (
                  <div className="text-slate-900">{project.iframeSrc}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">360 Tours</label>
                {(isEdit || isAdd) ? (
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08b2e]"
                    value={(project.tours360 || []).join('\n')}
                    onChange={e => onChange && onChange("tours360", e.target.value.split('\n').filter(url => url.trim() !== ''))}
                    placeholder="Enter 360 Tour URLs (one per line)"
                  />
                ) : (
                  <div className="flex flex-col space-y-2">
                    {(project.tours360 || []).map((tour, idx) => (
                      <div key={idx} className="text-slate-900">{tour}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Image Showcase Tab */}
        {activeTab === 'image-showcase' && (
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-[#b08b2e] rounded cursor-pointer hover:bg-[#b08b2e]/10 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0] && onGalleryUpload) {
                      onGalleryUpload(e.target.files[0]);
                    }
                  }}
                />
                <span className="text-[#b08b2e] font-bold text-xl">+</span>
              </label>
              {(project.gallery || []).map((img: string, idx: number) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-40 h-40 object-cover rounded border" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <Modal open={true} onClose={() => setShowRemoveModal && setShowRemoveModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Removal</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to remove this project? This action will archive the project.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRemoveModal && setShowRemoveModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={onRemove}
                disabled={removing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {removing ? (
                  <>
                    <Icon icon="svg-spinners:bars-scale-fade" width="20" height="20" />
                    <span className="ml-2">Removing...</span>
                  </>
                ) : "Remove"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Main Projects component
const Projects: React.FC = () => {
  // State management
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [addData, setAddData] = useState<Omit<Project, "id">>(emptyProject);
  const [addMode, setAddMode] = useState(false);
  const [selectedArchivedProject, setSelectedArchivedProject] = useState<Project | null>(null);
  const [welcomePreviewProject, setWelcomePreviewProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [addUploadProgress, setAddUploadProgress] = useState<number | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [desktopPreviewProject, setDesktopPreviewProject] = useState<Project | null>(null);

  // Use the projects hook
  const { projects, archiveProjects, loading, fetchProjects, fetchArchiveProjects, addProject, updateProject, archiveAndRemoveProject } = useProjects();

  // Set up toolbar
  const { setToolbarState, resetToolbarState } = useAdminToolbar();

  // Filter projects based on archive view
  const projectList = showArchive ? archiveProjects : projects;
  console.log("Project list:", projectList, "Show archive:", showArchive, "Projects:", projects, "Archive projects:", archiveProjects);

  // Set up toolbar actions
  useEffect(() => {
    setToolbarState({
      onProjectAdd: () => {
        setAddMode(true);
        setSelectedId(null);
        setAddData(emptyProject);
      },
      onProjectToggleArchive: () => setShowArchive(v => !v),
      isProjectArchive: showArchive,
      onToggleMenu: () => setShowSidebarMobile(v => !v),
    });
    return () => {
      resetToolbarState();
    };
  }, [setToolbarState, resetToolbarState, showArchive]);

  // Keep toolbar in sync
  useEffect(() => {
    setToolbarState({ isProjectArchive: showArchive });
  }, [showArchive, setToolbarState]);

  // Fetch projects
  useEffect(() => {
    console.log("Fetching projects...");
    fetchProjects().then(() => {
      console.log("Projects fetched successfully");
    }).catch((error) => {
      console.error("Error fetching projects:", error);
    });
  }, [fetchProjects]);

  // Fetch archive projects
  useEffect(() => {
    if (!showArchive) return;
    console.log("Fetching archive projects...");
    fetchArchiveProjects().then(() => {
      console.log("Archive projects fetched successfully");
    }).catch((error) => {
      console.error("Error fetching archive projects:", error);
    });
    setSelectedId(null);
    setEditData({});
    setAddMode(false);
    setSelectedArchivedProject(null);
  }, [showArchive, fetchArchiveProjects]);

  // Update editData when selected project changes
  useEffect(() => {
    if (selectedId && !addMode) {
      const proj = projects.find(p => p.id === selectedId);
      if (proj) setEditData({ ...proj });
    }
  }, [selectedId, projects, addMode]);

  // Handle field changes
  const handleChange = useCallback((field: keyof Project, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Handle add field changes
  const handleAddChange = useCallback((field: keyof Project, value: any) => {
    setAddData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Save project changes
  const handleSave = useCallback(async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await updateProject(selectedId, editData);
      setSaving(false);
      toast.success("Project saved successfully!");
    } catch (error) {
      setSaving(false);
      toast.error("Failed to save project: " + (error as Error).message);
    }
  }, [selectedId, editData, updateProject]);

  // Add new project
  const handleAdd = useCallback(async () => {
    setAdding(true);
    try {
      const newProjectId = await addProject(addData);
      if (newProjectId) {
        setAddData(emptyProject);
        toast.success("Project added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add project: " + (error as Error).message);
    }
    setAdding(false);
  }, [addData, addProject]);

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

  // Handle image upload for edit mode
  const handleImageUpload = useCallback(async (file: File) => {
    if (!selectedId) return;

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

      setEditData(prev => ({ ...prev, image: url }));
    } catch (error) {
      toast.update(toastId, {
        render: `Upload failed: ${(error as Error).message}`,
        type: "error",
        autoClose: 5000,
        progress: undefined,
      });
    }
  }, [selectedId, uploadToVercelBlob]);

  // Handle image upload for add mode
  const handleAddImageUpload = useCallback(async (file: File) => {
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

      setAddData(prev => ({ ...prev, image: url }));
    } catch (error) {
      toast.update(toastId, {
        render: `Upload failed: ${(error as Error).message}`,
        type: "error",
        autoClose: 5000,
        progress: undefined,
      });
    }
  }, [uploadToVercelBlob]);

  // Handle remove project
  const handleRemove = useCallback(async () => {
    if (!selectedId) return;
    setRemoving(true);
    try {
      await archiveAndRemoveProject(selectedId);
      setSelectedId(null);
      setEditData({});
      toast.success("Project archived successfully!");
    } catch (error) {
      toast.error("Failed to archive project: " + (error as Error).message);
    }
    setRemoving(false);
    setShowRemoveModal(false);
  }, [selectedId, archiveAndRemoveProject]);

  // Main content logic
  let detailMode: ProjectDetailMode | null = null;
  let detailProject: any = null;

  if (addMode) {
    detailMode = "add";
    detailProject = addData;
  } else if (selectedArchivedProject) {
    detailMode = "preview";
    detailProject = selectedArchivedProject;
  } else if (selectedId && editData && !addMode) {
    detailMode = "edit";
    detailProject = editData;
  }

  // Sidebar animation variants
  const sidebarVariants = useMemo(() => ({
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { staggerChildren: 0.05 } },
  }), []);

  const itemVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }), []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden w-full">
      {/* Sidebar: Drawer on mobile, static on desktop */}
      <motion.aside 
        initial="initial"
        animate="animate"
        variants={sidebarVariants}
        className="hidden md:block md:col-span-4 w-64 lg:col-span-3 xl:col-span-2 h-full overflow-y-auto border-r border-slate-200 bg-white p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#b08b2e]">{showArchive ? 'Archived Projects' : 'Projects'}</h2>
          <button
            onClick={() => setShowArchive(v => !v)}
            className={`p-1 rounded ${showArchive ? 'bg-[#b08b2e] text-white' : 'text-[#b08b2e]'}`}
          >
            <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
          </button>
        </div>
        <div className="space-y-2">
             {!showArchive && (
            <button
              type="button"
              aria-label="Add new project"
              className="flex items-center w-full bg-white rounded-lg shadow p-2 border border-dashed border-[#b08b2e]/50 hover:border-[#b08b2e] transition focus:outline-none focus:ring-2 focus:ring-[#b08b2e]/40"
              onClick={() => {
                setAddMode(true);
                setSelectedId(null);
                setAddData(emptyProject);
              }}
            >
              <div className="w-full flex items-center justify-center py-2">
                <Icon icon="solar:add-circle-bold" width="24" height="24" className="text-[#b08b2e]" />
                <span className="ml-2 font-semibold text-[#b08b2e]">Add Project</span>
              </div>
            </button>
          )}
          <AnimatePresence>
            {projectList.map((project) => (
              showArchive && project
                ? (
                  <div
                    key={project.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-all border border-transparent hover:border-[#b08b2e] ${selectedArchivedProject && selectedArchivedProject.id === project.id ? "bg-[#b08b2e]/10 border-[#b08b2e]" : ""}`}
                    onClick={() => {
                      setSelectedArchivedProject(project);
                      setSelectedId(null);
                      setAddMode(false);
                    }}
                  >
                    <img
                      src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32"><rect width="48" height="32" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="6" fill="%23999">No Image</text></svg>`}
                      alt={project.title}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{project.title}</div>
                      <div className="text-xs text-slate-500 truncate">{project.formalName}</div>
                    </div>
                  </div>
                )
                : (!showArchive && project && (
                  <motion.div
                    key={project.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-all border border-transparent hover:border-[#b08b2e] ${selectedId === project.id && !addMode ? "bg-[#b08b2e]/10 border-[#b08b2e]" : ""}`}
                    onClick={() => {
                      setSelectedId(project.id);
                      setAddMode(false);
                      setSelectedArchivedProject(null);
                    }}
                    variants={itemVariants}
                  >
                    <img
                      src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32"><rect width="48" height="32" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="6" fill="%23999">No Image</text></svg>`}
                      alt={project.title}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{project.title}</div>
                      <div className="text-xs text-slate-500 truncate">{project.formalName}</div>
                    </div>
                  </motion.div>
                ))
            ))}
          </AnimatePresence>
        </div>
      </motion.aside>

      <AnimatePresence>
        {showSidebarMobile && (
          <DragCloseDrawer 
            open={showSidebarMobile} 
            setOpen={setShowSidebarMobile}
            drawerHeight="90vh"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-[#b08b2e]">{showArchive ? 'Archived Projects' : 'Projects'}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowArchive(v => !v)}
                    className={`p-1 rounded ${showArchive ? 'bg-[#b08b2e] text-white' : 'text-[#b08b2e]'}`}
                  >
                    <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
                  </button>
                  <button
                    className="p-2 text-[#b08b2e]"
                    onClick={() => setShowSidebarMobile(false)}
                  >
                    <Icon icon="solar:close-circle-broken" width="28" height="28" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 pb-16">
                <AnimatePresence>
                  {projectList.map((project) => (
                    showArchive && project
                      ? (
                        <div
                          key={project.id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-all border border-transparent hover:border-[#b08b2e] ${selectedArchivedProject && selectedArchivedProject.id === project.id ? "bg-[#b08b2e]/10 border-[#b08b2e]" : ""}`}
                          onClick={() => {
                            setSelectedArchivedProject(project);
                            setSelectedId(null);
                            setAddMode(false);
                            setShowSidebarMobile(false);
                          }}
                        >
                          <img
                            src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32"><rect width="48" height="32" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="6" fill="%23999">No Image</text></svg>`}
                            alt={project.title}
                            className="w-12 h-8 object-cover rounded border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate">{project.title}</div>
                            <div className="text-xs text-slate-500 truncate">{project.formalName}</div>
                          </div>
                        </div>
                      )
                      : (!showArchive && project && (
                        <motion.div
                          key={project.id}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 cursor-pointer transition-all border border-transparent hover:border-[#b08b2e] ${selectedId === project.id && !addMode ? "bg-[#b08b2e]/10 border-[#b08b2e]" : ""}`}
                          onClick={() => {
                            setSelectedId(project.id);
                            setAddMode(false);
                            setSelectedArchivedProject(null);
                            setShowSidebarMobile(false);
                          }}
                          variants={itemVariants}
                        >
                          <img
                            src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32" viewBox="0 0 48 32"><rect width="48" height="32" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="6" fill="%23999">No Image</text></svg>`}
                            alt={project.title}
                            className="w-12 h-8 object-cover rounded border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate">{project.title}</div>
                            <div className="text-xs text-slate-500 truncate">{project.formalName}</div>
                          </div>
                        </motion.div>
                      ))
                  ))}
                  {!showArchive && (
                    <button
                      type="button"
                      aria-label="Add new project"
                      className="flex items-center w-full bg-white rounded-lg shadow p-2 border border-dashed border-[#b08b2e]/50 hover:border-[#b08b2e] transition focus:outline-none focus:ring-2 focus:ring-[#b08b2e]/40"
                      onClick={() => {
                        setAddMode(true);
                        setSelectedId(null);
                        setAddData(emptyProject);
                        setShowSidebarMobile(false);
                      }}
                    >
                      <div className="w-full flex items-center justify-center py-2">
                        <Icon icon="solar:add-circle-bold" width="24" height="24" className="text-[#b08b2e]" />
                        <span className="ml-2 font-semibold text-[#b08b2e]">Add Project</span>
                      </div>
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </DragCloseDrawer>
        )}
      </AnimatePresence>

      {/* Main content area - Desktop */}
      <main className="hidden md:block md:col-span-8 lg:col-span-9 xl:col-span-10 h-[calc(100vh-5rem)] overflow-hidden">
        {/* Welcome view */}
        {!detailMode && (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md">
              <Icon icon="solar:documents-bold-duotone" width="64" height="64" className="text-[#b08b2e] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Projects Management</h1>
              <p className="text-slate-600 mb-6">
                {showArchive
                  ? "Browse your archived projects. Select a project to view its details."
                  : "Select a project from the list to view or edit its details, or add a new project."}
              </p>
              {!showArchive && (
                <button
                  onClick={() => {
                    setAddMode(true);
                    setSelectedId(null);
                    setAddData(emptyProject);
                  }}
                  className="px-6 py-3 bg-[#b08b2e] text-white rounded-lg hover:bg-[#b08b2e]/90 flex items-center mx-auto"
                >
                  <Icon icon="solar:add-circle-bold" width="24" height="24" />
                  <span className="ml-2">Add New Project</span>
                </button>
              )}
              <button
                onClick={() => setShowSidebarMobile(true)}
                className="mt-4 px-6 py-3 md:hidden border border-[#b08b2e] text-[#b08b2e] rounded-lg hover:bg-[#b08b2e]/10 flex items-center mx-auto"
              >
                <Icon icon="solar:list-broken" width="24" height="24" />
                <span className="ml-2">View Projects</span>
              </button>
            </div>
          </div>
        )}

        {/* Project detail view */}
        {detailMode && (
          <div className="h-full ml-10 p-4 overflow-y-auto">
            <ProjectDetailContainer
              mode={detailMode}
              project={detailProject}
              isArchived={!!selectedArchivedProject}
              onChange={detailMode === "add" ? handleAddChange : detailMode === "edit" ? handleChange : undefined}
              onSave={detailMode === "edit" ? handleSave : undefined}
              onAdd={detailMode === "add" ? handleAdd : undefined}
              onImageUpload={detailMode === "add" ? handleAddImageUpload : detailMode === "edit" ? handleImageUpload : undefined}
              onGalleryUpload={detailMode === "add"
                ? async (file) => {
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

                    setAddData(d => ({ ...d, gallery: [...(d.gallery || []), url] }));
                  } catch (error) {
                    toast.update(toastId, {
                      render: `Upload failed: ${(error as Error).message}`,
                      type: "error",
                      autoClose: 5000,
                      progress: undefined,
                    });
                  }
                }
                : detailMode === "edit"
                  ? async (file) => {
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

                    handleChange("gallery", [...(editData.gallery || []), url]);
                  } catch (error) {
                    toast.update(toastId, {
                      render: `Upload failed: ${(error as Error).message}`,
                      type: "error",
                      autoClose: 5000,
                      progress: undefined,
                    });
                  }
                }
                  : undefined}
              onRemove={detailMode === "edit" ? handleRemove : undefined}
              onClose={detailMode === "preview" ? () => setSelectedArchivedProject(null) : undefined}
              loading={detailMode === "add" ? adding : detailMode === "edit" ? saving : false}
              uploadProgress={uploadProgress}
              addUploadProgress={addUploadProgress}
              showRemoveModal={showRemoveModal}
              setShowRemoveModal={setShowRemoveModal}
              removing={removing}
            />
          </div>
        )}
      </main>

      {/* Mobile view */}
      <main className="md:hidden col-span-12 h-screen overflow-hidden">
        {/* Welcome view */}
        {!detailMode && !showSidebarMobile && (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md">
              <Icon icon="solar:documents-bold-duotone" width="64" height="64" className="text-[#b08b2e] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Projects Management</h1>
              <p className="text-slate-600 mb-6">
                {showArchive
                  ? "Browse your archived projects. Select a project to view its details."
                  : "Select a project from the list to view or edit its details, or add a new project."}
              </p>
              {!showArchive && (
                <button
                  onClick={() => {
                    setAddMode(true);
                    setSelectedId(null);
                    setAddData(emptyProject);
                  }}
                  className="px-6 py-3 bg-[#b08b2e] text-white rounded-lg hover:bg-[#b08b2e]/90 flex items-center mx-auto"
                >
                  <Icon icon="solar:add-circle-bold" width="24" height="24" />
                  <span className="ml-2">Add New Project</span>
                </button>
              )}
              <button
                onClick={() => setShowSidebarMobile(true)}
                className="mt-4 px-6 py-3 border border-[#b08b2e] text-[#b08b2e] rounded-lg hover:bg-[#b08b2e]/10 flex items-center mx-auto"
              >
                <Icon icon="solar:list-broken" width="24" height="24" />
                <span className="ml-2">View Projects</span>
              </button>
            </div>
          </div>
        )}

        {/* Project detail view */}
        {detailMode && (
          <div className="h-full">
            {/* Mobile drawer for project detail */}
            <DragCloseDrawer open={!!(selectedId || selectedArchivedProject || (addMode && window.innerWidth < 768))} setOpen={(open) => {
              if (!open) {
                if (addMode) setAddMode(false);
                if (selectedId) setSelectedId(null);
                if (selectedArchivedProject) setSelectedArchivedProject(null);
              }
            }}>
              {(selectedId || selectedArchivedProject || addMode) && (
                <ProjectDetailContainer
                  mode={detailMode}
                  project={detailProject}
                  isArchived={!!selectedArchivedProject}
                  onChange={detailMode === "add" ? handleAddChange : detailMode === "edit" ? handleChange : undefined}
                  onSave={detailMode === "edit" ? handleSave : undefined}
                  onAdd={detailMode === "add" ? handleAdd : undefined}
                  onImageUpload={detailMode === "add" ? handleAddImageUpload : detailMode === "edit" ? handleImageUpload : undefined}
                  onGalleryUpload={detailMode === "add"
                    ? async (file) => {
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

                        setAddData(d => ({ ...d, gallery: [...(d.gallery || []), url] }));
                      } catch (error) {
                        toast.update(toastId, {
                          render: `Upload failed: ${(error as Error).message}`,
                          type: "error",
                          autoClose: 5000,
                          progress: undefined,
                        });
                      }
                    }
                    : detailMode === "edit"
                      ? async (file) => {
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

                        handleChange("gallery", [...(editData.gallery || []), url]);
                      } catch (error) {
                        toast.update(toastId, {
                          render: `Upload failed: ${(error as Error).message}`,
                          type: "error",
                          autoClose: 5000,
                          progress: undefined,
                        });
                      }
                    }
                      : undefined}
                  onRemove={detailMode === "edit" ? handleRemove : undefined}
                  onClose={detailMode === "preview" ? () => setSelectedArchivedProject(null) : undefined}
                  loading={detailMode === "add" ? adding : detailMode === "edit" ? saving : false}
                  uploadProgress={uploadProgress}
                  addUploadProgress={addUploadProgress}
                  showRemoveModal={showRemoveModal}
                  setShowRemoveModal={setShowRemoveModal}
                  removing={removing}
                />
              )}
            </DragCloseDrawer>
          </div>
        )}
      </main>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Projects;