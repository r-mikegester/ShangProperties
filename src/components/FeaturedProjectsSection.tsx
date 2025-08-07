import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FeaturedProjectsSection() {
  const headingRef = useRef(null);
  const projectsRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const projectsInView = useInView(projectsRef, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-16">
      <motion.h2
        ref={headingRef}
        className="text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Featured Projects
      </motion.h2>
      <motion.div
        ref={projectsRef}
        initial={{ opacity: 0, y: 40 }}
        animate={projectsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform border border-gray-200"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <img
                src={project.image || "https://via.placeholder.com/400x240?text=No+Image"}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#b08b2e] mb-1">{project.formalName || project.title}</h3>
                <div className="text-gray-600 text-sm mb-2">{project.developer}</div>
                <div className="text-gray-700 text-sm line-clamp-2 min-h-[40px]">{project.description}</div>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-gray-400 text-center mt-8">No featured projects found.</div>
        )}
      </motion.div>
    </section>
  );
}
