import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const sidebarLinks = [
  {
    title: "Dashboard",
    icon: "solar:chat-square-2-broken",
    to: "/Admin/Dashboard",
    isLogout: false,
  },
  {
    title: "Inquiries",
    icon: "solar:letter-broken",
    to: "/Admin/Inquiries",
    isLogout: false,
  },
  {
    title: "Projects",
    icon: "solar:inbox-archive-broken",
    to: "/Admin/Projects",
    isLogout: false,
  },
  {
    title: "Pages",
    icon: "solar:feed-broken",
    to: "/Admin/PageManagement",
    isLogout: false,
  },
  // {
  //   title: "Log out",
  //   icon: "mdi:logout",
  //   to: "#logout",
  //   isLogout: true,
  // },
];

const Dock: React.FC = () => {
  const location = useLocation();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <nav className="fixed bottom-4 left-1/2 z-[3000] -translate-x-1/2 flex gap-2 px-2 py-2 bg-[#B08B2E]/40 backdrop-blur-md rounded-2xl shadow-2xl border border-[#B08B2E]"
      style={{ boxShadow: "0 8px 32px 0 rgba(34, 34, 34, 0.18)" }}
    >
      {sidebarLinks.map(({ icon, title, to, isLogout }) => (
        <motion.div
          key={title}
          whileHover={{ scale: 1.25, y: -10, boxShadow: "0 8px 24px 0 rgba(176,139,46,0.18)" }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center justify-center cursor-pointer group relative"
        >
          {isLogout ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center text-red-600 hover:text-red-800 focus:outline-none"
              aria-label="Log out"
            >
              <Icon icon="solar:logout-3-broken" className="size-10" />
              <span className="text-[10px] mt-1 font-medium">Log out</span>
            </button>
          ) : (
            <NavLink
              to={to}
              end={to === "/Admin/Dashboard"}
              className={({ isActive }) =>
                `flex flex-col items-center w-20 justify-center p-2 rounded-xl transition-colors ${
                  isActive ? "bg-white/50 text-[#68521c]" : "text-[#68521c]"
                }`
              }
              aria-label={title}
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={{ y: isActive ? 0 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="flex items-center justify-center"
                  >
                    <Icon icon={icon} width={28} height={28} />
                  </motion.div>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                      className="text-[10px] font-medium"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {title}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          )}
        </motion.div>
      ))}
    </nav>
  );
};

export default Dock;