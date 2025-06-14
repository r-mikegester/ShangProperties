import logo from "../../assets/logos/shang/ShangPureWhite.png";
import seal from "../../assets/logos/others/SPI-DPO-CORSeal-2025-2-1.png.webp";
import kuok from "../../assets/logos/others/KuokGroup-Logo.webp";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "../Modal";
import Login from "../auth/Login";

const Footer = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    return (
        <>
            <motion.footer
                className="w-full bg-[#686058]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true }}
            >
                <div className="container p-6 pt-10 mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
                        {/* Left: Logo and Address */}
                        <div className="flex flex-col items-center w-full lg:w-2/5 px-6 mb-8 lg:mb-0">
                            <a className="flex flex-col items-center text-xs space-y-3 text-black focus:outline-hidden focus:opacity-80 dark:text-white" href="#" aria-label="Brand">
                                <img src={logo} className="w-40 mx-auto" />
                                <pre className="text-center whitespace-pre-wrap">Shangri-La Plaza, Shang Central,
                                    EDSA corner Shaw Boulevard,
                                    Mandaluyong City,
                                    Metro Manila 1550,
                                    Philippines
                                </pre>
                            </a>
                            <img className="mt-3 w-40 mx-auto" src={kuok} />
                        </div>
                        {/* Center: Developments and Socials */}
                        <div className="flex flex-col items-center w-full lg:w-2/5 gap-8">
                            <div className="flex flex-col w-full text-center items-center">
                                <h3 className="text-white uppercase font-semibold">New Developments</h3>
                                <a href="#" className="block mt-2 text-sm text-white hover:underline">Shang Summit</a>
                                <a href="#" className="block mt-2 text-sm text-white hover:underline">Haraya Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white hover:underline">Aurelia Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white hover:underline">Laya Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white hover:underline">Shang Residences at Wack Wack</a>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-white uppercase font-semibold">Connect with me</h3>
                                <div className="mt-3 w-full max-w-xs grid grid-cols-3 gap-4 justify-center items-center">
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="streamline-flex:facebook-logo-1-remix" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="fa6-brands:instagram" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="basil:viber-outline" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="fa6-brands:whatsapp" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="gravity-ui:logo-telegram" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-[#b08b2e] focus:outline-hidden focus:text-[#b08b2e]" href="#">
                                        <Icon icon="cib:mail-ru" className="size-10" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <img src={seal} className="max-w-[120px] w-full h-auto mx-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="pt-5 mt-5 border-t border-white">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center">
                            <div className="flex flex-wrap items-center gap-3 justify-center w-full md:w-auto">
                                <div className="space-x-4 text-sm">
                                    <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">Terms</a>
                                    <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">Privacy</a>
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
                                        <p>© 2025 Shang Properties, Inc. All Rights Reserved.</p>
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
