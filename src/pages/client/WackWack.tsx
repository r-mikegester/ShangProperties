import { Icon } from "@iconify/react";
import Contact from "../../components/client/Contact";
import InquireSheet from "../../components/InquireSheet";
import { useState } from "react";
import Footer from "../../components/shared/Footer";
import { LayoutGrid } from "../../components/LayoutGrid";
import FullscreenImage from "../../components/FullscreenImage";
import projects from "../../data/ProjectsIndex";
import { Link } from "react-router-dom";
import FloatingContactButton from '../../components/FloatingContactButton';
import React from "react";

const WackWack = () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    // Always select Shang-Residences-at-Wack-Wack project
    const project = projects.find((p) => p.title === "WackWack");

    // Simulate loading (replace with real data fetching if needed)
    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (!project) return <div>Project not found.</div>;

    // Find other projects for sidebar
    const otherProjects = projects.filter((p) => p.id !== project.id);

    const galleryCards = [
        ...project.gallery.map((img, i) => ({
            id: i,
            content: <span className="text-white text-lg">{project.formalName} Gallery {i + 1}</span>,
            className: "h-60",
            thumbnail: img,
        })),
        {
            id: project.gallery.length,
            content: <span className="text-white text-lg">{project.formalName} Main Image</span>,
            className: "h-72 sm:h-96 lg:h-full",
            thumbnail: project.image,
        }
    ];

    return (
        <>
            <div className="bg-[#686058] h-20 w-full"></div>
            <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
                <div className="max-w-[85rem] h-full px-2 sm:px-4 lg:px-8 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
                        {/* Content */}
                        <div className="lg:col-span-2">
                            <div className="py-6 sm:py-8 lg:pe-8">
                                <div className="space-y-5 lg:space-y-8">
                                    <a className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline focus:outline-hidden focus:underline" href="/">
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        Back to Home
                                    </a>

                                    <h2 className="text-3xl font-bold lg:text-5xl castoro-titling-regular">{project.formalName}</h2>

                                    {/* <div className="flex items-center gap-x-5">
                                        <a className="inline-flex items-center gap-1.5 py-1 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200" href="#">
                                            Location
                                        </a>
                                        You can add a date property to your data if needed
                                    </div> */}

                                    <p className="text-lg text-gray-800">{project.description}</p>
                                    <div className="text-center">
                                        <LayoutGrid cards={galleryCards} />
                                        <span className="mt-3 block text-sm text-center text-gray-500">
                                            Your Gateway to Convenience and Exploration
                                        </span>
                                    </div>

                                    <p className="text-lg text-gray-800">{project.description2}</p>

                                    <blockquote className="text-center p-4 sm:px-7">
                                        <p className="text-3xl castoro-titling-regular font-medium text-gray-800 lg:text-3xl lg:leading-normal xl:text-4xl xl:leading-normal">
                                            Project Details
                                        </p>
                                    </blockquote>

                                    {/* Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="proicons:location" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">ADDRESS</p>
                                            <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap break-words">{project.address}</pre>
                                        </div>
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="ph:buildings" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">PROJECT TYPE</p>
                                            <p className="mt-1 text-sm text-gray-600 break-words">{project.project_type}</p>
                                        </div>
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="ant-design:team-outlined" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">DESIGN TEAM</p>
                                            <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap break-words">{project.design_team}</pre>
                                        </div>
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="uil:briefcase" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">NO. OF UNITS</p>
                                            <p className="mt-1 text-sm text-gray-600 break-words">{project.noofunits}</p>
                                        </div>
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="heroicons:paper-clip-solid" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">PRODUCT MIX</p>
                                            <p className="mt-1 text-sm text-gray-600 break-words">{project.productmix}</p>
                                        </div>
                                        <div className="p-4 border border-[#686058] rounded-lg hover:bg-white">
                                            <Icon icon="mynaui:map" className="w-10 h-10 text-[#AD8A19]" />
                                            <p className="font-semibold text-sm text-gray-800 castoro-titling-regular">DEVELOPER</p>
                                            <p className="mt-1 text-sm text-gray-600 break-words">{project.developer}</p>
                                        </div>
                                    </div>
                                    {/* End Grid */}

                                     {project.tours360 && project.tours360.length > 0 && (
                                        <FullscreenImage
                                            src={project.image}
                                            alt={project.formalName}
                                            caption={project.sm}
                                            className="w-full object-cover rounded-xl cursor-pointer"
                                            tours360={project.tours360}
                                        />
                                    )}

                                    {/* ... badges/tags and buttons can also be made dynamic if you add them to your data ... */}
                                </div>
                            </div>
                        </div>
                        {/* End Content */}

                        {/* Sidebar */}
                        <div className="lg:col-span-1 w-full h-full bg-white/80 lg:bg-linear-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                            <div className="py-6 px-2 sm:px-0 lg:sticky lg:top-0 lg:start-0 lg:py-8 lg:ps-8">
                                {/* Avatar Media */}
                                <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8">
                                    <a className="block shrink-0 focus:outline-hidden" href="#">
                                        <img className="size-10 rounded-full" src="https://frfgvl8jojjhk5cp.public.blob.vercel-storage.com/VeneziaEspiritu.jpg" alt="Avatar" />
                                    </a>
                                    <a className="group grow block focus:outline-hidden" href="">
                                        <h5 className="group-hover:text-gray-600 group-focus:text-gray-600 text-sm font-semibold text-gray-800">
                                            Venezia Espiritu
                                        </h5>
                                    </a>
                                    <div className="grow">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="py-1.5 px-4 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-[#b08b2e] text-white hover:bg-[#8a6c1d] focus:outline-hidden focus:bg-[#8a6c1d] disabled:opacity-50 disabled:pointer-events-none transition"
                                                onClick={() => setSheetOpen(true)}
                                            >
                                                Inquire Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* End Avatar Media */}

                                <div className="space-y-6">
                                    <h1 className="font-semibold text-2xl sm:text-3xl castoro-titling-regular text-center sm:text-left">Other Projects</h1>
                                    <div className="flex flex-col gap-4 max-w-full overflow-x-auto">
                                    {loading ? (
                                        // Skeleton loaders for sidebar projects
                                        Array.from({ length: 4 }).map((_, idx) => (
                                            <div key={idx} className="flex items-center gap-x-4 sm:gap-x-6 animate-pulse min-w-0">
                                                <div className="grow min-w-0">
                                                    <span className="block h-6 w-32 bg-gray-300 rounded mb-2"></span>
                                                </div>
                                                <div className="shrink-0 relative rounded-lg overflow-hidden size-16 sm:size-20 bg-gray-300"></div>
                                            </div>
                                        ))
                                    ) : (
                                        otherProjects.map((p) => {
                                            // Map project title to new route path
                                            let route = "/";
                                            switch (p.title) {
                                                case "Laya":
                                                    route = "/Laya";
                                                    break;
                                                case "ShangSummit":
                                                    route = "/ShangSummit";
                                                    break;
                                                case "Haraya":
                                                    route = "/Haraya";
                                                    break;
                                                case "Aurelia":
                                                    route = "/Aurelia";
                                                    break;
                                                case "WackWack":
                                                    route = "/WackWack";
                                                    break;
                                                default:
                                                    route = "/";
                                            }
                                            return (
                                                <Link className="group flex items-center gap-x-4 sm:gap-x-6 focus:outline-hidden min-w-0" to={route} key={p.id}>
                                                    <div className="grow min-w-0">
                                                        <span className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 castoro-titling-regular truncate block">
                                                            {p.formalName}
                                                        </span>
                                                    </div>
                                                    <div className="shrink-0 relative rounded-lg overflow-hidden size-16 sm:size-20">
                                                        <img className="size-full absolute top-0 start-0 object-cover rounded-lg" src={p.image} alt={p.title} loading="lazy" />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Sidebar */}
                    </div>
                </div>
            </div>
            <InquireSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
                <Contact />
            </InquireSheet>
            <Footer />
            <FloatingContactButton />
        </>
    );
};

export default WackWack;
