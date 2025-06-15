import React, { RefObject } from "react";
import { motion } from "framer-motion";
import bgimg from "../assets/imgs/HeroBanner.webp";

interface HeroProps {
  imageRef: RefObject<HTMLImageElement | null>;
}

const Hero: React.FC<HeroProps> = ({ imageRef }) => {
  return (
    <section
      id="home"
      className="h-screen w-full relative flex flex-col justify-center items-left bg-white pt-20 overflow-hidden"
    >
      <motion.img
        ref={imageRef}
        src={bgimg}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover z-0 will-change-transform"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="z-20 text-center md:text-left text-white px-5 md:px-20 flex flex-col items-left justify-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-[#f4e3c1] drop-shadow-lg castoro-titling-regular"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Curating Spaces <br /> as Fine As You.
        </motion.h1>
        <motion.div
          className="mt-4 text-md w-xl text-left text-[#c2b498]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          Shang Properties, Inc. (SPI) has been involved in property investment and
          development in the Philippines since 1987 and was listed on the Philippine
          Stock Exchange (PSE) in 1991. Shang Properties’ core businesses are office and
          retail leasing and residential development, as guided by its vision to be the
          leading developer and manager of prime properties in the Philippines.
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
