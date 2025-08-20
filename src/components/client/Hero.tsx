import React, { RefObject, useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { db } from "../../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface HeroProps {
  imageRef: RefObject<HTMLImageElement | null>;
}

const Hero: React.FC<HeroProps> = ({ imageRef }) => {
  const [heroContent, setHeroContent] = useState({
    backgroundUrl: "",
    headline: "Curating Spaces <br className=\"hidden xs:block\" /> as Fine As You.",
    paragraph: "Shang Properties, Inc. (SPI) has been involved in property investment and development in the Philippines since 1987 and was listed on the Philippine Stock Exchange (PSE) in 1991. Shang Properties' core businesses are office and retail leasing and residential development, as guided by its vision to be the leading developer and manager of prime properties in the Philippines."
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(
      doc(db, "homepage", "content"),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.hero) {
            setHeroContent({
              backgroundUrl: data.hero.backgroundUrl || "",
              headline: data.hero.headline || "Curating Spaces <br className=\"hidden xs:block\" /> as Fine As You.",
              paragraph: data.hero.paragraph || "Shang Properties, Inc. (SPI) has been involved in property investment and development in the Philippines since 1987 and was listed on the Philippine Stock Exchange (PSE) in 1991. Shang Properties' core businesses are office and retail leasing and residential development, as guided by its vision to be the leading developer and manager of prime properties in the Philippines."
            });
          }
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching hero content:", error);
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  // Process paragraph text for expand/collapse functionality
  const fullText = heroContent.paragraph || "Shang Properties, Inc. (SPI) has been involved in property investment and development in the Philippines since 1987 and was listed on the Philippine Stock Exchange (PSE) in 1991. Shang Properties' core businesses are office and retail leasing and residential development, as guided by its vision to be the leading developer and manager of prime properties in the Philippines.";
  const shortText = fullText.slice(0, 164) + (fullText.length > 170 ? "..." : "");
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="home"
      className="min-h-screen w-full relative flex flex-col justify-center items-center bg-white pt-16 md:pt-20 overflow-hidden"
    >
      <motion.img
        ref={imageRef}
        src={heroContent.backgroundUrl || "https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/"}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover z-0 will-change-transform"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-20 flex flex-col items-center md:items-start justify-end md:justify-end w-full max-w-full px-4 sm:px-8 md:px-20 pb-8 md:pb-24 pt-8 md:pt-0 text-white min-h-[60vh] md:min-h-[80vh]">
        <motion.h1
          className="text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#f4e3c1] drop-shadow-lg castoro-titling-regular text-center md:text-left leading-tight md:leading-tight"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          dangerouslySetInnerHTML={{ 
            __html: heroContent.headline || "Curating Spaces <br className=\"hidden xs:block\" /> as Fine As You." 
          }}
        />
        <motion.div
          className="mt-4 text-sm xs:text-base sm:text-lg max-w-3xl md:text-md text-center md:text-left text-[#c2b498]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          {expanded ? fullText : shortText}
          {fullText.length > 160 && (
            <span
              className="ml-2 text-[#b08b2e] underline cursor-pointer select-none"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Continue reading"}
            </span>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;