"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Footer from "../components/shared/Footer";
import Contact from "../components/client/Contact";
import Hero from "../components/client/Hero";
// import Gallery from "./Gallery";
import FloatingContactButton from "../components/FloatingContactButton";
import { AppleCardsCarouselDemo } from "../components/FeaturedProjects";

const ClientLayout = () => {
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        const raf = (time: number) => {
            lenis.raf(time);

            const scrollY = window.scrollY;
            if (imageRef.current) {
                imageRef.current.style.transform = `translateY(${scrollY * 0.9}px)`;
            }

            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="h-full">
            <Hero imageRef={imageRef} />
            <AppleCardsCarouselDemo />
            {/* <Gallery items={[]} /> */}
            <Contact />
            <FloatingContactButton />
            <Footer />
        </div>
    );
};

export default ClientLayout;
