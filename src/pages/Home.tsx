"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Footer from "../components/Footer";
import Contact from "../components/Contact";
// import Card from "../components/Card";
import Hero from "../components/Hero";
import projects from "../lib/data/featuredProjects";

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
        <div className="overflow-hidden">
            <Hero imageRef={imageRef} />
            <section
                id="projects"
                className="py-16 px-4 bg-gray-100 flex flex-col items-center"
            >
                <h2 className="text-5xl font-semibold text-center md:text-left text-[#b08b2e] mb-8 castoro-titling-regular">
                    Featured Projects
                </h2>
                {/* <Card projects={projects} /> */}
            </section>
            <section
                id="contact"
                className="h-screen w-screen flex items-center justify-center bg-gray-200"
            >
                <Contact />
            </section>
            <section
                id="footer"
                className="w-screen flex items-center justify-center bg-[#686058]"
            >
                <Footer />
            </section>
        </div>
    );
};

export default Home;
