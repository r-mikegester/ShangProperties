import React, { Dispatch, SetStateAction, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiMonitor,
  FiChevronsRight,
  FiChevronDown,
  FiLogOut,
} from "react-icons/fi";
import { Icon, Icon as IconifyIcon } from '@iconify/react';
import { motion } from "framer-motion";
import Venezia from "../../assets/imgs/profile/VeneziaEspiritu.jpg"; // Adjust the path as necessary

const links = [
  { title: "Dashboard", path: "/dashboard", Icon: "solar:chat-square-2-broken" },
  { title: "Projects", path: "/dashboard/projects", Icon: "solar:inbox-archive-broken" },
  { title: "Inquiries", path: "/dashboard/inquiries", Icon: "solar:letter-broken" },
  { title: "Page Management", path: "/dashboard/page-management", Icon: "solar:feed-broken" },
];

const Sidebar: React.FC<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(() => {
    const found = links.find(link => location.pathname.startsWith(link.path));
    return found ? found.title : "Dashboard";
  });

  return (
    <motion.nav
      layout
      className="sticky top-0 min-h-screen hidden md:block z-100 shrink-0 border-r border-slate-300 bg-white p-2"
      style={{ width: open ? "225px" : "fit-content" }}
    >
      <TitleSection open={open} />
      <div className="space-y-1">
        {links.map((link) => (
          <Option
            key={link.title}
            Icon={link.Icon}
            title={link.title}
            selected={selected}
            setSelected={setSelected}
            open={open}
            onClick={() => navigate(link.path)}
          />
        ))}
      </div>
      <div className="absolute -right-3 top-9 z-50">
        <motion.button
          layout
          onClick={() => setOpen((pv) => !pv)}
          className="flex items-center justify-center rounded-full shadow bg-[#fff] text-[#b08b2e] hover:bg-[#f7f3e9] font-semibold"
        >
          <Icon icon="solar:square-double-alt-arrow-right-broken" width={24} height={24} className={`size-6 rounded-lg duration-300 hover:bg-[#b08b2e] hover:text-white transition-transform ${open && "rotate-180"}`} />
          {/* {open && <span className="ml-2">Hide</span>} */}
        </motion.button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 border-t border-[#b08b2e] bg-white p-2">
        <Option
          Icon={() => <Icon icon="solar:exit-broken" width={24} height={24} />}
          title="Log out"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onClick={() => {
            import('firebase/auth').then(({ getAuth, signOut }) => {
              signOut(getAuth());
            });
          }}
        />
      </div>
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  onClick,
  notifs,
}: {
  Icon: any;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  onClick?: () => void;
  notifs?: number;
}) => {
  return (
    <motion.button
      layout
      onClick={() => {
        setSelected(title);
        if (onClick) onClick();
      }}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors p-2 ${selected === title ? "bg-[#b08b2e] text-[#f7f3e9] font-bold" : "text-slate-700 hover:bg-[#edddb3]"}`}
    >
      <motion.div layout className="grid h-full w-10 place-content-center text-lg">
        {typeof Icon === 'string' ? <IconifyIcon icon={Icon} width={22} height={22} /> : <Icon />}
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
      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-[#b08b2e] text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="my-3 border-b border-[#b08b2e] pb-3">
      <div className="flex cursor-pointer items-center justify-around p-2 rounded-md transition-colors ">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold text-[#b08b2e]">Venezia Espiritu</span>
              <span className="block text-xs text-slate-500">Shang Properties</span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div layout className="grid size-10 shrink-0 place-content-center rounded-md bg-[#b08b2e]">
      <img src={Venezia} className="rounded-md" />
    </motion.div>
  );
};

// ToggleClose removed, now handled as a floating button at the top

export default Sidebar;
