"use client";

import React, { JSX, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
SwiperCore.use([Autoplay]);
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
// import Carousel from "./Carousel";
import projects from "../lib/data/featuredProjects";
import { cn } from "../lib/utils/utils";
import SkeletonImage from "./common/SkeletonImage";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  // Use the first 3 cards for the main grid
  const mainCards = cards.slice(0, 3);
  const extraCards = cards.slice(3);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <>
    <div className="grid grid-cols-2 gap-3 w-full h-full min-h-fit max-w-7xl mx-auto relative">
      {/* Left: First two images stacked */}
      <div className="flex flex-col gap-3 h-full w-full md:col-span-1">
        {[mainCards[0], mainCards[1]].map((card, i) => (
          card && (
            <div key={i} className={cn(card.className, "relative w-full flex-1 min-h-[140px] sm:min-h-[180px] lg:min-h-[180px]")}> 
              <motion.div
                onClick={() => handleClick(card)}
                className={cn(
                  card.className,
                  "relative overflow-hidden h-[140px] sm:h-[180px] lg:h-full cursor-pointer",
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
          )
        ))}
      </div>
      {/* Right: Third image tall */}
      <div className="flex flex-col h-full w-full md:col-span-1 md:row-span-2">
        {mainCards[2] && (
          <div className={cn(mainCards[2].className, "relative w-full flex-1 min-h-[200px] sm:min-h-[280px] lg:min-h-[380px]")}> 
            <motion.div
              onClick={() => handleClick(mainCards[2])}
              className={cn(
                mainCards[2].className,
                "relative overflow-hidden h-[200px] sm:h-[280px] lg:h-full cursor-pointer",
                selected?.id === mainCards[2].id
                  ? "rounded-lg"
                  : lastSelected?.id === mainCards[2].id
                  ? "z-40 bg-white rounded-xl h-full w-full"
                  : "bg-white rounded-xl h-full w-full"
              )}
              layoutId={`card-${mainCards[2].id}`}
            >
              <ImageComponent card={mainCards[2]} />
            </motion.div>
          </div>
        )}
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
          {/* Close Button */}
          <button
            className="absolute top-4 left-4 right-auto md:right-6 md:left-auto z-[3100] text-white text-4xl font-bold bg-black/40 hover:bg-black/70 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] transition"
            onClick={e => { e.stopPropagation(); handleOutsideClick(); }}
            aria-label="Close fullscreen image"
            type="button"
          >
            <Icon icon="solar:close-circle-broken" className="w-8 h-8 md:w-10 md:h-10" />
          </button>
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
    {/* Extra images row: only for extraCards */}
    {extraCards.length > 0 && (
      <div className="w-full max-w-7xl mx-auto mt-6">
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          speed={800}
          style={{ paddingBottom: 16 }}
        >
          {extraCards.map((card, i) => (
            <SwiperSlide key={card.id}>
              <div className="relative min-w-[160px] h-40 flex-shrink-0">
                <motion.div
                  onClick={() => handleClick(card)}
                  className={cn(
                    card.className,
                    "relative overflow-hidden cursor-pointer h-full w-full rounded-xl border border-gray-200",
                    selected?.id === card.id
                      ? "ring-2 ring-blue-500 z-50"
                      : lastSelected?.id === card.id
                        ? "z-40"
                        : ""
                  )}
                  layoutId={`card-${card.id}`}
                >
                  <ImageComponent card={card} />
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )}
    </>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <div className="relative w-full h-full">
      <SkeletonImage
        src={card.thumbnail}
        height={500}
        width={500}
        className={cn(
          "object-cover object-top absolute inset-0 h-full w-full transition duration-200 rounded-xl"
        )}
        alt="thumbnail"
      />
    </div>
  );
};
