import { useEffect, useState } from "react";
import { Carousel, Card } from "./ProjectCards";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import projects from "../data/ProjectsIndex";

export function AppleCardsCarouselDemo() {
  const [projectsData, setProjectsData] = useState<any[]>([]);

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

  const cards = projectsData.map((project, index) => (
    <Card
      key={project.id || index}
      card={{
        category: project.project_type || project.type || "Project",
        title: project.formalName || project.title,
        src: project.image,
        content: null,
        route: `/projects/${project.id || index}`,
      }}
      index={index}
    />
  ));

  return (
    <section className="w-full  md:h-[100vh] flex flex-col justify-between items-center py-8 px-2 gap-y-4 overflow-hidden bg-[#686058] text-white mb-12 relative Westmount">
      <div className="w-full flex-1 flex justify-center items-center overflow-hidden">
        <Carousel items={cards} />
      </div>
    </section>
  );
}