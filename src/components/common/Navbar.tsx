// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import clsx from "clsx";
import whiteLogo from "../assets/logos/shang/ShangPureWhite.png";
import darkLogo from "../assets/logos/shang/ShangGray.png";
import { Icon } from "@iconify/react";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "w-full fixed top-0 z-[2990] transition-all duration-150",
        isScrolled ? "bg-white/80 backdrop-blur shadow-md text-[#b08b2e]" : "bg-transparent text-white"
      )}
    >
      <div className="w-screen mx-auto px-10 py-2 md:px-20 h-20 flex justify-center md:justify-between items-center">
        <div className="flex space-x-2 items-center justify-center">
          <img
            src={isScrolled ? darkLogo : whiteLogo}
            className="w-full h-20 transition-all duration-300"
            alt="logo"
          />

          <span className="text-xl font-bold"></span>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex space-x-4">
            {/* <a href="#home" className="hover:text-green-500">HOME</a>
            <a href="#projects" className="hover:text-green-500">PROJECTS</a>
            <a href="#contact" className="hover:text-green-500">CONTACT</a> */}
            <div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
