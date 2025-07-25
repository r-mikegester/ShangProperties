import { Carousel, Card } from "./ProjectCards";
import projects from "../data/ProjectsIndex";

const projectRoutes: Record<string, string> = {
  "Laya": "/Laya",
  "Haraya": "/Haraya",
  "Aurelia": "/Aurelia",
  "WackWack": "/WackWack",
  "ShangSummit": "/ShangSummit",
};

const data = projects.map((project: any) => ({
  category: project.project_type || "Project",
  title: project.formalName || project.title,
  src: project.image,
  content: null, // No dummy content
  route: projectRoutes[project.title] || '/',
}));

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <section className="w-full  md:h-[100vh] flex flex-col justify-between items-center py-8 px-2 gap-y-4 overflow-hidden bg-[#686058] text-white mb-12 relative Westmount">
      <div className="w-full flex-1 flex justify-center items-center overflow-hidden">
        <Carousel items={cards} />
      </div>
    </section>
  );
}
