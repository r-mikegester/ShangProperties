import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProjects } from "../../hooks/useProjects";
import ProjectDetailContainer from "../../components/admin/ProjectDetailContainer";
import SkeletonImage from "../../components/shared/SkeletonImage";
import LoadingIndicator from "../../components/admin/LoadingIndicator";

// Define the context shape
interface AdminContext {
  isProjectArchive: boolean;
  setIsProjectArchive: (value: boolean) => void;
  isProjectAddMode: boolean;
  setIsProjectAddMode: (value: boolean) => void;
  projectsViewMode: "grid" | "list";
  setProjectsViewMode: (value: "grid" | "list") => void;
}

interface Project {
  id: string;
  title: string;
  formalName?: string;
  description?: string;
  description2?: string;
  image?: string;
  iframeSrc?: string;
  address?: string;
  developer?: string;
  sm?: string;
  gallery?: string[];
  project_type?: string;
  productmix?: string;
  noofunits?: string;
  design_team?: string;
  tours360?: string[];
}

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

const Projects: React.FC = () => {
  // Get context from AdminLayout
  const context = useOutletContext<AdminContext>();

  // Use context values
  const {
    isProjectArchive,
    setIsProjectArchive,
    isProjectAddMode,
    setIsProjectAddMode,
    projectsViewMode,
    setProjectsViewMode
  } = context;

  // State and handlers
  const [welcomePreviewProject, setWelcomePreviewProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addData, setAddData] = useState<Omit<Project, "id">>(emptyProject);
  const [addMode, setAddMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [addUploadProgress, setAddUploadProgress] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [selectedArchivedProject, setSelectedArchivedProject] = useState<Project | null>(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [desktopPreviewProject, setDesktopPreviewProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use custom hook for project data management
  const {
    projects,
    loading,
    error,
    archiveProjects,
    archiveLoading,
    fetchProjects,
    fetchArchiveProjects,
    updateProject,
    addProject,
    archiveAndRemoveProject,
    restoreProject
  } = useProjects();

  // Memoize project list to prevent unnecessary re-renders
  const projectList = useMemo(() => isProjectArchive ? archiveProjects : projects, [isProjectArchive, archiveProjects, projects]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const isModalOpen = !!desktopPreviewProject || addMode || !!selectedArchivedProject || 
                       (selectedId && !addMode) || drawerOpen || showSidebarMobile;
    
    if (isModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [desktopPreviewProject, addMode, selectedArchivedProject, selectedId, drawerOpen, showSidebarMobile]);

  // Sync addMode with context - only update local state when context changes
  useEffect(() => {
    if (isProjectAddMode !== addMode) {
      setAddMode(isProjectAddMode);
    }
  }, [isProjectAddMode]);

  // Handle add mode change - only update context
  const handleAddModeChange = (newMode: boolean) => {
    if (isProjectAddMode !== newMode) {
      setIsProjectAddMode(newMode);
    }
  };



  // Sync viewMode with context - only update local state when context changes
  useEffect(() => {
    if (projectsViewMode !== viewMode) {
      setViewMode(projectsViewMode);
    }
  }, [projectsViewMode]);

  // Handle view mode change - only update context
  const handleViewModeChange = (newMode: "grid" | "list") => {
    if (projectsViewMode !== newMode) {
      setProjectsViewMode(newMode);
    }
  };


  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("projectsViewMode", viewMode);
  }, [viewMode]);

  // Fetch projects from Firestore
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch archive projects
  useEffect(() => {
    if (!isProjectArchive) return;
    fetchArchiveProjects();
    // Clear selection when toggling archive mode
    setSelectedId(null);
    setEditData({});
    setAddMode(false);
    setSelectedArchivedProject(null);
  }, [isProjectArchive, fetchArchiveProjects]);

  // When selectedId changes, update editData
  useEffect(() => {
    if (selectedId && !addMode) {
      const proj = projects.find((p) => p.id === selectedId);
      if (proj) setEditData({ ...proj });
    }
  }, [selectedId, projects, addMode]);

  // Handle field change with useCallback to prevent recreation
  const handleChange = useCallback((field: keyof Project, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Save changes to Firestore
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
    // Check if we have the required token
    const blobToken = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      throw new Error("Vercel Blob token is not configured. Please set VITE_BLOB_READ_WRITE_TOKEN in your environment variables.");
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("https://blob.vercel-storage.com", {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${blobToken}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload to Vercel Blob: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }, []);

  // Image upload for edit
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
      
      setEditData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      toast.update(toastId, {
        render: `Upload failed: ${(error as Error).message}`,
        type: "error",
        autoClose: 5000,
        progress: undefined,
      });
    }
  }, [selectedId, uploadToVercelBlob]);

  // Image upload for add
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
      
      setAddData((prev) => ({ ...prev, image: url }));
    } catch (error) {
      toast.update(toastId, {
        render: `Upload failed: ${(error as Error).message}`,
        type: "error",
        autoClose: 5000,
        progress: undefined,
      });
    }
  }, [uploadToVercelBlob]);

  // Remove project with archive
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


  const itemVariants = useMemo(() => ({
    initial: { opacity: 0 }, // Fade in
    animate: { opacity: 1 }, // Fully visible
    exit: { opacity: 0, transition: { duration: 0.3 } }, // Fade out
  }), []);

  // Stable onChange for add mode to prevent input focus loss
  const handleAddChange = useCallback((field: keyof Project, value: any) => {
    setAddData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Main content logic
  let detailMode: "add" | "edit" | "preview" | null = null;
  let detailProject: any = null;
  // Always show add form if addMode is true
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      <ToastContainer position="top-center" />
      
      {/* Mobile Bottom Sheet Project List */}
      <AnimatePresence>
        {showSidebarMobile && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[3999] bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#b08b2e]">{isProjectArchive ? 'Archived Projects' : 'Projects'}</h2>
              <button
                className="p-2 text-[#b08b2e]"
                onClick={() => setShowSidebarMobile(false)}
              >
                <Icon icon="solar:close-circle-broken" width="28" height="28" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <AnimatePresence>
                {projectList.map((project) => (
                  isProjectArchive && project
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
                          src={project.image || "https://placehold.co/48x32?text=No+Image"}
                          alt={project.title || "Project image"}
                          className="w-12 h-8 object-cover rounded border"
                        />
                        <span className="font-medium text-slate-800">{project.title}</span>
                        <button
                          className="ml-auto px-2 py-1 rounded bg-[#b08b2e] text-white text-xs font-semibold hover:bg-[#a07a1e] transition"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await restoreProject(project);
                            setSelectedArchivedProject(null);
                            setShowSidebarMobile(false);
                            return Promise.resolve();
                          }}
                        >
                          Restore
                        </button>
                      </div>
                    )
                    : (!isProjectArchive && project && (
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
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                      >
                        <img
                          src={project.image || "https://placehold.co/48x32?text=No+Image"}
                          alt={project.title || "Project image"}
                          className="w-12 h-8 object-cover rounded border"
                        />
                        <span className="font-medium text-slate-800">{project.title}</span>
                      </motion.div>
                    ))
                ))}
              </AnimatePresence>
              {isProjectArchive
                ? (!archiveLoading && archiveProjects.length === 0 && (
                  <div className="text-slate-400 text-center mt-8">No archived projects found.</div>
                ))
                : (projects.length === 0 && !loading && (
                  <div className="text-slate-400 text-center mt-8">No projects found.</div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col w-full overflow-hidden p-4 md:p-6">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
       

        {loading ? (
          <LoadingIndicator message="Loading projects..." />
        ) : (
          <div className="flex-1">
            {/* Show project selection grid if not in add/edit/archive/preview mode */}
            {!addMode && !selectedId && !selectedArchivedProject && (
              <div className="w-full">
                {projectList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                      <Icon icon="solar:file-text-bold" width="32" height="32" className="text-[#b08b2e]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {isProjectArchive ? 'No archived projects' : 'No projects yet'}
                    </h3>
                    <p className="text-gray-500 mb-4 text-center max-w-md">
                      {isProjectArchive 
                        ? 'There are no archived projects at the moment.' 
                        : 'Get started by creating your first project.'}
                    </p>
                    {!isProjectArchive && (
                      <button
                        className="px-4 py-2 bg-[#b08b2e] text-white rounded-lg font-semibold hover:bg-[#a07a1e] transition flex items-center gap-2"
                        onClick={() => setAddMode(true)}
                      >
                        <Icon icon="solar:add-circle-bold" width="20" height="20" />
                        Create Project
                      </button>
                    )}
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                     {!isProjectArchive && (
                      <button
                        className="flex flex-col items-center justify-center rounded-xl shadow-md border-2 border-dashed border-[#b08b2e]/30 hover:border-[#b08b2e] transition p-8 group"
                        onClick={() => handleAddModeChange(true)}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#b08b2e]/10 flex items-center justify-center group-hover:bg-[#b08b2e] transition mb-2">
                          <Icon icon="solar:add-circle-bold" width="28" height="28" className="text-[#b08b2e] group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-[#b08b2e]">Add Project</span>
                      </button>
                    )}
                    {projectList.map((project) => (
                      <motion.div
                        key={project.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-[#b08b2e]/30 hover:shadow-lg transition-all cursor-pointer relative"
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setWelcomePreviewProject(project);
                            setDrawerOpen(true);
                          } else {
                            setDesktopPreviewProject(project);
                          }
                        }}
                      >
                        <div className="relative"> {/* Aspect ratio container */}
                          <SkeletonImage
                            src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999">No Image</text></svg>`}
                            alt={project.title || "Project image"}
                            className="absolute inset-0 w-full h-40 object-cover"
                           
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999">No Image</text></svg>`;
                            }}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <h3 className="font-bold text-3xl text-white mb-2 truncate">{project.title}</h3>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                            <p className="text-white mt- text-xs">
                              {project.formalName || "No description"}
                            </p>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                   
                  </div>
                ) : (
                  // List view
                  <div className="bg-white pb-20 md:pb-0 rounded-xl shadow-md overflow-hidden">
                    {/* Desktop view header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-gray-500 font-semibold border-b">
                      <div className="col-span-3">Project</div>
                      <div className="col-span-2">Developer</div>
                      <div className="col-span-2">Design Team</div>
                      <div className="col-span-2">Product Mix</div>
                      <div className="col-span-1">Units</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    
                    {/* Mobile view header */}
                    <div className="md:hidden grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 text-gray-500 font-semibold border-b text-xs">
                      <div className="col-span-7">Project</div>
                      <div className="col-span-3">Details</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                    
                    {projectList.map((project) => (
                      <React.Fragment key={project.id}>
                        {/* Desktop view */}
                        <div 
                          className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => {
                            setDesktopPreviewProject(project);
                          }}
                        >
                          <div className="col-span-3 flex items-center gap-3">
                            <SkeletonImage
                              src={project.image || "https://placehold.co/48x32?text=No+Image"}
                              alt={project.title || "Project image"}
                              className="w-full h-40 object-cover rounded border"
                              // size={{ width: 48, height: 32 }}
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{project.title}</div>
                              <div className="text-sm text-gray-500 truncate">{project.formalName || "No formal name"}</div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center text-gray-700">
                            <span className="truncate">{project.developer || "N/A"}</span>
                          </div>
                          <div className="col-span-2 flex items-center text-gray-700">
                            <span className="truncate">{project.design_team || "N/A"}</span>
                          </div>
                          <div className="col-span-2 flex items-center text-gray-700">
                            <span className="truncate">{project.productmix || "N/A"}</span>
                          </div>
                          <div className="col-span-1 flex items-center text-gray-700">
                            {project.noofunits || "N/A"}
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <button 
                              className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDesktopPreviewProject(project);
                              }}
                            >
                              <Icon icon="solar:eye-bold" width="18" height="18" />
                            </button>
                            {isProjectArchive ? (
                              <button
                                className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  restoreProject(project);
                                }}
                              >
                                <Icon icon="solar:archive-unbroken" width="18" height="18" />
                              </button>
                            ) : (
                              <button
                                className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveAndRemoveProject(project.id);
                                }}
                              >
                                <Icon icon="solar:archive-broken" width="18" height="18" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Mobile view */}
                        <div 
                          className="md:hidden block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => {
                            setWelcomePreviewProject(project);
                            setDrawerOpen(true);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3 w-full">
                              <SkeletonImage
                                src={project.image || "https://placehold.co/48x32?text=No+Image"}
                                alt={project.title || "Project image"}
                                className="w-full h-full object-cover rounded border flex-shrink-0"
                                // size={{ width: 48, height: 32 }}
                                loading="lazy"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 truncate">{project.title}</div>
                                <div className="text-xs text-gray-500 truncate mb-1">{project.formalName || "No formal name"}</div>
                                
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {project.developer || "N/A"}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Units: {project.noofunits || "N/A"}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 truncate">
                                    {project.design_team || "N/A"}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 truncate">
                                    {project.productmix || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              <button 
                                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWelcomePreviewProject(project);
                                  setDrawerOpen(true);
                                }}
                              >
                                <Icon icon="solar:eye-bold" width="16" height="16" />
                              </button>
                              {isProjectArchive ? (
                                <button
                                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    restoreProject(project);
                                  }}
                                >
                                  <Icon icon="solar:archive-unbroken" width="16" height="16" />
                                </button>
                              ) : (
                                <button
                                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    archiveAndRemoveProject(project.id);
                                  }}
                                >
                                  <Icon icon="solar:archive-broken" width="16" height="16" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    {!isProjectArchive && (
                      <button
                        className="w-full py-4 flex items-center justify-center gap-2 text-[#b08b2e] hover:bg-gray-50 transition"
                        onClick={() => setAddMode(true)}
                      >
                        <Icon icon="solar:add-circle-bold" width="20" height="20" />
                        Add New Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Bottom Sheet Project Preview - REPLACED WITH DragCloseDrawer */}
            {/* DragCloseDrawer for project preview (ALL DEVICES) */}
            <DragCloseDrawer open={drawerOpen && !!welcomePreviewProject} setOpen={setDrawerOpen}>
              {welcomePreviewProject && (
                <ProjectDetailContainer
                  mode="preview"
                  project={welcomePreviewProject}
                  onChange={handleChange}
                  onSave={handleSave}
                  onClose={() => {
                    setDrawerOpen(false);
                    setTimeout(() => setWelcomePreviewProject(null), 300);
                  }}
                />
              )}
            </DragCloseDrawer>
            
            {/* Mobile Bottom Sheet Add Project - REPLACED WITH DragCloseDrawer */}
            {/* DragCloseDrawer for add mode (ALL DEVICES) */}
            <DragCloseDrawer open={addMode} setOpen={(open) => { if (!open) setAddMode(false); }}>
              <ProjectDetailContainer
                mode="add"
                project={addData}
                onChange={handleAddChange}
                onAdd={handleAdd}
                onImageUpload={handleAddImageUpload}
                onGalleryUpload={async (file) => {
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
                    
                    setAddData((d) => ({ ...d, gallery: [...(d.gallery || []), url] }));
                  } catch (error) {
                    toast.update(toastId, {
                      render: `Upload failed: ${(error as Error).message}`,
                      type: "error",
                      autoClose: 5000,
                      progress: undefined,
                    });
                  }
                }}
                loading={adding}
                addUploadProgress={addUploadProgress}
              />
            </DragCloseDrawer>
            
            {/* DragCloseDrawer for archive preview */}
            <DragCloseDrawer open={!!selectedArchivedProject} setOpen={(open) => { if (!open) setSelectedArchivedProject(null); }}>
              {selectedArchivedProject && (
                <ProjectDetailContainer
                  mode="preview"
                  project={selectedArchivedProject}
                  isArchived={true}
                  onClose={() => setSelectedArchivedProject(null)}
                />
              )}
            </DragCloseDrawer>
            
            {/* DragCloseDrawer for edit mode */}
            <DragCloseDrawer open={!!selectedId && !addMode} setOpen={(open) => { if (!open) setSelectedId(null); }}>
              {selectedId && (
                <ProjectDetailContainer
                  mode="edit"
                  project={editData}
                  onChange={handleChange}
                  onSave={handleSave}
                  onImageUpload={handleImageUpload}
                  onGalleryUpload={async (file) => {
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
                  }}
                  loading={saving}
                  uploadProgress={uploadProgress}
                  showRemoveModal={showRemoveModal}
                  setShowRemoveModal={setShowRemoveModal}
                  removing={removing}
                  onRemove={handleRemove}
                />
              )}
            </DragCloseDrawer>
          </div>
        )}
        
        {/* Desktop modal preview/add */}
        <AnimatePresence>
          {(!!desktopPreviewProject || addMode) && (
            <motion.div
              className="fixed inset-0 z-[4000] md:flex items-center justify-end bg-black/50 p-0 md:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setDesktopPreviewProject(null); if (addMode) setAddMode(false); }}
            >
              <motion.div
                className="relative bg-white w-full md:w-full h-full md:h-[90vh] md:rounded-xl shadow-xl overflow-hidden m-0 md:m-4"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  aria-label="Close"
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow"
                  onClick={() => { setDesktopPreviewProject(null); if (addMode) setAddMode(false); }}
                >
                  <Icon icon="solar:close-circle-broken" width="28" height="28" className="text-[#b08b2e]" />
                </button>
                <div className="h-full overflow-y-auto pt-12 md:pt-0">
                  {addMode ? (
                    <ProjectDetailContainer
                      mode="add"
                      project={addData}
                      onChange={handleAddChange}
                      onAdd={handleAdd}
                      onImageUpload={handleAddImageUpload}
                      onGalleryUpload={async (file) => {
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
                          
                          setAddData((d) => ({ ...d, gallery: [...(d.gallery || []), url] }));
                        } catch (error) {
                          toast.update(toastId, {
                            render: `Upload failed: ${(error as Error).message}`,
                            type: "error",
                            autoClose: 5000,
                            progress: undefined,
                          });
                        }
                      }}
                      loading={adding}
                      addUploadProgress={addUploadProgress}
                    />
                  ) : desktopPreviewProject ? (
                    <ProjectDetailContainer
                      mode="preview"
                      project={desktopPreviewProject}
                      isArchived={false}
                      onChange={handleChange}
                      onSave={handleSave}
                      onClose={() => setDesktopPreviewProject(null)}
                    />
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Projects;