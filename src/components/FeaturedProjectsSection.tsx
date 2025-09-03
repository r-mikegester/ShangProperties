import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import projects from "../data/ProjectsIndex";

const FeaturedProjectsSection: React.FC = () => {
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      try {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // If no projects in Firestore, fallback to static data
        setProjectsData(data.length > 0 ? data : projects);
      } catch (error) {
        console.error("Error processing projects data:", error);
        // Fallback to static data in case of error
        setProjectsData(projects);
      }
    }, (error) => {
      console.error("Error fetching projects from Firestore:", error);
      // Fallback to static data in case of error
      setProjectsData(projects);
    });
    
    return () => unsub();
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.id || index}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/projects/${project.id || index}`)}
            >
              <div className="relative pb-[75%]"> {/* 4:3 aspect ratio */}
                <img
                  src={project.image}
                  alt={project.formalName || project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold">{project.formalName || project.title}</h3>
                  <p className="text-sm opacity-90">{project.sm || project.project_type}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate("/projects")}
            className="px-8 py-3 bg-[#b08b2e] text-white font-semibold rounded-lg hover:bg-[#9a751e] transition-colors duration-300"
          >
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;