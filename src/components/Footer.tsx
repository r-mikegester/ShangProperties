import logo from "../assets/imgs/ShangLogoVertical.webp";
import seal from "../assets/imgs/SPI-DPO-CORSeal-2025-2-1.png.webp";
import kuok from "../assets/imgs/KuokGroup-Logo.webp";
import { Icon } from "@iconify/react";

const Footer = () => {
    return (
        <footer className="w-full ">
            <div className="container p-6 pt-10 mx-auto">
                <div className="lg:flex">
                    <div className="w-full -mx-6 lg:w-2/5">
                        <div className="px-6">
                            <a className="flex-none text-xs space-y-3 text-black focus:outline-hidden focus:opacity-80 dark:text-white" href="#" aria-label="Brand">
                                <img src={logo} className="w-40" />
                                <pre>Shangri-La Plaza, Shang Central, <br />
                                    EDSA corner Shaw Boulevard, <br />
                                    Mandaluyong City, <br />
                                    Metro Manila 1550,
                                    Philippines
                                </pre>
                            </a>
                            <img className="mt-3 w-40" src={kuok} />
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:flex-1">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                            <div>
                                <h3 className="text-white uppercase font-semibold">New Developments</h3>
                                <a href="#" className="block mt-2 text-sm text-white  hover:underline">Shang Summit</a>
                                <a href="#" className="block mt-2 text-sm text-white  hover:underline">Haraya Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white  hover:underline">Aurelia Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white  hover:underline">Laya Residences</a>
                                <a href="#" className="block mt-2 text-sm text-white  hover:underline">Shang Residences at Wack Wack</a>
                            </div>

                            <div className="flex flex-col items-center ">
                                <h3 className="text-white uppercase font-semibold">Connect with me</h3>
                                <div className="mt-3 w-40 grid grid-cols-3 gap-4 justify-center items-center">
                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="streamline-flex:facebook-logo-1-remix" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="fa6-brands:instagram" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="basil:viber-outline" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="fa6-brands:whatsapp" className="size-10" />
                                    </a>

                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="gravity-ui:logo-telegram" className="size-10" />
                                    </a>
                                    <a className="flex justify-center items-center text-white hover:text-gray-400 focus:outline-hidden focus:text-gray-400 " href="#">
                                        <Icon icon="cib:mail-ru" className="size-10" />
                                    </a>
                                </div>
                            </div>


                            <div className="flex items-center justify-center">
                                <img src={seal} className="" />
                            </div>
                        </div>

                        
                    </div>
                </div>

                  <div className="pt-5 mt-5 border-t border-white">
                <div className="sm:flex sm:justify-between sm:items-center">
                    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <div className="space-x-4 text-sm text-center">
                            <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">Terms</a>
                            <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">Privacy</a>
                            <a className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200" href="#">Admin</a>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-3">

                        <div>
                            <div className="text-sm  text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200">
                                <p>© 2025 Shang Properties, Inc. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                    {/* End Col */}
                </div>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
