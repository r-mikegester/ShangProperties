import React, { RefObject } from "react";
import bgimg from "../assets/imgs/HeroBanner.webp";

interface HeroProps {
  imageRef: RefObject<HTMLImageElement | null>;
}

const Hero: React.FC<HeroProps> = ({ imageRef }) => {
  return (
    <section
      id="home"
      className="h-screen w-screen relative flex flex-col justify-center items-left bg-white pt-20 overflow-hidden"
    >
      <img
        ref={imageRef}
        src={bgimg}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover z-0 will-change-transform"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="z-20 text-center md:text-left text-white px-5 md:px-20 flex flex-col items-left justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#f4e3c1] drop-shadow-lg castoro-titling-regular">
          Curating Spaces <br /> as Fine As You.
        </h1>
        <div className="mt-4 text-md w-xl text-left text-[#c2b498]">
          Shang Properties, Inc. (SPI) has been involved in property investment and
          development in the Philippines since 1987 and was listed on the Philippine
          Stock Exchange (PSE) in 1991. Shang Properties’ core businesses are office and
          retail leasing and residential development, as guided by its vision to be the
          leading developer and manager of prime properties in the Philippines.
        </div>
      </div>
    </section>
  );
};

export default Hero;
