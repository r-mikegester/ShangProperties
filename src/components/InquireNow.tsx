import { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface InquireNowProps {
    isScrolled: boolean;
}

export default function InquireNow({ isScrolled }: InquireNowProps) {
    const [showText, setShowText] = useState(false);

    return (
        <a
            href="#contact"
            className={clsx(
                "hidden md:flex items-center relative", // remove group, add relative for positioning
                isScrolled ? "text-[#b08b2e]" : "text-white"
            )}
            onClick={e => {
                e.preventDefault(); // Prevent navigation for demo; remove if you want to navigate
                setShowText((prev) => !prev);
            }}
            style={{ cursor: "pointer" }}
        >
            <Icon icon="line-md:phone-call-loop" className="size-10" />
            <AnimatePresence>
                {showText && (
                    <motion.span
                        className="ml-2 absolute right-full top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-green-600 px-3 py-1 rounded shadow-lg"
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        Inquire Now
                    </motion.span>
                )}
            </AnimatePresence>
        </a>
    );
}