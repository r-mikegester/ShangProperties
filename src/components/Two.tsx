// components/Two.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Element {
    id: number;
    img: string;
}

const Two = ({ gallery }: { gallery: string[] }) => {
    const images: Element[] = gallery.map((img, index) => ({
        id: index + 1,
        img,
    }));

    const [activeItem, setActiveItem] = useState<Element | null>(null);

    return (
        <div className="h-full w-full flex flex-col gap-5 relative">
            <motion.div className="flex flex-wrap gap-5 justify-center" layout>
                {images.map((item) => (
                    <Gallery key={item.id} item={item} onClick={() => setActiveItem(item)} />
                ))}
            </motion.div>

            {activeItem && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 w-full h-full overflow-hidden z-50 bg-black/50 flex justify-center items-center"
                >
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={activeItem.id}
                            className="w-[400px] h-[400px] rounded-3xl overflow-hidden z-10"
                            layoutId={`card-${activeItem.id}`}
                            onClick={() => setActiveItem(null)}
                        >
                            <img src={activeItem.img} alt="" className="w-full h-full object-cover" />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

const Gallery = ({
    item,
    onClick,
}: {
    item: Element;
    onClick: () => void;
}) => (
    <motion.div
        layoutId={`card-${item.id}`}
        className="w-[150px] h-[150px] rounded-xl overflow-hidden cursor-pointer"
        onClick={onClick}
    >
        <motion.img
            src={item.img}
            alt=""
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
        />
    </motion.div>
);

export default Two;
