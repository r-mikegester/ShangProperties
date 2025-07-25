import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Gallery from "./client/Gallery";

export default function FeaturedProjectsSection() {
  const headingRef = useRef(null);
  const galleryRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const galleryInView = useInView(galleryRef, { once: true, margin: "-100px" });

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
        ref={galleryRef}
        initial={{ opacity: 0, y: 40 }}
        animate={galleryInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <Gallery />
      </motion.div>
    </section>
  );
}
