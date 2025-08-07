import { useEffect, useState } from "react";
import { Carousel, Card } from "./ProjectCards";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function AppleCardsCarouselDemo() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });
    return () => unsub();
  }, []);

  const cards = projects.map((project, index) => (
    <Card
      key={project.id}
      card={{
        category: project.project_type || "Project",
        title: project.formalName || project.title,
        src: project.image,
        content: null,
        route: `/projects/${project.id}`,
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
