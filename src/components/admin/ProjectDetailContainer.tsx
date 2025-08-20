import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { SmoothHoverMenuItem } from "./SmoothHoverMenuItem";

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

  return (
    <div className="flex flex-col h-full">
      {/* Header for desktop modal with action buttons */}
      <div className="hidden md:flex absolute top-3 right-3 z-10 gap-2">
        {isEdit && (
          <button
            className="p-2 rounded-full bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center"
            onClick={onSave}
            disabled={loading}
            title="Save changes"
          >
            {loading ? (
              <span className="flex items-center">
                <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
              </span>
            ) : (
              <span className="flex items-center">
                <Icon icon="solar:diskette-save-bold" width="24" height="24" />
              </span>
            )}
          </button>
        )}
        {isAdd && (
          <button
            className="p-2 rounded-full bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center"
            onClick={onAdd}
            disabled={loading}
            title="Add project"
          >
            {loading ? (
              <span className="flex items-center">
                <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
              </span>
            ) : (
              <span className="flex items-center">
                <Icon icon="solar:add-square-bold" width="24" height="24" />
              </span>
            )}
          </button>
        )}
        {/* Edit/Save button for preview mode */}
        {isPreview && !isArchived && (
          !isEditing ? (
            <button
              className="p-2 rounded-full bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center"
              onClick={() => setIsEditing(true)}
              title="Edit project"
            >
              <span className="flex items-center">
                <Icon icon="solar:pen-bold" width="24" height="24" />
              </span>
            </button>
          ) : (
            <button
              className="p-2 rounded-full bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center"
              onClick={handleEditSave}
              disabled={loading}
              title="Save changes"
            >
              {loading ? (
                <span className="flex items-center">
                  <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
                </span>
              ) : (
                <span className="flex items-center">
                  <Icon icon="solar:diskette-save-bold" width="24" height="24" />
                </span>
              )}
            </button>
          )
        )}
        <button
          aria-label="Close"
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow"
          onClick={onClose}
          title="Close"
        >
          <Icon icon="solar:close-circle-bold" width="28" height="28" className="text-[#b08b2e]" />
        </button>
      </div>
      
      {/* Mobile top bar sidebar */}
      <nav className="md:hidden sticky top-0 z-30 w-full bg-white border-b border-gray-200 flex flex-col items-center py-2 px-0">
        <div className="flex flex-col w-full items-center gap-1 px-0">
          <div className="text-base font-bold text-[#b08b2e] hidden md:flex truncate mb-1 px-4 w-full text-center" title={project.title || 'New Project'}>
            {project.title || 'New Project'}
          </div>
          <div className="flex flex-row w-full justify-between gap-0 px-2">
            <button 
              type="button" 
              onClick={() => setActiveTab('project-details')} 
              className={`flex-1 flex flex-col items-center px-1 py-1 rounded-lg transition min-w-0 ${activeTab === 'project-details' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
            > 
              <Icon icon="solar:info-square-broken" width="22" height="22" />
              <span className="text-xs truncate">Details</span>
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('descriptions')} 
              className={`flex-1 flex flex-col items-center px-1 py-1 rounded-lg transition min-w-0 ${activeTab === 'descriptions' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
            > 
              <Icon icon="solar:file-text-broken" width="22" height="22" />
              <span className="text-xs truncate">Descriptions</span>
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('iframe360')} 
              className={`flex-1 flex flex-col items-center px-1 py-1 rounded-lg transition min-w-0 ${activeTab === 'iframe360' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
            > 
              <Icon icon="solar:window-frame-broken" width="22" height="22" />
              <span className="text-xs truncate">iFrame</span>
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('image-showcase')} 
              className={`flex-1 flex flex-col items-center px-1 py-1 rounded-lg transition min-w-0 ${activeTab === 'image-showcase' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-[#b08b2e] hover:bg-[#b08b2e]/10'}`}
            > 
              <Icon icon="solar:gallery-wide-broken" width="22" height="22" />
              <span className="text-xs truncate">Images</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main content area with sticky sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar - sticky and not scrollable */}
        <nav className="hidden md:block w-1/4 border-r border-gray-200 sticky top-0 self-start h-full">
          <div className="flex flex-col items-start py-8 gap-2 w-full">
            <div className="mb-6 w-full px-4">
              <div className="text-3xl font-bold text-[#b08b2e] truncate" title={project.title || 'New Project'}>
                {project.title || 'New Project'}
              </div>
            </div>
            <SmoothHoverMenuItem>
              <button 
                type="button" 
                onClick={() => setActiveTab('project-details')} 
                className={`w-full text-left py-2 px-4 rounded-md transition-colors ${activeTab === 'project-details' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-slate-500 hover:bg-[#b08b2e]/10'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon icon="solar:info-square-broken" width="24" height="24" />
                  <span className="font-medium">Project Details</span>
                </div>
              </button>
            </SmoothHoverMenuItem>
            <SmoothHoverMenuItem>
              <button 
                type="button" 
                onClick={() => setActiveTab('descriptions')} 
                className={`w-full text-left py-2 px-4 rounded-md transition-colors ${activeTab === 'descriptions' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-slate-500 hover:bg-[#b08b2e]/10'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon icon="solar:file-text-broken" width="24" height="24" />
                  <span className="font-medium">Descriptions</span>
                </div>
              </button>
            </SmoothHoverMenuItem>
            <SmoothHoverMenuItem>
              <button 
                type="button" 
                onClick={() => setActiveTab('iframe360')} 
                className={`w-full text-left py-2 px-4 rounded-md transition-colors ${activeTab === 'iframe360' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-slate-500 hover:bg-[#b08b2e]/10'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon icon="solar:window-frame-broken" width="24" height="24" />
                  <span className="font-medium">iFrame Links</span>
                </div>
              </button>
            </SmoothHoverMenuItem>
            <SmoothHoverMenuItem>
              <button 
                type="button" 
                onClick={() => setActiveTab('image-showcase')} 
                className={`w-full text-left py-2 px-4 rounded-md transition-colors ${activeTab === 'image-showcase' ? 'bg-[#b08b2e]/40 text-[#453610]' : 'text-slate-500 hover:bg-[#b08b2e]/10'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon icon="solar:gallery-wide-broken" width="24" height="24" />
                  <span className="font-medium">Image Showcase</span>
                </div>
              </button>
            </SmoothHoverMenuItem>
          </div>
        </nav>
        
        {/* Content area - scrollable */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          {/* Project Details Tab */}
          {activeTab === 'project-details' && (
            <div id="project-details" className="mb-8 w-full">
              <div className="bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50 flex flex-col items-start justify-between p-3 rounded-xl space-x-3 h-full w-full">
                <div className="flex items-start justify-between space-x-3 w-full">
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex flex-col relative">
                      <img
                        src={project.image || "https://placehold.co/120x80.png"}
                        alt={project.title || "Project image"}
                        className="md:min-w-32 max-w-full md:min-h-44 h-44 w-32 max-h-full object-cover rounded-lg border" 
                      />
                      <label className="flex items-center justify-center absolute bottom-0 cursor-pointer border w-full rounded-b-lg border-[#b08b2e] py-2 hover:bg-[#b08b2e] bg-[#b08b2e]/50 text-white gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0] && (isEdit || (isPreview && isEditing)) && onImageUpload) onImageUpload(e.target.files[0]);
                          }} 
                          disabled={isPreview && !isEditing}
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
                      {((isEdit || isAdd) || (isPreview && isEditing)) ? (
                        <>
                          <input
                            className="text-3xl font-bold text-[#b08b2e] mb-1 bg-transparent border-none focus:ring-0 p-0 outline-none"
                            style={{ outline: "none" }}
                            value={project.title || ""}
                            onChange={e => (isEdit || isAdd) ? onChange && onChange("title", e.target.value) : handleEditChange("title", e.target.value)}
                            placeholder="Project Title"
                            maxLength={100} 
                          />
                          <input
                            className="text-slate-500 text-sm bg-transparent border-none focus:ring-0 p-0 outline-none"
                            style={{ outline: "none" }}
                            value={project.formalName || ""}
                            onChange={e => (isEdit || isAdd) ? onChange && onChange("formalName", e.target.value) : handleEditChange("formalName", e.target.value)}
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
                  <div className="md:hidden flex flex-col gap-2">
                    {/* Show "Archived" indicator only for archived projects */}
                    {isArchived && (
                      <div className="px-4 py-2 rounded-lg bg-gray-400 text-white font-semibold shadow select-none cursor-default">
                        Archived
                      </div>
                    )}
                    {/* Edit/Save button for mobile preview mode */}
                    {isPreview && !isArchived && (
                      !isEditing ? (
                        <button
                          className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center"
                          onClick={() => setIsEditing(true)}
                        >
                          <Icon icon="solar:pen-bold" width="24" height="24" />
                        </button>
                      ) : (
                        <button
                          className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center"
                          onClick={handleEditSave}
                          disabled={loading}
                        >
                          {loading ? (
                            <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
                          ) : (
                            <Icon icon="solar:folder-check-broken" width="24" height="24" />
                          )}
                        </button>
                      )
                    )}
                    {(isEdit || isAdd) && (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          className="p-2 rounded-lg bg-gray-200 shadow text-[#b08b2e] font-semibold hover:bg-gray-300 transition"
                          onClick={() => setShowImageUrl(v => !v)}
                        >
                          {showImageUrl ?
                            (<Icon icon="material-symbols:link-rounded" width="24" height="24" />)
                            : (<Icon icon="line-md:link" width="24" height="24" />)}
                        </button>
                        {isEdit && (
                          <button
                            className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center"
                            onClick={onSave}
                            disabled={loading}
                          >
                            {loading ? (
                              <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
                            ) : (
                              <Icon icon="solar:folder-check-broken" width="24" height="24" />
                            )}
                          </button>
                        )}
                        {isAdd && (
                          <button
                            className="p-2 rounded-lg bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition shadow flex items-center justify-center"
                            onClick={onAdd}
                            disabled={loading}
                          >
                            {loading ? (
                              <Icon icon="svg-spinners:180-ring-with-bg" width="24" height="24" />
                            ) : (
                              <Icon icon="solar:add-folder-broken" width="24" height="24" />
                            )}
                          </button>
                        )}
                        {isEdit && (
                          <button
                            className="p-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow"
                            onClick={() => setShowRemoveModal && setShowRemoveModal(true)}
                            disabled={removing}
                          >
                            <Icon icon="solar:trash-bin-trash-broken" width="24" height="24" />
                          </button>
                        )}
                      </div>
                    )}
                    {onClose && (
                      <button
                        className="p-2 rounded-lg bg-gray-200 shadow text-[#b08b2e] font-semibold hover:bg-gray-300 transition"
                        onClick={onClose}
                      >
                        <Icon icon="solar:close-circle-broken" width="24" height="24" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Show "Archived" indicator only for archived projects - Desktop view */}
                {isArchived && (
                  <div className="hidden md:block px-4 py-2 rounded-lg bg-gray-400 text-white font-semibold shadow select-none cursor-default">
                    Archived
                  </div>
                )}
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
              <div className="collapse-arrow collapse bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50">
                <input type="checkbox" />
                <div className="collapse-title font-semibold">Project Details</div>
                <div className="collapse-content text-sm">
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={project.address || ""}
                      onChange={e => (isEdit || isAdd) ? onChange && onChange("address", e.target.value) : handleEditChange("address", e.target.value)}
                      disabled={isPreview && !isEditing}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Developer</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={project.developer || ""}
                      onChange={e => (isEdit || isAdd) ? onChange && onChange("developer", e.target.value) : handleEditChange("developer", e.target.value)}
                      disabled={isPreview && !isEditing}
                    />
                  </div>
                  <div className="flex w-full space-x-3">
                    <div className="mb-2 w-full">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Project Type</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={project.project_type || ""}
                        onChange={e => (isEdit || isAdd) ? onChange && onChange("project_type", e.target.value) : handleEditChange("project_type", e.target.value)}
                        disabled={isPreview && !isEditing}
                      />
                    </div>
                    <div className="mb-2 w-full">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">No of Units</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={project.noofunits || ""}
                        onChange={e => (isEdit || isAdd) ? onChange && onChange("noofunits", e.target.value) : handleEditChange("noofunits", e.target.value)}
                        disabled={isPreview && !isEditing}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Product Mix</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={project.productmix || ""}
                      onChange={e => (isEdit || isAdd) ? onChange && onChange("productmix", e.target.value) : handleEditChange("productmix", e.target.value)}
                      disabled={isPreview && !isEditing}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Design Team</label>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={project.design_team || ""}
                      onChange={e => (isEdit || isAdd) ? onChange && onChange("design_team", e.target.value) : handleEditChange("design_team", e.target.value)}
                      disabled={isPreview && !isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Descriptions Tab */}
          {activeTab === 'descriptions' && (
            <div id="descriptions" className="my-6 min-h-full max-h-screen w-full">
              <div className="mb-2 w-full">
                <label className="block text-xl text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg px-2 py-1 min-h-[150px] bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50"
                  value={project.description || ""}
                  onChange={e => (isEdit || isAdd) ? onChange && onChange("description", e.target.value) : handleEditChange("description", e.target.value)}
                  disabled={isPreview && !isEditing}
                />
              </div>
              <div className="mb-2 w-full">
                <label className="block text-xl text-slate-600 font-semibold mb-1">Description 2</label>
                <textarea
                  className="w-full rounded-lg px-2 py-1 min-h-[150px] bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50"
                  value={project.description2 || ""}
                  onChange={e => (isEdit || isAdd) ? onChange && onChange("description2", e.target.value) : handleEditChange("description2", e.target.value)}
                  disabled={isPreview && !isEditing}
                />
              </div>
              <div className="mb-2">
                <label className="block text-xl font-semibold text-slate-600 mb-1">Short Message (sm)</label>
                <input
                  className="w-full rounded-lg px-2 py-1 bg-[#b08b2e]/30 shadow-md border border-[#b08b2e]/50"
                  value={project.sm || ""}
                  onChange={e => (isEdit || isAdd) ? onChange && onChange("sm", e.target.value) : handleEditChange("sm", e.target.value)}
                  disabled={isPreview && !isEditing}
                />
              </div>
            </div>
          )}
          
          {/* iFrame & 360 Tab */}
          {activeTab === 'iframe360' && (
            <div id="iframe360" className="mb-8 min-h-full w-full">
              <div className="bg-white p-6 flex flex-col gap-6">
                <div>
                  <label className="block text-xl font-semibold text-[#b08b2e] mb-2">iFrame Links</label>
                  {(Array.isArray(project.iframeSrc) ? project.iframeSrc : project.iframeSrc ? [project.iframeSrc] : []).map((src, idx, arr) => (
                    <div key={idx} className="flex items-center gap-2 mb-2 bg-[#f7f3e9] rounded-lg p-2 shadow-sm">
                      <input
                        className="flex-1 border border-[#b08b2e]/40 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-[#b08b2e]/30"
                        value={src}
                        placeholder={`iFrame Link #${idx + 1}`}
                        onChange={e => {
                          const newArr = [...arr];
                          newArr[idx] = e.target.value;
                          (isEdit || isAdd) ? onChange && onChange("iframeSrc", newArr) : handleEditChange("iframeSrc", newArr);
                        }}
                        disabled={isPreview && !isEditing}
                      />
                      {(isPreview && isEditing) || (isEdit || isAdd) ? (
                        <button
                          type="button"
                          className="p-1 rounded-full bg-red-100 hover:bg-red-300 text-red-600"
                          onClick={() => {
                            const newArr = arr.filter((_, i) => i !== idx);
                            (isEdit || isAdd) ? onChange && onChange("iframeSrc", newArr) : handleEditChange("iframeSrc", newArr);
                          }}
                          aria-label="Remove iFrame link"
                          disabled={arr.length === 1}
                        >
                          <Icon icon="solar:trash-bin-trash-broken" width="20" height="20" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                  {((isPreview && isEditing) || (isEdit || isAdd)) && (
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 rounded bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition"
                      onClick={() => {
                        const arr = Array.isArray(project.iframeSrc) ? project.iframeSrc : project.iframeSrc ? [project.iframeSrc] : [];
                        (isEdit || isAdd) ? onChange && onChange("iframeSrc", [...arr, ""]) : handleEditChange("iframeSrc", [...arr, ""]);
                      }}
                    >
                      <Icon icon="solar:add-circle-broken" width="20" height="20" className="inline mr-1" /> Add iFrame Link
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-lg font-semibold text-[#b08b2e] mb-2">360 Livetour Links</label>
                  {(Array.isArray(project.tours360) ? project.tours360 : project.tours360 ? [project.tours360] : []).map((link, idx, arr) => (
                    <div key={idx} className="flex items-center gap-2 mb-2 bg-[#f7f3e9] rounded-lg p-2 shadow-sm">
                      <input
                        className="flex-1 border border-[#b08b2e]/40 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-[#b08b2e]/30"
                        value={link}
                        placeholder={`360 Link #${idx + 1}`}
                        onChange={e => {
                          const newArr = [...arr];
                          newArr[idx] = e.target.value;
                          (isEdit || isAdd) ? onChange && onChange("tours360", newArr) : handleEditChange("tours360", newArr);
                        }}
                        disabled={isPreview && !isEditing}
                      />
                      {(isPreview && isEditing) || (isEdit || isAdd) ? (
                        <button
                          type="button"
                          className="p-1 rounded-full bg-red-100 hover:bg-red-300 text-red-600"
                          onClick={() => {
                            const newArr = arr.filter((_, i) => i !== idx);
                            (isEdit || isAdd) ? onChange && onChange("tours360", newArr) : handleEditChange("tours360", newArr);
                          }}
                          aria-label="Remove 360 link"
                          disabled={arr.length === 1}
                        >
                          <Icon icon="solar:trash-bin-trash-broken" width="20" height="20" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                  {((isPreview && isEditing) || (isEdit || isAdd)) && (
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 rounded bg-[#b08b2e] text-white font-semibold hover:bg-[#a07a1e] transition"
                      onClick={() => {
                        const arr = Array.isArray(project.tours360) ? project.tours360 : project.tours360 ? [project.tours360] : [];
                        (isEdit || isAdd) ? onChange && onChange("tours360", [...arr, ""]) : handleEditChange("tours360", [...arr, ""]);
                      }}
                    >
                      <Icon icon="solar:add-circle-broken" width="20" height="20" className="inline mr-1" /> Add 360 Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Image Showcase Tab */}
          {activeTab === 'image-showcase' && (
            <div id="image-showcase" className="mb-8 w-full">
              <div className="collapse collapse-open bg-[#b08b2e]/30 shadow-md h-[80vh] w-full overflow-y-auto border-[#b08b2e]/50 border">
                <input type="checkbox" />
                <div className="collapse-title sticky top-0 z-10 bg-[#b08b2e]/30 font-semibold">Image Showcase</div>
                <div className="collapse-content text-sm">
                  <div className="mb-2">
                    <div className="grid grid-cols-3 gap-2 mb-2 h-full ">
                      {((isPreview && isEditing) || (isEdit || isAdd)) && (
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
                            disabled={isPreview && !isEditing}
                          />
                          <span className="text-[#b08b2e] font-bold text-xl">+</span>
                        </label>
                      )}
                      {(project.gallery || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-40 h-40 object-cover rounded border" />
                          {((isPreview && isEditing) || (isEdit || isAdd)) && (
                            <button
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailContainer;