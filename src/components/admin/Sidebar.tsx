import React, { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: "solar:chat-square-2-broken",
    to: "/dashboard",
    isLogout: false,
  },
  {
    title: "Inquiries",
    icon: "solar:letter-broken",
    to: "/dashboard/inquiries",
    isLogout: false,
  },
  {
    title: "Project Management",
    icon: "solar:inbox-archive-broken",
    to: "/dashboard/projects",
    isLogout: false,
  },
  {
    title: "Page Management",
    icon: "solar:feed-broken",
    to: "/dashboard/page-management",
    isLogout: false,
  },
  {
    title: "Log out",
    icon: "mdi:logout",
    to: "#logout",
    isLogout: true,
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SmoothHoverMenuItem = ({
  children,
  transitionDelayInMs = 300,
}: { children: ReactNode; transitionDelayInMs?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-lg border overflow-hidden cursor-pointer transition-transform ${
        isHovered ? "border-neutral-400/30 scale-105" : "border-neutral-400/0 scale-100"
      }`}
      style={{
        transition: "border-color, transform",
        transitionDuration: isHovered ? "0ms" : `${transitionDelayInMs + 300}ms`,
      }}
    >
      <div
        className={`transition-colors px-0 py-0 ${isHovered ? "bg-neutral-400/20" : ""}`}
        style={{
          transition: "background-color",
          transitionDuration: isHovered ? "0ms" : `${transitionDelayInMs + 300}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement your logout logic here (e.g., clear tokens, redirect, etc.)
    window.location.href = "/";
  };

  // Sidebar width for positioning the collapse button
  const sidebarWidth = open ? 225 : 56;

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r z-[2999] border-slate-300 bg-white p-2 flex flex-col"
      style={{ width: open ? "225px" : "60px" }}
    >
      <div className="relative">
        <TitleSection open={open} />
        {/* Collapse button on the rim */}
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="absolute z-[2999] top-2 p-1 rounded-lg bg-white border-l-none border border-slate-300 shadow transition-colors hover:bg-slate-100"
          style={{
            left: open ? 225 - 15 : 60 - 15, // 18px to overlap the rim
            transition: 'left 0.3s',
          }}
          aria-label="Toggle sidebar"
        >
          <Icon icon="solar:square-double-alt-arrow-right-broken" className={open ? "  rotate-180 transition-transform" : "transition-transform"} />
        </button>
      </div>
      <div className="space-y-1 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          {sidebarLinks.slice(0, -1).map(({ icon, title, to }) => (
            <SmoothHoverMenuItem key={title}>
              <NavLink
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  open
                    ? `relative flex h-10 w-full items-center rounded-md px-2 transition-colors ${
                        isActive
                          ? "bg-[#b08b2e]/40 text-[#453610]"
                          : "text-slate-500"
                      }`
                    : `relative flex items-center justify-center size-10 mx-auto rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#b08b2e]/40 text-[#453610]"
                          : "text-slate-500"
                      }`
                }
              >
                <motion.div layout className={`grid h-full ${open ? "w-10" : "w-full"} place-content-center text-lg`}>
                  <Icon icon={icon} width={22} height={22} />
                </motion.div>
                {open && (
                  <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.125 }}
                    className="text-xs font-medium"
                  >
                    {title}
                  </motion.span>
                )}
              </NavLink>
            </SmoothHoverMenuItem>
          ))}
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <SmoothHoverMenuItem>
            <a
              href="#logout"
              onClick={handleLogout}
              className={
                open
                  ? "relative flex h-10 w-full items-center rounded-md px-2 transition-colors bg-red-200 text-red-600"
                  : "relative flex items-center justify-center size-10 mx-auto rounded-lg transition-colors text-red-600 bg-red-200"
              }
            >
              <motion.div layout className={`grid h-full ${open ? "w-10" : "w-full"} place-content-center text-lg`}>
                <Icon icon="solar:logout-3-broken" width={20} height={20} />
              </motion.div>
              {open && (
                <motion.span
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.125 }}
                  className="text-xs font-medium"
                >
                  Log out
                </motion.span>
              )}
            </a>
          </SmoothHoverMenuItem>
        </div>
      </div>
    </motion.nav>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className={`mb-3 border-b border-slate-300 pb-3 flex items-center ${open ? "justify-between" : "justify-center"}`}>
      <div className="flex items-center gap-2">
        <Logo />
        {open && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
          >
            <span className="block text-sm text-[#b08b2e] font-semibold">Venezia Espiritu</span>
            <span className="block text-xs text-slate-500">Shang Properties</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-lg bg-[#b08b2e]"
    >
      <img src="https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/VeneziaEspiritu.jpg" alt="Logo" className="h-8 w-8 object-cover rounded-md" />
    </motion.div>
  );
};

export default Sidebar;
