import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Project } from "../types/Project";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [archiveProjects, setArchiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from Firestore
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects from Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch archive projects
  const fetchArchiveProjects = useCallback(async () => {
    setArchiveLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "archive"));
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setArchiveProjects(data);
    } finally {
      setArchiveLoading(false);
    }
  }, []);

  // Add new project
  const addProject = useCallback(async (project: Omit<Project, "id">) => {
    const docRef = await addDoc(collection(db, "projects"), project);
    setProjects((prev) => [...prev, { ...project, id: docRef.id }]);
    return docRef.id;
  }, []);

  // Update project
  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    const updateData = { ...data };
    delete updateData.id;
    await updateDoc(doc(db, "projects", id), updateData);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updateData } : p)));
  }, []);

  // Archive and remove project
  const archiveAndRemoveProject = useCallback(async (id: string) => {
    const projectToArchive = projects.find((p) => p.id === id);
    if (projectToArchive) {
      await setDoc(doc(db, "archive", id), projectToArchive);
      await deleteDoc(doc(db, "projects", id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }, [projects]);

  // Restore project from archive
  const restoreProject = useCallback(async (project: Project) => {
    await setDoc(doc(db, "projects", project.id), project);
    await deleteDoc(doc(db, "archive", project.id));
    setArchiveProjects((prev) => prev.filter((ap) => ap.id !== project.id));
    setProjects((prev) => [...prev, project]);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    archiveProjects,
    loading,
    archiveLoading,
    error,
    fetchProjects,
    fetchArchiveProjects,
    addProject,
    updateProject,
    archiveAndRemoveProject,
    restoreProject,
    setProjects,
    setArchiveProjects,
  };
}
