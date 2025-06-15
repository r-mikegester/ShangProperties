"use client";

import React, { JSX, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils/utils";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  // Assume last card is the main image, others are gallery
  const galleryCards = cards.slice(0, -1);
  const mainCard = cards[cards.length - 1];

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-3 w-full h-full relative">
      {/* Left: Gallery Images */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {galleryCards.map((card, i) => (
          <div key={i} className={cn(card.className, "relative w-full")}> 
            <motion.div
              onClick={() => handleClick(card)}
              className={cn(
                card.className,
                "relative overflow-hidden h-60 cursor-pointer",
                selected?.id === card.id
                  ? "rounded-lg"
                  : lastSelected?.id === card.id
                  ? "z-40 bg-white rounded-xl h-full w-full"
                  : "bg-white rounded-xl h-full w-full"
              )}
              layoutId={`card-${card.id}`}
            >
              <ImageComponent card={card} />
            </motion.div>
          </div>
        ))}
      </div>
      {/* Right: Main Image */}
      <div className={cn(mainCard.className, "relative w-full")}> 
        <motion.div
          onClick={() => handleClick(mainCard)}
          className={cn(
            mainCard.className,
            "relative overflow-hidden h-72 sm:h-96 lg:h-full cursor-pointer",
            selected?.id === mainCard.id
              ? "rounded-lg"
              : lastSelected?.id === mainCard.id
              ? "z-40 bg-white rounded-xl h-full w-full"
              : "bg-white rounded-xl h-full w-full"
          )}
          layoutId={`card-${mainCard.id}`}
        >
          <ImageComponent card={mainCard} />
        </motion.div>
      </div>
      {/* Fullscreen Overlay for Selected Image */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2999] flex items-center justify-center bg-black/80"
          onClick={handleOutsideClick}
        >
          <motion.div
            layoutId={`card-${selected.id}`}
            className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <motion.img
              layoutId={`image-${selected.id}-image`}
              src={selected.thumbnail}
              alt="thumbnail"
              className="object-contain w-full h-full rounded-2xl shadow-2xl"
              style={{ background: '#111' }}
            />
            <motion.div
              layoutId={`content-${selected.id}`}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 right-0 px-8 py-3 z-[110]  text-white  font-semibold rounded-b-2xl text-center"
            >
              {selected.content}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height={500}
      width={500}
      className={cn(
        "object-cover object-top absolute inset-0 h-full w-full transition duration-200 rounded-xl"
      )}
      alt="thumbnail"
    />
  );
};
