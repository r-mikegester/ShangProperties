
import { Icon } from "@iconify/react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { AnimatePresence, motion } from "framer-motion";
import countryList from 'react-select-country-list';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Stepper, { Step } from "../../Stepper";
import React from "react";
import projects from '../../../lib/data/featuredProjects';

const accent = '#b08b2e';

const Contact = () => {
  const [phone, setPhone] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'Philippines',
    property: '',
    message: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepperKey, setStepperKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);
  const [stepDirection, setStepDirection] = useState(1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (form.country === '' || form.country.toLowerCase() === 'ph') {
      setForm((prev) => ({ ...prev, country: 'Philippines' }));
    }
  }, [form.country]);

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

  const fieldLabels: { [key: string]: string } = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    country: 'Country',
    phone: 'Phone',
    property: 'Property',
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    return newErrors;
  };
  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.property.trim()) newErrors.property = 'Property is required';
    return newErrors;
  };
  const validateAll = () => {
    return { ...validateStep1(), ...validateStep2() };
  };

  const getMissingFields = (errorsObj: { [key: string]: string }) => {
    return Object.keys(errorsObj)
      .map((key) => fieldLabels[key] || key)
      .join(', ');
  };

  const handleSubmit = async () => {
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const missingFields = getMissingFields(validationErrors);
      toast.error(`Please fill in: ${missingFields}`);
      return;
    }
    setErrors({});
    try {
      await axios.post('http://localhost:5000/api/inquiry', { ...form, phone });
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
        message: '',
      });
      setPhone('');
      setStepperKey((k) => k + 1);
      setMobileStep(0);
    }
  };

  const countryOptions = countryList().getData();

  const ContactInfo = (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
    >
      <h1 className="text-4xl sm:text-5xl font-semibold mb-2 castoro-titling-regular text-center md:text-left text-[#b08b2e]">Get in touch <span className="italic"></span></h1>
      <p className="mb-6 text-center md:text-left">Please feel free to call, email, or chat with us to learn more about Shang Properties.</p>
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
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="streamline-flex:facebook-logo-1-remix" className="w-6 h-6" /></a>
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="fa6-brands:instagram" className="w-6 h-6" /></a>
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="basil:viber-outline" className="w-6 h-6" /></a>
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="fa6-brands:whatsapp" className="w-6 h-6" /></a>
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="gravity-ui:logo-telegram" className="w-6 h-6" /></a>
          <a href="#" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="cib:mail-ru" className="w-6 h-6" /></a>

        </div>
      </div>
      {isMobile && (
        <button
          className="mt-8 w-full bg-[#b08b2e] sticky bottom-0 text-white py-3 rounded font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
          onClick={() => {
            setStepDirection(1);
            setMobileStep(1);
          }}
        >
          Get Started
        </button>
      )}
    </motion.div>
  );

  const FormStepper = (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full"
    >
      <Stepper
        key={stepperKey}
        onFinalStepCompleted={handleSubmit}
        onStepChange={(step) => {
          if (step === 1) {
            const validationErrors = validateStep1();
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              const missingFields = getMissingFields(validationErrors);
              toast.error(`Please fill in: ${missingFields}`);
              return;
            } else {
              setErrors({});
            }
          }
          if (step === 2) {
            const validationErrors = validateStep2();
            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              const missingFields = getMissingFields(validationErrors);
              toast.error(`Please fill in: ${missingFields}`);
              return;
            } else {
              setErrors({});
            }
          }
        }}
      >
        {/* Step 1: Personal Info */}
        <Step>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex space-x-3">
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
            </div>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={`w-full border ${errors.email ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`} required />
            <PhoneInput
              country={'ph'}
              value={phone}
              onChange={(value: string) => {
                setPhone(value);
              }}
              inputClass={`!w-full !p-2 !border !rounded ${errors.phone || errors.country ? '!border-red-500' : '!border-[#b08b2e]'} !focus:ring-2 !focus:ring-[#b08b2e] castoro-titling-regular !text-base`}
              buttonClass="!border-[#b08b2e] !rounded-l !bg-white hover:!bg-[#f5f5f5]"
              dropdownClass="!border-[#b08b2e] castoro-titling-regular !rounded !bg-white"
              containerClass="!w-full"
              dropdownStyle={{ top: 'auto', bottom: '100%', zIndex: 2999, maxHeight: 250, overflowY: 'auto' }}
            />
            {(errors.phone || errors.country) && <div className="text-red-500 text-xs">{errors.phone || errors.country}</div>}
            {errors.firstName && <div className="text-red-500 text-xs">{errors.firstName}</div>}
            {errors.lastName && <div className="text-red-500 text-xs">{errors.lastName}</div>}
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </motion.div>
        </Step>
        {/* Step 2: Country & Phone */}
        <Step>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <select
              name="property"
              value={form.property}
              onChange={handleChange}
              className={`w-full border ${errors.property ? 'border-red-500' : 'border-[#b08b2e]'} rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition`}
              required
            >
              <option value="">Select Property</option>
              {projects.map((project) => (
                <option key={project.id} value={project.formalName || project.title}>
                  {project.formalName || project.title}
                </option>
              ))}
            </select>
            {errors.property && <div className="text-red-500 text-xs">{errors.property}</div>}
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" className="w-full border border-[#b08b2e] rounded p-2 focus:ring-2 focus:ring-[#b08b2e] castoro-titling-regular transition" rows={4}></textarea>
          </motion.div>
        </Step>
      </Stepper>
    </motion.div>
  );

  return (
    <section className="bg-white w-full h-full text-gray-900 px-4 md:py-16 py-5 relative overflow-hidden">
      {isMobile ? (
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mobileStep}
              initial={{ x: stepDirection === 1 ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: stepDirection === 1 ? -100 : 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32, duration: 0.35 }}
            >
              {mobileStep === 1 && (
                <div className="flex items-center mb-4">
                  <button
                    className="flex items-center text-[#b08b2e] font-semibold text-base focus:outline-none mr-2"
                    onClick={() => {
                      setStepDirection(-1);
                      setMobileStep(0);
                    }}
                    aria-label="Back"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                  <span className=" text-center text-lg font-semibold text-[#b08b2e]">Contact Form</span>
                </div>
              )}
              {mobileStep === 0 ? (
                React.cloneElement(ContactInfo, {
                  key: 'info',
                  isMobile,
                  setMobileStep: (step: number) => { setStepDirection(1); setMobileStep(step); }
                })
              ) : (
                React.cloneElement(FormStepper, { key: 'form' })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-10  items-center relative justify-center  z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {ContactInfo}
          {FormStepper}
        </motion.div>
      )}
    </section>
  );
};

export default Contact;
