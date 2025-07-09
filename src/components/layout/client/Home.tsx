"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Footer from "../../common/Footer";
import Contact from "./Contact";
// import Card from "../components/Card";
import Hero from "./Hero";
import Gallery from "./Gallery";
import FloatingContactButton from "../../FloatingContactButton";

const Home = () => {
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
            <div className="text-white bg-[#686058] pt-10 text-center text-5xl font-semibold castoro-titling-regular">FEATURED PROJECTS</div>
            <Gallery items={[]} />
            <Contact />
            <FloatingContactButton />
            <Footer />
        </div>
    );
};

export default Home;
