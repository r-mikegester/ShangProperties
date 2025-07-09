import { useEffect, useState } from "react";
import clsx from "clsx";
import whiteLogo from "../../assets/imgs/logo/shang/ShangPureWhite.webp";
import darkLogo from "../../assets/imgs/logo/shang/ShangGray.webp";
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
      <div className="w-screen mx-auto px-4 sm:px-10 py-2 md:px-20 h-20 flex flex-col md:flex-row justify-center md:justify-between items-center">
        <div className="flex w-full md:w-auto items-center justify-center md:justify-start">
          <img
            src={isScrolled ? darkLogo : whiteLogo}
            className="h-14 w-auto max-w-[160px] object-contain mx-auto transition-all duration-300"
            alt="logo"
          />
          <span className="text-xl font-bold"></span>
        </div>
        {/* Navigation or other content can go here for desktop */}
        <div className="hidden md:flex justify-between items-center w-full">
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
