"use client";
import React, { JSX, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils/utils";


type Card = {
    id: number;
    content: JSX.Element | React.ReactNode | string;
    className: string;
    thumbnail: string;
};

export const GridGallery = ({ cards }: { cards: Card[] }) => {
    const [selected, setSelected] = useState<Card | null>(null);
    const [lastSelected, setLastSelected] = useState<Card | null>(null);

    const handleClick = (card: Card) => {
        setLastSelected(selected);
        setSelected(card);
    };

    const handleOutsideClick = () => {
        setLastSelected(selected);
        setSelected(null);
    };

    return (
    <div className="w-full h-full p-10 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto gap-3 relative">
    {/* Left column: two stacked images */}
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
    {[cards[0], cards[1]].map((card, i) => (
    card && (
    <div key={i} className={cn(card.className, "")}> 
    <motion.div
    onClick={() => handleClick(card)}
    className={cn(
    card.className,
    "relative overflow-hidden",
    selected?.id === card.id
    ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
    : lastSelected?.id === card.id
    ? "z-40 bg-white rounded-xl h-full w-full"
    : "bg-white rounded-xl h-full w-full"
    )}
    layoutId={`card-${card.id}`}
    >
    {selected?.id === card.id && <SelectedCard selected={selected} />}
    <ImageComponent card={card} />
    </motion.div>
    </div>
    )
    ))}
    </div>
    {/* Right column: single tall image */}
    {cards[2] && (
    <div className={cn(cards[2].className, "")}> 
    <motion.div
    onClick={() => handleClick(cards[2])}
    className={cn(
    cards[2].className,
    "relative overflow-hidden",
    selected?.id === cards[2].id
    ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
    : lastSelected?.id === cards[2].id
    ? "z-40 bg-white rounded-xl h-full w-full"
    : "bg-white rounded-xl h-full w-full"
    )}
    layoutId={`card-${cards[2].id}`}
    >
    {selected?.id === cards[2].id && <SelectedCard selected={cards[2]} />}
    <ImageComponent card={cards[2]} />
    </motion.div>
    </div>
    )}
    <motion.div
    onClick={handleOutsideClick}
    className={cn(
    "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
    selected?.id ? "pointer-events-auto" : "pointer-events-none"
    )}
    animate={{ opacity: selected?.id ? 0.3 : 0 }}
    />
    </div>
    );
};

const ImageComponent = ({ card }: { card: Card }) => {
    return (
        <motion.img
            layoutId={`image-${card.id}-image`}
            src={card.thumbnail}
            height="500"
            width="500"
            className={cn(
                "object-cover object-top absolute inset-0 h-full w-full transition duration-200 bg-red-500"
            )}
            alt="thumbnail"
        />
    );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
    return (
        <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 0.6,
                }}
                className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
            />
            <motion.div
                layoutId={`content-${selected?.id}`}
                initial={{
                    opacity: 0,
                    y: 100,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    opacity: 0,
                    y: 100,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="relative px-8 pb-4 z-[70]"
            >
                {selected?.content}
            </motion.div>
        </div>
    );
};
