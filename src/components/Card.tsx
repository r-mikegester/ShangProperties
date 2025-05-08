// components/ProjectOverview.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
// import Two from "./Two";

type Project = {
    id: number;
    title: string;
    sm: string;
    image: string;
    description: string;
    address: string;
    project_type: string;
    design_team: string;
    noofunits: string;
    productmix: string;
    developer: string;
    gallery: string[];
};

type Props = {
    projects: Project[];
};

const ProjectOverview = ({ projects }: Props) => {
    const [selectedCard, setSelectedCard] = useState<Project | null>(null);

    return (
        <div className="w-full relative flex justify-center">
            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-2 md:px-2 lg:px-5 w-full max-w-full">
                {projects.map((card) => (
                    <Card key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                ))}
            </motion.ul>
            <Modal card={selectedCard} onClick={() => setSelectedCard(null)} />
        </div>
    );
};

function Card({ card, onClick }: { card: Project; onClick: () => void }) {
    return (
        <motion.li
            className="cursor-pointer"
            layoutId={`card-${card.id}`}
            onClick={onClick}
        >
            <div className="flex flex-col relative gap-2 p-2 justify-center place-items-center items-center w-full bg-white/50 backdrop-blur-md shadow-md rounded-3xl overflow-hidden">
                <div className="py-4 px-4 w-full absolute top-3 z-10">
                    <motion.h2 className="font-semibold text-md text-white flex items-center gap-2" layoutId={`title-${card.id}`}>
                        <Icon icon="mdi:home-city" className="text-white text-lg" />
                        {card.title}
                    </motion.h2>
                    <motion.p className="text-muted-foreground text-xs" layoutId={`title-sm-${card.id}`}>
                        {card.sm}
                    </motion.p>
                </div>
                <div className="relative h-96 w-full">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="object-cover h-full w-full rounded-2xl"
                    />
                </div>
                <div className="py-4 px-4 absolute w-full bottom-0 z-10">
                    <div className="bg-white/80 backdrop-blur-md p-3 w-full glass rounded-xl">
                        <motion.h2 className="font-semibold text-ml text-secondary-foreground flex items-center gap-2" layoutId={`title-${card.id}`}>
                            <Icon icon="mdi:home-city" className="text-gray-700 text-lg" />
                            {card.title}
                        </motion.h2>
                        <motion.p className="text-muted-foreground text-xs" layoutId={`title-sm-${card.id}`}>
                            {card.sm}
                        </motion.p>
                    </div>
                </div>
            </div>
        </motion.li>
    );
}

function Modal({ card, onClick }: { card: Project | null; onClick: () => void }) {
    return (
        <AnimatePresence>
            {card && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={onClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="fixed inset-0 z-[2999] flex justify-center items-center p-5"
                    >
                        <motion.div
                            className="relative bg-white p-6 rounded-3xl z-[2999] overflow-hidden h-full w-full flex-col md:flex md:flex-row space-y-3 md:space-y-0 md:space-x-6"
                            layoutId={`card-${card.id}`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClick}
                                className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                                aria-label="Close modal"
                            >
                                <Icon icon="mdi:close" className="text-gray-800 text-xl" />
                            </button>

                            <img
                                src={card.image}
                                alt={card.title}
                                width={500}
                                height={300}
                                className="rounded-2xl"
                            />
                              {/* <Two gallery={card.gallery} /> */}
                            <div className="flex flex-col space-y-5 h-full w-full rounded-2xl bg-gray-100 shadow-inner border border-gray-200 p-6 overflow-y-auto">
                                <div className="overflow-y-scroll min-h-full max-h-[1000px]">
                                    <div>
                                        <motion.h2 className="text-4xl font-bold flex items-center gap-2" layoutId={`title-${card.id}`}>
                                            <Icon icon="mdi:home-city" className="text-gray-800 text-2xl size-10" />
                                            {card.title}
                                        </motion.h2>
                                        <motion.p className="text-muted-foreground mt-2" layoutId={`title-sm-${card.id}`}>
                                            {card.sm}
                                        </motion.p>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <h1 className="text-lg font-semibold">Project Details</h1>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:map-marker" />
                                            <strong>Address:</strong> {card.address}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:office-building" />
                                            <strong>Type:</strong> {card.project_type}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:account-group-outline" />
                                            <strong>Design Team:</strong> {card.design_team}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:numeric" />
                                            <strong>No. of Units:</strong> {card.noofunits}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:shape-outline" />
                                            <strong>Product Mix:</strong> {card.productmix}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Icon icon="mdi:domain" />
                                            <strong>Developer:</strong> {card.developer}
                                        </p>
                                    </div>
                                    <div>
                                        <motion.p className="mt-4">{card.description}</motion.p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


export default ProjectOverview;
