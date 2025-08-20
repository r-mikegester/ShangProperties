import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import { Modal } from "../../components/Modal";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAdminToolbar } from "../../context/AdminToolbarContext";
import { useProjects } from "../../hooks/useProjects";
import ProjectDetailContainer from "../../components/admin/ProjectDetailContainer";

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
  // Register toolbar actions so AdminLayout's NavBar can trigger them
  const { setToolbarState, resetToolbarState } = useAdminToolbar();
  
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
  const [showArchive, setShowArchive] = useState(false);
  const [selectedArchivedProject, setSelectedArchivedProject] = useState<Project | null>(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [desktopPreviewProject, setDesktopPreviewProject] = useState<Project | null>(null);

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
  const projectList = useMemo(() => showArchive ? archiveProjects : projects, [showArchive, archiveProjects, projects]);

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

  // Wire navbar tools to this page's actions
  useEffect(() => {
    setToolbarState({
      onProjectAdd: () => {
        setAddMode(true);
        setSelectedId(null);
        setAddData(emptyProject);
      },
      onProjectToggleArchive: () => setShowArchive((v) => !v),
      isProjectArchive: showArchive,
      onToggleMenu: () => setShowSidebarMobile((v) => !v),
    });
    return () => {
      resetToolbarState();
    };
  }, [setToolbarState, resetToolbarState, showArchive]);

  // Keep isProjectArchive in sync when toggled elsewhere
  useEffect(() => {
    setToolbarState({ isProjectArchive: showArchive });
  }, [showArchive, setToolbarState]);

  // Fetch projects from Firestore
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch archive projects
  useEffect(() => {
    if (!showArchive) return;
    fetchArchiveProjects();
    // Clear selection when toggling archive mode
    setSelectedId(null);
    setEditData({});
    setAddMode(false);
    setSelectedArchivedProject(null);
  }, [showArchive, fetchArchiveProjects]);

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

  // Sidebar animation variants
  const sidebarVariants = useMemo(() => ({
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { staggerChildren: 0.05 } },
  }), []);

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
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen overflow-hidden w-full">
      {/* Sidebar: Drawer on mobile, static on desktop */}
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden"
        initial={false}
        animate="animate"
        variants={sidebarVariants}
      >
        <div className="contents">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2
              className="text-xl font-bold text-[#b08b2e] cursor-pointer select-none"
              onClick={() => {
                setSelectedId(null);
                setSelectedArchivedProject(null);
                setAddMode(false);
              }}
            >
              {showArchive ? 'Archived Projects' : 'Projects'}
            </h2>
            {!showArchive && (
              <button
                className={`px-2 py-2 rounded-lg font-semibold transition ${addMode ? 'bg-[#a07a1e] text-white' : 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'}`}
                onClick={() => {
                  setAddMode(true);
                  setSelectedId(null);
                  setAddData(emptyProject);
                }}
              >
                <Icon icon="solar:add-folder-broken" width="24" height="24" />
              </button>
            )}
            <button
              className={`px-4 py-2 rounded font-semibold shadow transition ${showArchive ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
              onClick={() => setShowArchive((v) => !v)}
            >
              {showArchive ? (
                <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
              ) : (
                <Icon icon="solar:archive-broken" width="24" height="24" />
              )}
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
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
                      <span className="font-medium text-slate-800">{project.title}</span>
                      <button
                        className="ml-auto px-2 py-1 rounded bg-[#b08b2e] text-white text-xs font-semibold hover:bg-[#a07a1e] transition"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await restoreProject(project);
                          setSelectedArchivedProject(null);
                        }}
                      >
                        Restore
                      </button>
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
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      layout
                    >
                      <img
                        src={project.image || "https://placehold.co/48x32?text=No+Image"}
                        alt={project.title}
                        className="w-12 h-8 object-cover rounded border"
                      />
                      <span className="font-medium text-slate-800">{project.title}</span>
                    </motion.div>
                  ))
              ))}
            </AnimatePresence>
            {showArchive
              ? (!archiveLoading && archiveProjects.length === 0 && (
                <div className="text-slate-400 text-center mt-8">No archived projects found.</div>
              ))
              : (projects.length === 0 && !loading && (
                <div className="text-slate-400 text-center mt-8">No projects found.</div>
              ))}
          </div>
        </div>
      </motion.aside>

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
              <h2 className="text-lg font-bold text-[#b08b2e]">{showArchive ? 'Archived Projects' : 'Projects'}</h2>
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
                          }}
                        >
                          Restore
                        </button>
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
              {showArchive
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
      <main className="flex flex-col items-center w-full overflow-hidden justify-start p-3 md:col-span-12">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-slate-500">Loading projects...</div>
        ) : (
          <>
            {/* MOBILE: Welcome page project selection grid and DragCloseDrawer for preview/add/archive */}
            <div className="w-full overflow-hidden">
              {/* Show project selection grid if not in add/edit/archive/preview mode */}
              {!addMode && !selectedId && !selectedArchivedProject && (
                <div className="w-full">
                  <h1 className="text-2xl font-bold text-[#b08b2e] mb-4 text-center">Select a Project</h1>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">

                    {projectList.map((project) => (
                      <button
                        key={project.id}
                        className="flex flex-col items-center bg-white rounded-lg shadow p-2 border border-[#b08b2e]/30 hover:border-[#b08b2e] transition"
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setWelcomePreviewProject(project);
                            setDrawerOpen(true);
                          } else {
                            setDesktopPreviewProject(project);
                          }
                        }}
                      >
                        <img
                          src={project.image || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23f0f0f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999">No Image</text></svg>`}
                          alt={project.title || "Project image"}
                          className="md:min-w-32 max-w-full md:min-h-44 h-44 w-32 max-h-full object-cover rounded-lg border" />

                        <span className="font-semibold text-[#b08b2e] text-center text-sm line-clamp-2">{project.title}</span>
                      </button>
                    ))}
                    {!showArchive && (
                      <button
                        type="button"
                        aria-label="Add new project"
                        className="flex flex-col items-center bg-white rounded-lg shadow p-2 border border-dashed border-[#b08b2e]/50 hover:border-[#b08b2e] transition focus:outline-none focus:ring-2 focus:ring-[#b08b2e]/40"
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setAddMode(true);
                          } else {
                            setAddMode(true);
                            setDesktopPreviewProject(null);
                          }
                        }}
                      >
                        <div className="w-full h-24 rounded mb-2 border-2 border-dashed border-[#b08b2e] grid place-content-center bg-[#b08b2e]/5">
                          <Icon icon="solar:add-folder-broken" width="28" height="28" className="text-[#b08b2e]" />
                        </div>
                        <span className="font-semibold text-[#b08b2e] text-center text-sm">Add Project</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* DragCloseDrawer for project preview */}
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
              
              {/* DragCloseDrawer for add mode (MOBILE ONLY) */}
              {typeof window !== 'undefined' && window.innerWidth < 768 && (
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
              )}
              
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
            
            {/* DESKTOP: Sidebar and main content as before */}
            <div className="hidden">
              {detailMode ? (
                <ProjectDetailContainer
                  mode={detailMode}
                  project={detailProject}
                  isArchived={selectedArchivedProject !== null}
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
                        
                        setAddData((d) => ({ ...d, gallery: [...(d.gallery || []), url] }));
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
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
                  <h1 className="text-3xl font-bold text-[#b08b2e] mb-4">Projects Management</h1>
                  <p className="text-slate-600 mb-2">Select a Project from the Project List to view or edit its details, or click the + button to add a new project.</p>
                  <p className="text-slate-400">You can also view archived projects by clicking the archive button.</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Desktop modal preview/add */}
        <AnimatePresence>
          {(!!desktopPreviewProject || addMode) && (
            <motion.div
              className="fixed inset-0 z-[4000] flex items-center justify-center bg-black/50 p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setDesktopPreviewProject(null); if (addMode) setAddMode(false); }}
            >
              <motion.div
                className="relative bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-xl overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
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
                <div className="h-full overflow-y-auto">
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

// Add ToastContainer to the main render
export default function ProjectsWithToast() {
  return (
    <>
      <ToastContainer position="top-center" />
      <Projects />
    </>
  );
}