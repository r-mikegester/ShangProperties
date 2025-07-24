import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';

const adminLinks = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: "solar:chat-square-2-broken",
    },
    {
        title: "Projects",
        path: "/dashboard/projects",
        icon: "solar:inbox-archive-broken",
    },
    {
        title: "Inquiries",
        path: "/dashboard/inquiries",
        icon: "solar:letter-broken",
    },
    {
        title: "Page Management",
        path: "/dashboard/page-management",
        icon: "solar:feed-broken",
    },
];

export function Dock() {
    const location = useLocation();
    const navigate = useNavigate();

    // Only show dock on mobile (hidden on md and up)
    return (
        <div className="fixed bottom-3 left-0 right-0 z-50 md:hidden">
            <div className="relative w-full">
                <div className="-translate-x-1/2 absolute bottom-0 left-1/2 mx-auto max-w-full transform-gpu pt-4">
                    <div className="relative ">
                        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-20 p-2 max-w-full rounded-3xl border border-gray-200/60 bg-gray-200/60 shadow-2xs dark:border-gray-600/60 dark:bg-gray-800/60" />
                        <div className="flex items-center  overflow-x-auto rounded-3xl p-2 bg-red-500">
                            {adminLinks.map((link) => (
                                <DockIcon
                                    key={link.title}
                                    icon={link.icon}
                                    label={link.title}
                                    active={location.pathname.startsWith(link.path)}
                                    onClick={() => navigate(link.path)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DockIcon({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            className={`group z-20 grid w-fit place-items-center p-2 pl-0 focus:outline-none ${active ? 'scale-110' : ''}`}
            onClick={onClick}
            aria-label={label}
            type="button"
        >
            <div
                className={`pointer-events-none z-20 inline size-14 transform-gpu overflow-hidden rounded-2xl bg-white shadow-inner transition-all duration-200 group-hover:size-[4rem] group-hover:shadow-2xs ${active ? 'ring-2 ring-[#b08b2e]' : ''}`}
            >
                <Icon icon={icon} width={40} height={40} className="mx-auto" />
            </div>
            {/* Label removed for icon-only dock */}
        </button>
    );
}

export default Dock;
