import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { DragCloseDrawer } from "../../components/DragCloseDrawer";
import { Modal } from "../../components/Modal";
import { Icon } from "@iconify/react";
import { toast, ToastContainer, ToastOptions, Id as ToastId } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";

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
};

const Projects: React.FC = () => {
  // State and handlers
  const [projects, setProjects] = useState<Project[]>([]);
  // Welcome page preview drawer state
  const [welcomePreviewProject, setWelcomePreviewProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addData, setAddData] = useState<Omit<Project, "id">>(emptyProject);
  const [error, setError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [addUploadProgress, setAddUploadProgress] = useState<number | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archiveProjects, setArchiveProjects] = useState<Project[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [selectedArchivedProject, setSelectedArchivedProject] = useState<Project | null>(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(data);
        // Do not auto-select a project on load; show intro screen by default
        // if (data.length > 0 && !selectedId && !addMode && !selectedArchivedProject) {
        //   setSelectedId(data[0].id);
        //   setEditData({ ...data[0] });
        // }
      } catch (err: any) {
        setError(err.message || "Failed to fetch projects from Firestore.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  // Fetch archive projects
  useEffect(() => {
    if (!showArchive) return;
    setArchiveLoading(true);
    getDocs(collection(db, "archive")).then(snapshot => {
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setArchiveProjects(data);
      setArchiveLoading(false);
    });
    // Clear selection when toggling archive mode
    setSelectedId(null);
    setEditData({});
    setAddMode(false);
    setSelectedArchivedProject(null);
  }, [showArchive]);

  // When selectedId changes, update editData
  useEffect(() => {
    if (selectedId && !addMode) {
      const proj = projects.find((p) => p.id === selectedId);
      if (proj) setEditData({ ...proj });
    }
  }, [selectedId, projects, addMode]);

  // Handle field change
  const handleChange = (field: keyof Project, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes to Firestore
  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    const toastId: ToastId = toast.info("Saving project...", { autoClose: false });
    try {
      const data = { ...editData };
      delete data.id;
      // Simulate progress (since Firestore doesn't provide progress for updateDoc)
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        toast.update(toastId, { render: `Saving project... (${progress}%)`, autoClose: false });
      }, 200);
      await updateDoc(doc(db, "projects", selectedId), data);
      clearInterval(progressInterval);
      toast.update(toastId, { render: "Project saved!", type: "success", autoClose: 2000 });
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedId ? { ...p, ...data } : p))
      );
    } catch (err) {
      toast.update(toastId, { render: "Failed to save project!", type: "error", autoClose: 3000 });
      alert("Failed to save project: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Add new project
  const handleAdd = async () => {
    setAdding(true);
    try {
      const docRef = await addDoc(collection(db, "projects"), addData);
      setProjects((prev) => [...prev, { ...addData, id: docRef.id }]);
      setAddData(emptyProject); // Reset form after add
      // Stay in add mode, do not select the new project automatically
      // setAddMode(false); // Only exit add mode if user clicks a project
      // setSelectedId(docRef.id); // Do not auto-select
    } catch (err) {
      alert("Failed to add project: " + (err as Error).message);
    } finally {
      setAdding(false);
    }
  };

  // Upload image to Vercel Blob and return URL
  const uploadToVercelBlob = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    // You may need to set your Vercel Blob token here
    const res = await fetch("https://blob.vercel-storage.com/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        // 'Authorization': `Bearer YOUR_BLOB_TOKEN`,
      },
    });
    if (!res.ok) throw new Error("Failed to upload to Vercel Blob");
    const data = await res.json();
    return data.url || data.fileUrl || data.urlOrFileUrl; // adjust based on API response
  };

  // Image upload for edit
  const handleImageUpload = async (file: File) => {
    if (!selectedId) return;
    setUploadProgress(0);
    try {
      const url = await uploadToVercelBlob(file);
      setEditData((prev) => ({ ...prev, image: url }));
      setUploadProgress(null);
    } catch (error) {
      alert("Image upload failed: " + (error as Error).message);
      setUploadProgress(null);
    }
  };

  // Image upload for add
  const handleAddImageUpload = async (file: File) => {
    setAddUploadProgress(0);
    try {
      const url = await uploadToVercelBlob(file);
      setAddData((prev) => ({ ...prev, image: url }));
      setAddUploadProgress(null);
    } catch (error) {
      alert("Image upload failed: " + (error as Error).message);
      setAddUploadProgress(null);
    }
  };

  // Remove project with archive
  const handleRemove = async () => {
    if (!selectedId) return;
    setRemoving(true);
    try {
      // Archive the project
      const projectToArchive = projects.find((p) => p.id === selectedId);
      if (projectToArchive) {
        await setDoc(doc(db, "archive", selectedId), projectToArchive);
        await deleteDoc(doc(db, "projects", selectedId));
        setProjects((prev) => prev.filter((p) => p.id !== selectedId));
        setSelectedId(null);
        setEditData({});
      }
    } catch (err) {
      alert("Failed to archive/remove project: " + (err as Error).message);
    } finally {
      setRemoving(false);
      setShowRemoveModal(false);
    }
  };

  // Sidebar animation variants
  const sidebarVariants = {
    initial: { x: -40, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    initial: { opacity: 0 }, // Fade in
    animate: { opacity: 1 }, // Fully visible
    exit: { opacity: 0, transition: { duration: 0.3 } }, // Fade out
  };

  // Ensure correct type for sidebar project list
  const projectList: Project[] = showArchive ? archiveProjects : projects;

  // Stable onChange for add mode to prevent input focus loss
  const handleAddChange = React.useCallback((field: keyof Project, value: any) => {
    setAddData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ProjectDetailContainer must be INSIDE the Projects component to access state/handlers
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
  }) => {
    const isEdit = mode === "edit";
    const isAdd = mode === "add";
    const isPreview = mode === "preview";
    const [showImageUrl, setShowImageUrl] = React.useState(false);
    return (
      <div className="w-full max-w-full bg-white rounded-xl shadow-lg px-6 pb-6 pt-6 relative">

        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 mb-6">
          <div className="flex flex-col space-y-3 w-full">
            <div className="bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50 flex flex-col items-start justify-between p-3 rounded-xl space-x-3 h-full w-full">
              <div className="flex items-start justify-between space-x-3 w-full">
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex flex-col relative">
                    <img
                      src={project.image || "https://via.placeholder.com/120x80?text=No+Image"}
                      alt={project.title || "Project image"}
                      className="min-w-32 w-full  min-h-44 h-full object-cover rounded-lg border"
                    />
                    <label className="flex items-center justify-center absolute bottom-0 cursor-pointer border w-full rounded-b-lg border-[#b08b2e] py-2 hover:bg-[#b08b2e] bg-[#b08b2e]/50 text-white gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0] && onImageUpload) onImageUpload(e.target.files[0]);
                        }}
                      />
                      <span className="  font-bold text-xl"><Icon icon="solar:gallery-edit-broken" width="24" height="24" /></span>
                      {uploadProgress !== null && (
                        <div className="text-xs text-slate-500 mt-1">Uploading: {uploadProgress?.toFixed(0)}%</div>
                      )}
                      {addUploadProgress !== null && (
                        <div className="text-xs text-slate-500 mt-1">Uploading: {addUploadProgress?.toFixed(0)}%</div>
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
                <div className="">
                  {isPreview && (
                    <div className=" px-4 py-2 rounded-lg bg-gray-400 text-white font-semibold shadow select-none cursor-default">
                      Archived
                    </div>
                  )}
                  {isEdit && (
                    <div className=" flex flex-col gap-2">
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-gray-200 shadow text-[#b08b2e] font-semibold hover:bg-gray-300 transition"
                        onClick={() => setShowImageUrl && setShowImageUrl((v: boolean) => !v)}
                      >
                        {showImageUrl ?
                          (<Icon icon="material-symbols:link-rounded" width="24" height="24" />)
                          : (<Icon icon="line-md:link" width="24" height="24" />)}


                      </button>
                      <button
                        className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow"
                        onClick={onSave}
                        disabled={loading}
                      >

                        {loading ? "Saving..." : (<Icon icon="solar:folder-check-broken" width="24" height="24" />)}
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                        onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                        disabled={removing}
                      >
                        <Icon icon="solar:trash-bin-trash-broken" width="24" height="24" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-gray-200 shadow text-[#b08b2e] font-semibold hover:bg-gray-300 transition"
                        onClick={() => setShowImageUrl && setShowImageUrl((v: boolean) => !v)}
                      >
                        {showImageUrl ?
                          (<Icon icon="material-symbols:link-rounded" width="24" height="24" />)
                          : (<Icon icon="line-md:link" width="24" height="24" />)}


                      </button>

                    </div>
                  )}
                </div>
              </div>
              {showImageUrl && (
                <div className="my-2 w-full">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100 text-gray-500"
                    value={project.image || ""}
                    readOnly
                  />
                </div>
              )}
            </div>
            {isEdit || isAdd ? (
              <>
                <div className="flex flex-col space-y-3 ">

                  <div className="collapse-arrow collapse bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">360 Livetour Links</div>
                    <div className="collapse-content text-sm">
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">iFrame Src</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.iframeSrc || ""}
                          onChange={e => onChange && onChange("iframeSrc", e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Other 360 links</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.tours360 || ""}
                          onChange={e => onChange && onChange("tours360", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="collapse-arrow collapse bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Descriptions</div>
                    <div className="collapse-content text-sm">
                      <div className="flex flex-col min-h-96 h-full space-x-3 w-full">

                        <div className="mb-2 w-full">
                          <label className="block text-xs font-semibold  mb-1">Description</label>
                          <textarea
                            className="w-full border rounded px-2 py-1 min-h-[150px]"
                            value={project.description || ""}
                            onChange={e => onChange && onChange("description", e.target.value)}
                          />
                        </div>
                        <div className="mb-2 w-full">
                          <label className="block text-xs font-semibold  mb-1">Description 2</label>
                          <textarea
                            className="w-full border rounded px-2 py-1 min-h-[150px]"
                            value={project.description2 || ""}
                            onChange={e => onChange && onChange("description2", e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Short Message (sm)</label>
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={project.sm || ""}
                            onChange={e => onChange && onChange("sm", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="collapse-arrow collapse bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Project Details</div>
                    <div className="collapse-content text-sm">
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.address || ""}
                          onChange={e => onChange && onChange("address", e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Developer</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.developer || ""}
                          onChange={e => onChange && onChange("developer", e.target.value)}
                        />
                      </div>
                      <div className="flex w-full space-x-3">
                        <div className="mb-2 w-full">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Project Type</label>
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={project.project_type || ""}
                            onChange={e => onChange && onChange("project_type", e.target.value)}
                          />
                        </div>
                        <div className="mb-2 w-full">
                          <label className="block text-xs font-semibold text-slate-600 mb-1">No of Units</label>
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={project.noofunits || ""}
                            onChange={e => onChange && onChange("noofunits", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Product Mix</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.productmix || ""}
                          onChange={e => onChange && onChange("productmix", e.target.value)}
                        />
                      </div>



                      <div className="mb-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Design Team</label>
                        <input
                          className="w-full border rounded px-2 py-1"
                          value={project.design_team || ""}
                          onChange={e => onChange && onChange("design_team", e.target.value)}
                        />
                      </div>

                    </div>
                  </div>


                </div>




                {isEdit && showRemoveModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center animate-fadeIn">
                      <h2 className="text-xl font-bold mb-4 text-red-600">Archive & Remove Project?</h2>
                      <p className="mb-6 text-slate-700">Are you sure you want to remove this project? It will be moved to the archive and can be restored later.</p>
                      <div className="flex gap-4 justify-center">
                        <button
                          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                          onClick={() => setShowRemoveModal && setShowRemoveModal(false)}
                          disabled={removing}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                          onClick={onRemove}
                          disabled={removing}
                        >
                          {removing ? "Archiving..." : "Yes, Archive & Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    value={project.image || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">iFrame Src</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    value={project.iframeSrc || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded px-2 py-1 min-h-[60px] bg-gray-100"
                    value={project.description || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description 2</label>
                  <textarea
                    className="w-full border rounded px-2 py-1 min-h-[60px] bg-gray-100"
                    value={project.description2 || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    value={project.address || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Developer</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    value={project.developer || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Short Message (sm)</label>
                  <input
                    className="w-full border rounded px-2 py-1 bg-gray-100"
                    value={project.sm || ""}
                    readOnly
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Gallery Images</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {(project.gallery || []).map((img: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-20 object-cover rounded border" />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="mt-4 px-6 py-2 rounded bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition"
                  onClick={onClose}
                >
                  Close Preview
                </button>
              </>
            )}
          </div>
          <div className="collapse collapse-open bg-[#b08b2e]/30 shadow-md h-[80vh] w-full overflow-y-auto border-[#b08b2e]/50 border">
            <input type="checkbox" />
            <div className="collapse-title sticky top-0 z-10 bg-[#b08b2e]/30 font-semibold">Image Showcase</div>
            <div className="collapse-content text-sm">
              <div className="mb-2">
                {/* <label className="block text-xs font-semibold text-slate-600 mb-1">Gallery Images</label> */}
                <div className="grid grid-cols-3 gap-2 mb-2 h-full ">
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
            </div>
          </div>
        </div>

      </div>
    );
  };

  // Main content logic
  let detailMode: ProjectDetailMode | null = null;
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
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* Mobile Sidebar Toggle Button */}
      <div className="flex  w-full bg-white border-b border-slate-200 shadow-lg z-20">
        <button
          className="p-3 text-[#b08b2e] focus:outline-none"
          onClick={() => setShowSidebarMobile((v: boolean) => !v)}
        >
          <Icon icon="solar:hamburger-menu-broken" width="28" height="28" />
        </button>
        <h2 className="flex-1 text-xl font-bold text-[#b08b2e] py-3 text-center select-none">
          {showArchive ? 'Archived Projects' : 'Projects'}
        </h2>
        {!showArchive && (
          <button
            className={`px-2 py-2 my-2 mr-2 rounded-lg font-semibold transition ${addMode ? 'bg-[#a07a1e] text-white' : 'bg-[#b08b2e] text-white hover:bg-[#a07a1e]'}`}
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
          className={`px-4 py-2 my-2 rounded font-semibold shadow transition ${showArchive ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
          onClick={() => setShowArchive((v) => !v)}
        >
          {showArchive ? (
            <Icon icon="solar:archive-minimalistic-broken" width="24" height="24" />
          ) : (
            <Icon icon="solar:archive-broken" width="24" height="24" />
          )}
        </button>
      </div>
      {/* Sidebar: Drawer on mobile, static on desktop */}
      <motion.aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white border-r border-slate-200 flex-col py-6 px-2 gap-4 shadow-lg z-30 transition-transform duration-300 ${showSidebarMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}
        style={{ maxWidth: '90vw' }}
        initial={false}
        animate={showSidebarMobile ? 'animate' : 'initial'}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between mb-4 px-2 md:hidden">
          <button
            className="p-2 text-[#b08b2e]"
            onClick={() => setShowSidebarMobile(false)}
          >
            <Icon icon="solar:close-circle-broken" width="28" height="28" />
          </button>
        </div>
        <div className="flex items-center justify-between mb-4 px-2 md:flex">
          <h2
            className="text-xl font-bold text-[#b08b2e] cursor-pointer select-none"
            onClick={() => {
              setSelectedId(null);
              setSelectedArchivedProject(null);
              setAddMode(false);
              setShowSidebarMobile(false);
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
                setShowSidebarMobile(false);
              }}
            >
              <Icon icon="solar:add-folder-broken" width="24" height="24" />
            </button>
          )}
          <button
            className={`px-4 py-2 rounded font-semibold shadow transition ${showArchive ? 'bg-[#b08b2e] text-white' : 'bg-gray-200 text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
            onClick={() => { setShowArchive((v) => !v); setShowSidebarMobile(false); }}
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
            {(projectList as Project[]).map((project) => (
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
                      src={project.image || "https://via.placeholder.com/48x32?text=No+Image"}
                      alt={project.title}
                      className="w-12 h-8 object-cover rounded border"
                    />
                    <span className="font-medium text-slate-800">{project.title}</span>
                    <button
                      className="ml-auto px-2 py-1 rounded bg-[#b08b2e] text-white text-xs font-semibold hover:bg-[#a07a1e] transition"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await setDoc(doc(db, 'projects', project.id), project);
                        await deleteDoc(doc(db, 'archive', project.id));
                        setArchiveProjects((prev) => prev.filter((ap) => ap.id !== project.id));
                        setProjects((prev) => [...prev, project]);
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
                      src={project.image || "https://via.placeholder.com/48x32?text=No+Image"}
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
      </motion.aside>
      {/* Main content */}
      <main className="flex flex-col items-center w-full justify-start p-3">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-slate-500">Loading projects...</div>
        ) : (
          <>
            {/* MOBILE: Welcome page project selection grid and DragCloseDrawer for preview/add/archive */}
            <div className="block md:hidden w-full">
              {/* Show project selection grid if not in add/edit/archive/preview mode */}
              {!addMode && !selectedId && !selectedArchivedProject && (
                <div className="w-full">
                  <h1 className="text-2xl font-bold text-[#b08b2e] mb-4 text-center">Select a Project</h1>
                  <div className="grid grid-cols-2 gap-4 p-2">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        className="flex flex-col items-center bg-white rounded-lg shadow p-2 border border-[#b08b2e]/30 hover:border-[#b08b2e] transition"
                        onClick={() => {
                          setWelcomePreviewProject(project);
                          setDrawerOpen(true);
                        }}
                      >
                        <img
                          src={project.image || "https://via.placeholder.com/120x80?text=No+Image"}
                          alt={project.title}
                          className="w-full h-24 object-cover rounded mb-2 border"
                        />
                        <span className="font-semibold text-[#b08b2e] text-center text-sm line-clamp-2">{project.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* DragCloseDrawer for project preview */}
              <DragCloseDrawer open={drawerOpen && !!welcomePreviewProject} setOpen={setDrawerOpen}>
                {welcomePreviewProject && (
                  <ProjectDetailContainer
                    mode="preview"
                    project={welcomePreviewProject}
                    onClose={() => {
                      setDrawerOpen(false);
                      setTimeout(() => setWelcomePreviewProject(null), 300);
                    }}
                  />
                )}
              </DragCloseDrawer>
              {/* DragCloseDrawer for add mode */}
              <DragCloseDrawer open={addMode} setOpen={(open) => { if (!open) setAddMode(false); }}>
                <ProjectDetailContainer
                  mode="add"
                  project={addData}
                  onChange={handleAddChange}
                  onAdd={handleAdd}
                  onImageUpload={handleAddImageUpload}
                  onGalleryUpload={async (file) => {
                    setAddUploadProgress(0);
                    try {
                      const url = await uploadToVercelBlob(file);
                      setAddData((d) => ({ ...d, gallery: [...(d.gallery || []), url] }));
                    } catch (error) {
                      alert("Gallery image upload failed: " + (error as Error).message);
                    }
                    setAddUploadProgress(null);
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
                      setUploadProgress(0);
                      try {
                        const url = await uploadToVercelBlob(file);
                        handleChange("gallery", [...(editData.gallery || []), url]);
                      } catch (error) {
                        alert("Gallery image upload failed: " + (error as Error).message);
                      }
                      setUploadProgress(null);
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
            <div className="hidden md:block w-full">
              {detailMode ? (
                <ProjectDetailContainer
                  mode={detailMode}
                  project={detailProject}
                  onChange={detailMode === "add" ? handleAddChange : detailMode === "edit" ? handleChange : undefined}
                  onSave={detailMode === "edit" ? handleSave : undefined}
                  onAdd={detailMode === "add" ? handleAdd : undefined}
                  onImageUpload={detailMode === "add" ? handleAddImageUpload : detailMode === "edit" ? handleImageUpload : undefined}
                  onGalleryUpload={detailMode === "add"
                    ? async (file) => {
                      setAddUploadProgress(0);
                      try {
                        const url = await uploadToVercelBlob(file);
                        setAddData((d) => ({ ...d, gallery: [...(d.gallery || []), url] }));
                      } catch (error) {
                        alert("Gallery image upload failed: " + (error as Error).message);
                      }
                      setAddUploadProgress(null);
                    }
                    : detailMode === "edit"
                      ? async (file) => {
                        setUploadProgress(0);
                        try {
                          const url = await uploadToVercelBlob(file);
                          handleChange("gallery", [...(editData.gallery || []), url]);
                        } catch (error) {
                          alert("Gallery image upload failed: " + (error as Error).message);
                        }
                        setUploadProgress(null);
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
