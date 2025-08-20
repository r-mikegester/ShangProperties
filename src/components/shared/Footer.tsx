import logo from "../../assets/imgs/logo/shang/ShangPureWhite.webp";
import seal from "../../assets/imgs/logo/others/SPI-DPO-CORSeal-2025-2-1.png.webp";
import kuok from "../../assets/imgs/logo/others/KuokGroup-Logo.webp";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import Login from "../auth/Login";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Footer = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [footerData, setFooterData] = useState<any>(null);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const docRef = doc(db, "homepage", "content");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFooterData(docSnap.data().footer);
                }
            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        };

        fetchFooterData();
    }, []);

    // Use default data if footerData is not loaded yet
    const data = footerData || {
        address: `Shangri-La Plaza, Shang Central,
                                    EDSA corner Shaw Boulevard,
                                    Mandaluyong City,
                                    Metro Manila 1550,
                                    Philippines`,
        copyright: new Date().getFullYear() + " Shang Properties, Inc. All Rights Reserved.",
        termsUrl: "#",
        privacyUrl: "#",
        links: [
            { label: "Shang Summit", url: "/ShangSummit" },
            { label: "Haraya Residences", url: "/Haraya" },
            { label: "Aurelia Residences", url: "/Aurelia" },
            { label: "Laya Residences", url: "/Laya" },
            { label: "Shang Residences at Wack Wack", url: "/WackWack" },
        ],
        socialLinks: [
            { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=100084197640848', icon: 'streamline-flex:facebook-logo-1-remix' },
            { label: 'Instagram', url: 'https://www.instagram.com/shangproperties.venezia/', icon: 'fa6-brands:instagram' },
            { label: 'Viber', url: 'tel:+639972964320', icon: 'basil:viber-outline' },
            { label: 'WhatsApp', url: 'tel:+639972964320', icon: 'fa6-brands:whatsapp' },
            { label: 'Telegram', url: 'tel:+639972964320', icon: 'gravity-ui:logo-telegram' },
            { label: 'Email', url: 'mailto:guide@shangproperties.com', icon: 'cib:mail-ru' },
        ]
    };

    return (
        <>
            <motion.footer
                className="w-full bg-[#686058]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true }}
            >
                <div className="container px-4 py-8 sm:p-6 pt-10 mx-auto">
                    <div className="flex flex-col lg:flex-row items-start justify-center gap-10 text-center lg:text-left">
                        <div className="flex flex-col items-center w-full lg:w-1/5 px-2 sm:px-6 mb-8 lg:mb-0">
                            <a className="flex flex-col items-center text-xs space-y-3 text-black focus:outline-hidden focus:opacity-80 dark:text-white" href="#" aria-label="Brand">
                                <img src={logo} className="w-32 sm:w-40 mx-auto" />
                                <pre className="text-center whitespace-pre-wrap">{data.address}</pre>
                            </a>
                            <img className="mt-3 w-32 sm:w-40 mx-auto" src={kuok} />
                        </div>
                        <div className="flex flex-col md:flex-row items-start justify-around w-full lg:w-4/5 gap-8">
                            <div className="flex flex-col max-w-96 w-full text-center items-center">
                                <h3 className="text-white uppercase font-semibold">New Developments</h3>
                                {data.links && data.links.length > 0 ? (
                                    data.links.map((link: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            className="block mt-2 text-sm text-white hover:underline"
                                        >
                                            {link.label}
                                        </a>
                                    ))
                                ) : (
                                    <>
                                        <a href="/ShangSummit" className="block mt-2 text-sm text-white hover:underline">Shang Summit</a>
                                        <a href="/Haraya" className="block mt-2 text-sm text-white hover:underline">Haraya Residences</a>
                                        <a href="/Aurelia" className="block mt-2 text-sm text-white hover:underline">Aurelia Residences</a>
                                        <a href="/Laya" className="block mt-2 text-sm text-white hover:underline">Laya Residences</a>
                                        <a href="/WackWack" className="block mt-2 text-sm text-white hover:underline">Shang Residences at Wack Wack</a>
                                    </>
                                )}
                            </div>
                            <div className="flex flex-col items-center justify-center w-full">
                                <h3 className="text-white text-center uppercase font-semibold">Connect with me</h3>
                                <div className="mt-3 xs:w-40 w-full md:max-w-lg grid grid-cols-3 sm:grid-cols-6 px-6 md:grid-cols-2 gap-4 justify-center items-center">
                                    {data.socialLinks && data.socialLinks.length > 0 ? (
                                        data.socialLinks.map((social: any, idx: number) => (
                                            <a 
                                                key={idx} 
                                                href={social.label === 'Email' && social.url ? `mailto:${social.url}` : (social.url || '#')}
                                                className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]"
                                                {...(!social.url ? { onClick: (e) => e.preventDefault() } : {})}
                                            >
                                                <Icon icon={social.icon} className="size-8" />
                                                <span className="hidden md:inline ml-3">{social.label}</span>
                                            </a>
                                        ))
                                    ) : (
                                        <>
                                            <a href="https://www.facebook.com/profile.php?id=100084197640848" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" >
                                                <Icon icon="streamline-flex:facebook-logo-1-remix" className="size-8" /> <span className="hidden md:inline ml-3">Facebook</span>
                                            </a>
                                            <a href="https://www.instagram.com/shangproperties.venezia/" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" >
                                                <Icon icon="fa6-brands:instagram" className="size-8" /> <span className="hidden md:inline ml-3">Instagram</span>
                                            </a>
                                            <a href="tel:+639972964320" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]">
                                                <Icon icon="basil:viber-outline" className="size-8" /> <span className="hidden md:inline ml-3">Viber</span>
                                            </a>
                                            <a href="tel:+639972964320" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]">
                                                <Icon icon="fa6-brands:whatsapp" className="size-8" /> <span className="hidden md:inline ml-3">WhatsApp</span>
                                            </a>
                                            <a href="tel:+639972964320" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]">
                                                <Icon icon="gravity-ui:logo-telegram" className="size-8" /> <span className="hidden md:inline ml-3">Telegram</span>
                                            </a>
                                            <a href="mailto:guide@shangproperties.com" className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]">
                                                <Icon icon="cib:mail-ru" className="size-8" /> <span className="hidden md:inline ml-3">Email</span>
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center md:max-w-40 justify-center w-full">
                                <img src={seal} className="max-w-[100px] sm:max-w-40 w-40 h-auto mx-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-5 mt-5 border-t border-white">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center">
                            <div className="flex flex-wrap items-center gap-3 justify-center w-full md:w-auto">
                                <div className="space-x-4 text-sm">
                                    <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href={data.termsUrl}>Terms</a>
                                    <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href={data.privacyUrl}>Privacy</a>
                                    <button
                                        className="inline-flex gap-x-2 text-neutral-400 hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e] castoro-titling-regular bg-transparent border-none p-0 m-0 cursor-pointer"
                                        onClick={() => setLoginOpen(true)}
                                        type="button"
                                    >
                                        Admin
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-3 w-full md:w-auto">
                                <div>
                                    <div className="text-sm text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                        <p>© {data.copyright}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.footer>
            <Modal open={loginOpen} onClose={() => setLoginOpen(false)}>
                <Login />
            </Modal>
        </>
    );
};

export default Footer;