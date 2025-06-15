import logo from "../assets/imgs/ShangLogoVertical.webp";
import seal from "../assets/imgs/SPI-DPO-CORSeal-2025-2-1.png.webp";
import kuok from "../assets/imgs/KuokGroup-Logo.webp";
import { Icon } from "@iconify/react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import countryList from 'react-select-country-list';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Stepper, { Step } from "./Stepper"; // Adjust path if needed
import { motion } from "framer-motion";

const accent = '#b08b2e';

const Contact = () => {
  const [phone, setPhone] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'Philippines',
    property: '',
    inquiryType: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepperKey, setStepperKey] = useState(0);

  // Debounced handleChange
  const debouncedSetForm = useRef(
    debounce((name: string, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
    }, 300)
  ).current;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    debouncedSetForm(e.target.name, e.target.value);
  }, [debouncedSetForm]);

  const handleCountryChange = (option: any) => {
    setForm({ ...form, country: option ? option.label : '' });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    if (!form.property.trim()) newErrors.property = 'Property is required';
    if (!form.inquiryType.trim()) newErrors.inquiryType = 'Inquiry type is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields.');
      return;
    }
    setErrors({});
    try {
      await axios.post('http://localhost:5000/routes/inquiry', { ...form, phone });
      toast.success('Inquiry Submitted Successfully!');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Error: ${err.response.data.error}`);
      } else {
        toast.error('Something Went Wrong Unfortunately!');
      }
      console.error(err);
    } finally {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        property: '',
        inquiryType: '',
        message: '',
      });
      setPhone('');
      setStepperKey((k) => k + 1); // Reset Stepper
    }
  };

  const countryOptions = countryList().getData();

  return (
    <section className="bg-white w-full h-full text-gray-900 px-4 py-16 relative overflow-hidden">
      <motion.div
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-10  items-center relative justify-center  z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2 castoro-titling-regular text-[#b08b2e]">Get in touch <span className="italic"></span></h1>
          <p className="mb-6">Please feel free to call, email, or chat with us to learn more about Shang Properties.</p>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-start">
              <Icon icon="mdi:map-marker" className="w-14 h-14 text-[#B08B2E] mr-2" />
              Shangri-La Plaza, Shang Central, EDSA corner Shaw Boulevard, Mandaluyong City, Metro Manila 1550, Philippines
            </p>
            <p className="flex items-start">
              <Icon icon="mdi:phone" className="w-6 h-6 text-[#B08B2E] mr-2" />
              (+63) 997 296 4320
            </p>
            <p className="flex items-start">
              <Icon icon="mdi:email" className="w-6 h-6 text-[#B08B2E] mr-2" />
              guidetoshangproperties.com
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-gray-600">Follow us on our socials</h3>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="mdi:twitter" className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="mdi:facebook" className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="mdi:instagram" className="w-6 h-6" /></a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Stepper Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="w-full"
        >
          <Stepper key={stepperKey} onFinalStepCompleted={handleSubmit}>
            {/* Step 1: Personal Info */}
            <Step>
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex space-x-3">
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
                </div>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={`w-full border ${errors.email ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
                {errors.firstName && <div className="text-red-500 text-xs">{errors.firstName}</div>}
                {errors.lastName && <div className="text-red-500 text-xs">{errors.lastName}</div>}
                {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
              </motion.div>
            </Step>

            {/* Step 2: Country & Phone */}
            <Step>
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(c => c.label === form.country) || null}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                  isClearable
                  classNamePrefix="react-select"
                  className="w-full text-base castoro-titling-regular"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.country ? 'red' : (state.isFocused ? accent : '#e5e7eb'),
                      boxShadow: state.isFocused ? `0 0 0 2px ${accent}33` : undefined,
                      '&:hover': { borderColor: accent },
                      minHeight: 44,
                      fontFamily: 'Castoro Titling, serif',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? accent : state.isFocused ? '#f5f5f5' : '#fff',
                      color: state.isSelected ? '#fff' : '#222',
                      fontFamily: 'Castoro Titling, serif',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: accent,
                      fontFamily: 'Castoro Titling, serif',
                    }),
                  }}
                />
                {errors.country && <div className="text-red-500 text-xs">{errors.country}</div>}
                <PhoneInput
                  country={'ph'}
                  value={phone}
                  onChange={setPhone}
                  inputClass={`!w-full !p-2 !border !rounded ${errors.phone ? '!border-red-500' : '!border-[#b08b2e]'} !focus:ring-2 !focus:ring-[#b08b2e] castoro-titling-regular !text-base`}
                  buttonClass="!border-[#b08b2e] !rounded-l !bg-white hover:!bg-[#f5f5f5]"
                  dropdownClass="!border-[#b08b2e] castoro-titling-regular !rounded !bg-white"
                  containerClass="!w-full"
                />
                {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
              </motion.div>
            </Step>

            {/* Step 3: Inquiry */}
            <Step>
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <input type="text" name="property" value={form.property} onChange={handleChange} placeholder="Property Name" className={`w-full border ${errors.property ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
                {errors.property && <div className="text-red-500 text-xs">{errors.property}</div>}
                <select name="inquiryType" value={form.inquiryType} onChange={handleChange} className={`w-full border ${errors.inquiryType ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`}>
                  <option value="">Type of Inquiry</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                </select>
                {errors.inquiryType && <div className="text-red-500 text-xs">{errors.inquiryType}</div>}
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" className="w-full border border-[#b08b2e] rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition" rows={4}></textarea>
              </motion.div>
            </Step>
          </Stepper>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
