import logo from "../assets/imgs/ShangLogoVertical.webp";
import seal from "../assets/imgs/SPI-DPO-CORSeal-2025-2-1.png.webp";
import kuok from "../assets/imgs/KuokGroup-Logo.webp";
import { Icon } from "@iconify/react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState } from "react";
import countryList from 'react-select-country-list';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const [phone, setPhone] = useState('');
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        property: '',
        inquiryType: '',
        awareness: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/routes/inquiry', { ...form, phone });
            toast.success('Inquiry Submitted Succesfully!');
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                country: '',
                property: '',
                inquiryType: '',
                awareness: '',
                message: '',
            });
            setPhone('');
        } catch (err) {
            toast.error('Something Went Wrong Unfortunately!');
            console.error(err);
        }
    };

    return (
        <section className="bg-white w-screen text-gray-900">
            <div className="container px-6 py-12 mx-auto">
                <div className="lg:flex lg:items-center lg:-mx-6">
                    <div className="lg:w-1/2 lg:mx-6">
                        <h1 className="text-5xl font-semibold text-gray-800 capitalize">
                            Get in touch <span className="italic">With Us</span>
                        </h1>
                        <p>Please feel free to call, email, or chat with us to learn more about Shang Properties.</p>

                        <div className="mt-6 space-y-8 md:mt-8">
                            <p className="flex items-start -mx-2">
                                <Icon icon="mdi:map-marker" className="w-6 h-6 mx-2 text-blue-500" />
                                <span className="mx-2 text-gray-700 truncate w-96 wrap-normal">
                                    Shangri-La Plaza, Shang Central, EDSA corner Shaw Boulevard,  Mandaluyong City, Metro Manila 1550, Philippines
                                </span>
                            </p>

                            <p className="flex items-start -mx-2">
                                <Icon icon="mdi:phone" className="w-6 h-6 mx-2 text-blue-500" />
                                <span className="mx-2 text-gray-700 truncate w-72">pHONE nUMBER</span>
                            </p>

                            <p className="flex items-start -mx-2">
                                <Icon icon="mdi:email" className="w-6 h-6 mx-2 text-blue-500" />
                                <span className="mx-2 text-gray-700 truncate w-72">acb@example.com</span>
                            </p>
                        </div>

                        <div className="mt-6 w-80 md:mt-8">
                            <h3 className="text-gray-600  ">Follow us on our socials</h3>

                            <div className="flex mt-4 -mx-1.5">
                                <a className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#" aria-label="Twitter">
                                    <Icon icon="mdi:twitter" className="w-8 h-8" />
                                </a>
                                <a className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#" aria-label="LinkedIn">
                                    <Icon icon="mdi:linkedin" className="w-8 h-8" />
                                </a>
                                <a className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#" aria-label="Facebook">
                                    <Icon icon="mdi:facebook" className="w-8 h-8" />
                                </a>
                                <a className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500" href="#" aria-label="Instagram">
                                    <Icon icon="mdi:instagram" className="w-8 h-8" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 lg:w-1/2 lg:mx-6">
                        <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white rounded-2xl shadow-2xl lg:max-w-3xl shadow-gray-300/50 dark:shadow-black/50">
                            <h1 className="text-lg font-medium text-gray-700">Kindly fill-up this form!</h1>

                            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                                <div className="flex space-x-3">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm text-gray-600">First Name</label>
                                        <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="Juan" className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm text-gray-600">Last Name</label>
                                        <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Dela Cruz" className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md" />
                                    </div>

                                </div>

                                <div className="flex space-x-3">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm text-gray-600">Email Address</label>
                                        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="juandelacruz@example.com" className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md" />
                                    </div>

                                </div>



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm text-gray-600">Phone Number</label>
                                        <PhoneInput
                                            country={'ph'}
                                            value={phone}
                                            onChange={setPhone}
                                            enableSearch
                                            inputClass="!w-full !py-6 !px-16 !border !border-gray-200 !rounded-lg !text-gray-700"
                                            buttonClass="!border-gray-200 !rounded-lg !px-2  !text-gray-700"
                                            containerClass="!w-full !rounded-lg "
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-gray-600">Country</label>
                                        <select name="country" value={form.country} onChange={handleChange} className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md">
                                            <option value="">Select Country</option>
                                            {countryList().getData().map((country) => (
                                                <option key={country.value} value={country.label}>{country.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-gray-600">Property</label>
                                        <select name="property" value={form.property} onChange={handleChange} className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md">
                                            <option value="">Select Property</option>
                                            <option>Aurelia</option>
                                            <option>Haraya</option>
                                            <option>Laya</option>
                                            <option>Shang Summit</option>
                                            <option>WackWack</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-gray-600">Type of Inquiry</label>
                                        <select name="inquiryType" value={form.inquiryType} onChange={handleChange} className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md">
                                            <option value="">Select Inquiry Type</option>
                                            <option>Sales</option>
                                            <option>Leasing</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    {/* <div>
                                        <label className="block mb-2 text-sm text-gray-600">Source of Awareness</label>
                                        <select name="awareness" value={form.awareness} onChange={handleChange} className="block w-full px-4 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md">
                                            <option value="">Select Source</option>
                                            <option>Facebook</option>
                                            <option>Instagram</option>
                                            <option>Referral</option>
                                            <option>Search Engine</option>
                                        </select>
                                    </div> */}


                                </div>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Enter your message"
                                    className="w-full p-3 border rounded-lg"
                                    rows={5}
                                />

                                <div className="pt-4">
                                    <button type="submit" className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700">Submit</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
