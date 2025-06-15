import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/Sidebar";
import { motion } from "motion/react";
import { cn } from "../../lib/utils/utils";
import profile from "../../assets/imgs/profile/VeneziaEspiritu.jpg";
import { Icon } from '@iconify/react';
const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <Icon icon="solar:chat-square-2-broken" className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Projects",
    href: "#",
    icon: (
     <Icon icon="solar:inbox-archive-broken"  className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Inquiries",
    href: "#",
    icon: (
     <Icon icon="solar:letter-broken" className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
  },
  {
    label: "Page Management",
    href: "#",
    icon: (
      <Icon icon="solar:feed-broken" className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200"/>
    ),
  },
  // {
  //   label: "Settings",
  //   href: "#",
  //   icon: (
  //     <Icon icon="solar:settings-broken" className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200" />
  //   ),
  // },
  // {
  //   label: "Logout",
  //   href: "#",
  //   icon: (
  //     <IconArrowLeft className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200" />
  //   ),
  // },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-gray-100",
        "min-h-screen"
    )}      
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) =>
                link.label === "Logout" ? (
                  <SidebarLink
                    key={idx}
                    link={link}
                    onClick={e => {
                      e.preventDefault();
                      signOut(auth);
                    }}
                  />
                ) : (
                  <SidebarLink key={idx} link={link} />
                )
              )}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Log out",
                href: "#",
                icon: (
                  <Icon icon="solar:logout-3-broken" width="24" height="24" className="h-10 w-10 shrink-0 text-neutral-700 dark:text-neutral-200"/>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Nested routes will render here */}
        <Outlet />
        <button
          onClick={() => signOut(auth)}
          className="mt-8 px-6 py-2 rounded-lg bg-[#b08b2e] hover:bg-[#8a6c1d] text-white font-semibold castoro-titling-regular text-lg transition"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
};

export const Logo = () => {
  return (
    <div
      className="relative z-20 flex items-center space-x-2 p-2 text-sm font-normal text-black rounded-lg"
    >
      <div className="h-10 w-10 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm">
        <img
          src={profile}
          className="h-10 w-10 shrink-0 rounded-full"
          width={50}
          height={50}
          alt="Avatar"
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Venezia Espiritu
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div
      className="relative z-20 flex items-center space-x-2 p-2 text-sm font-normal text-black"
    >
      <div className="h-10 w-10 rounded-full">
        <img
          src={profile}
          className="h-10 w-10 shrink-0 rounded-full"
          width={50}
          height={50}
          alt="Avatar"
        />
      </div>
    </div>
  );
};

export default Dashboard;
