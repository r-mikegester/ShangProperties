import { Icon } from "@iconify/react";
import Contact from "../../components/client/Contact";
import InquireSheet from "../../components/InquireSheet";
import { useState, useEffect } from "react";
import Footer from "../../components/shared/Footer";
import { LayoutGrid } from "../../components/LayoutGrid";
import FullscreenImage from "../../components/FullscreenImage";
import { Link, useParams } from "react-router-dom";
import FloatingContactButton from '../../components/FloatingContactButton';
import { db } from "../../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { SmoothHoverMenuItem } from "../../components/admin/SmoothHoverMenuItem";

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [otherProjects, setOtherProjects] = useState<any[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getDoc(doc(db, "projects", id))
            .then((snap) => {
                if (snap.exists()) {
                    setProject({ id: snap.id, ...snap.data() });
                } else {
                    setError("Project not found");
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        // Fetch all projects for sidebar
        setSidebarLoading(true);
        getDocs(collection(db, "projects"))
            .then((snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setOtherProjects(data.filter((p) => p.id !== id));
            })
            .finally(() => setSidebarLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-16 text-gray-500">Loading project...</div>;
    if (error || !project) return <div className="text-center py-16 text-red-500">{error || "Project not found"}</div>;

    const galleryCards = [
        ...(project.gallery || []).map((img: string, i: number) => ({
            id: i,
            content: <span className="text-white text-lg">{project.formalName || project.title} Gallery {i + 1}</span>,
            className: "h-60",
            thumbnail: img,
        })),
        {
            id: (project.gallery || []).length,
            content: <span className="text-white text-lg">{project.formalName || project.title} Main Image</span>,
            className: "h-72 sm:h-96 lg:h-full",
            thumbnail: project.image,
        }
    ];

    return (
        <>
            <div className="bg-[#686058] h-20 w-full"></div>
            <div className="p-4 sm:p-6 bg-gray-100">
                <div className="max-w-[85rem] h-full px-2 sm:px-4 lg:px-8 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
                        {/* Content */}
                        <div className="lg:col-span-2">
                            <div className="py-6 sm:py-8 lg:pe-8">
                                <div className="space-y-5 lg:space-y-8">
                                    <Link className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline focus:outline-hidden focus:underline" to="/">
                                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        Back to Home
                                    </Link>

                                    <h2 className="text-3xl font-bold lg:text-5xl castoro-titling-regular">{project.formalName || project.title}</h2>

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
                                            alt={project.formalName || project.title}
                                            caption={project.sm}
                                            className="w-full object-cover rounded-xl cursor-pointer"
                                            tours360={project.tours360}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* End Content */}

                        {/* Sidebar */}
                        <div className="lg:col-span-1 lg:w-full lg:h-full lg:bg-linear-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent">
                            <div className="sticky top-0 start-0 py-6 sm:py-8 lg:ps-8">
                                {/* Avatar Media */}
                                <div className="group flex flex-col sm:flex-row items-center gap-3 border-b border-gray-200 pb-8 mb-8 text-center sm:text-left">
                                    <a className="block shrink-0 focus:outline-hidden" href="#">
                                        <img
                                            className="size-10 rounded-full mx-auto sm:mx-0"
                                            src="https://6ovgprfdguxo1bkn.public.blob.vercel-storage.com/VeneziaEspiritu.jpg?w=80&q=80&f=webp"
                                            alt="Avatar"
                                            loading="lazy"
                                        />
                                    </a>
                                    <a className="group grow block focus:outline-hidden" href="">
                                        <h5 className="group-hover:text-gray-600 group-focus:text-gray-600 text-sm font-semibold text-gray-800">
                                            Venezia Espiritu
                                        </h5>
                                    </a>
                                    <div className="grow w-full sm:w-auto mt-3 sm:mt-0">
                                        <div className="flex justify-center sm:justify-end">
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
                                    <div className="flex flex-col gap-4 max-w-full py-2">
                                        {sidebarLoading ? (
                                            Array.from({ length: 4 }).map((_, idx) => (
                                                <div key={idx} className="h-20 bg-gray-200 rounded-xl shadow animate-pulse"></div>
                                            ))
                                        ) : (
                                            otherProjects.map((p) => (
                                                <Link to={`/projects/${p.id}`} key={p.id} className="block">
                                                    <SmoothHoverMenuItem transitionDelayInMs={200}>
                                                        <div className="flex items-center gap-4">
                                                            <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                                                                <img
                                                                    src={`${p.image}?w=128&q=80&f=webp`}
                                                                    alt={p.title}
                                                                    className="w-full h-full object-cover object-center"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-base sm:text-lg font-semibold text-gray-800 castoro-titling-regular truncate">
                                                                    {p.formalName || p.title}
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                                    {p.address || p.project_type}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SmoothHoverMenuItem>
                                                </Link>
                                            ))
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

export default ProjectDetail;
