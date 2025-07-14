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
import Stepper, { Step, StepperRef } from "../../Stepper";
import React from "react";
import projects from '../../../lib/data/featuredProjects';
import Select from 'react-select';

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
  const [currentStep, setCurrentStep] = useState(1);
  const stepperRef = useRef<StepperRef>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  // Validate all fields (for final step)
  const validateAll = () => {
    return { ...validateStep1(), ...validateStep2() };
  };

  const getMissingFields = (errorsObj: { [key: string]: string }) => {
    return Object.keys(errorsObj)
      .map((key) => fieldLabels[key] || key)
      .join(', ');
  };

  const handleSubmit = async () => {
    // Validate all fields on final submit
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const missingFields = getMissingFields(validationErrors);
      toast.error(`Please fill in: ${missingFields}`);
      return false;
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
      setCurrentStep(1);
    }
    return true;
  };

  const countryOptions = countryList().getData();

  const ContactInfo = (isMobile: boolean, setMobileStep: (step: number) => void, setStepDirection: (dir: number) => void) => (
    <div className="flex justify-center items-center h-full w-full p-3">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-5xl font-semibold mb-2 castoro-titling-regular text-center md:text-left text-[#b08b2e]">Get in touch <span className="italic"></span></h1>
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
        <div className="mt-20 md:mt-10 flex flex-col justify-center items-center md:items-start">
          <h3 className="text-gray-600">Follow us on our socials</h3>
          <div className="flex mt-4 space-x-4">
            <a href="https://www.facebook.com/profile.php?id=100084197640848" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="streamline-flex:facebook-logo-1-remix" className="w-6 h-6" /></a>
            <a href="https://www.instagram.com/shangproperties.venezia/" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="fa6-brands:instagram" className="w-6 h-6" /></a>
            <a href="tel:+639972964320" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="basil:viber-outline" className="w-6 h-6" /></a>
            <a href="tel:+639972964320" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="fa6-brands:whatsapp" className="w-6 h-6" /></a>
            <a href="tel:+639972964320" className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="gravity-ui:logo-telegram" className="w-6 h-6" /></a>
            <a className="text-gray-400 hover:text-[#B08B2E] transition-colors"><Icon icon="cib:mail-ru" className="w-6 h-6" /></a>
          </div>
        </div>
        {isMobile && (
          <button
            className="mt-8 w-full bg-[#b08b2e] sticky bottom-0 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
            onClick={() => {
              setStepDirection(1);
              setMobileStep(1);
            }}
          >
            Get Started
          </button>
        )}
      </motion.div>
    </div>
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
        initialStep={1}
        onStepChange={setCurrentStep}
        ref={stepperRef}
        nextButtonProps={{
          onClick: (e: any) => {
            e.preventDefault();
            if (stepperRef.current) {
              if (stepperRef.current.getCurrentStep() === 1) {
                const validationErrors = validateStep1();
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  const missingFields = getMissingFields(validationErrors);
                  toast.error(`Please fill in: ${missingFields}`);
                  return;
                }
                setErrors({});
                stepperRef.current.next();
              } else if (stepperRef.current.getCurrentStep() === 2) {
                const validationErrors = validateStep2();
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  const missingFields = getMissingFields(validationErrors);
                  toast.error(`Please fill in: ${missingFields}`);
                  return;
                }
                setErrors({});
                stepperRef.current.next();
              }
            }
          },
        }}
        backButtonProps={{
          onClick: (e: any) => {
            e.preventDefault();
            setErrors({});
            if (stepperRef.current) stepperRef.current.back();
          },
        }}
      >
        {/* Step 1: Personal Info */}
        <Step>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex space-x-3">
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
            </div>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={`w-full border ${errors.email ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
            <PhoneInput
              country={'ph'}
              value={phone}
              onChange={(value: string) => {
                setPhone(value);
              }}
              inputClass={`!w-full !p-2 !px-14 !border !rounded-lg !h-11 !text-base ${errors.phone || errors.country ? '!border-red-500' : '!border-[#b08b2e]'} !focus:ring-2 !focus:ring-[#b08b2e] castoro-titling-regular`}
              buttonClass="!border-[#b08b2e] !rounded-lg !bg-white hover:!bg-[#f5f5f5] !h-11 !px-1"
              dropdownClass="!border-[#b08b2e] castoro-titling-regular !rounded !bg-white !z-[2999]"
              containerClass="!w-full"
              dropdownStyle={{ top: 'auto', bottom: '40%', zIndex: 2999, maxHeight: 200, overflowY: 'auto', position: 'fixed' }}
            />
            {(errors.phone || errors.country) && <div className="text-red-500 text-xs">{errors.phone || errors.country}</div>}
            {errors.firstName && <div className="text-red-500 text-xs">{errors.firstName}</div>}
            {errors.lastName && <div className="text-red-500 text-xs">{errors.lastName}</div>}
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
            {/* Step 1: Next only */}
            <div className="flex mt-6">
              <button
                className="w-full bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                onClick={(e) => {
                  e.preventDefault();
                  const validationErrors = validateStep1();
                  if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    const missingFields = getMissingFields(validationErrors);
                    toast.error(`Please fill in: ${missingFields}`);
                    return;
                  }
                  setErrors({});
                  if (stepperRef.current) stepperRef.current.next();
                }}
              >
                Next
              </button>
            </div>
          </motion.div>
        </Step>
        {/* Step 2: Property & Message */}
        <Step>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-2">
              <Select
                name="property"
                value={form.property ? { value: form.property, label: form.property } : null}
                onChange={option => setForm(prev => ({ ...prev, property: option ? option.value : '' }))}
                options={projects.map(project => ({ value: project.formalName || project.title, label: project.formalName || project.title }))}
                placeholder="Select Property"
                isClearable
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: errors.property ? '#ef4444' : '#b08b2e',
                    boxShadow: state.isFocused ? '0 0 0 2px #b08b2e33' : base.boxShadow,
                    borderRadius: '0.5rem',
                    minHeight: '44px',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#b08b2e' : state.isFocused ? '#f7f3e9' : '#fff',
                    color: state.isSelected ? '#fff' : '#222',
                    fontWeight: state.isSelected ? 600 : 400,
                    fontFamily: 'inherit',
                  }),
                  menu: base => ({
                    ...base,
                    zIndex: 2999,
                    borderRadius: '0.5rem',
                    boxShadow: '0 8px 24px 0 #b08b2e22',
                  }),
                }}
              />
              {errors.property && <div className="text-red-500 text-xs mt-1">{errors.property}</div>}
            </div>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" className="w-full border border-[#b08b2e] rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition" rows={4}></textarea>
            {/* Step 2: Back and Next */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-gray-200 text-[#b08b2e] py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-300 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setErrors({});
                  if (stepperRef.current) stepperRef.current.back();
                }}
              >
                Back
              </button>
              <button
                className="flex-1 bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                onClick={(e) => {
                  e.preventDefault();
                  const validationErrors = validateStep2();
                  if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    const missingFields = getMissingFields(validationErrors);
                    toast.error(`Please fill in: ${missingFields}`);
                    return;
                  }
                  setErrors({});
                  if (stepperRef.current) stepperRef.current.next();
                }}
              >
                Next
              </button>
            </div>
          </motion.div>
        </Step>
        {/* Step 3: Review & Submit */}
        <Step>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-lg font-semibold mb-2">Review your information</h2>
            <div className="bg-[#f7f3e9] rounded-lg p-4">
              <div className="mb-2"><span className="font-semibold">Full Name:</span> {form.firstName}<span className="ml-2">{form.lastName}</span> </div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {form.email}</div>
              <div className="flex space-x-3">
                <div className="mb-2"><span className="font-semibold">Phone:</span> {phone}</div><div className="mb-2"><span className="font-semibold">Country:</span> {form.country}</div>
              </div>
              <div className="mb-2"><span className="font-semibold">Property:</span> {form.property}</div>
              <div className="mb-2"><span className="font-semibold">Message:</span> {form.message}</div>
            </div>
            {Object.keys(errors).length > 0 && (
              <div className="text-red-500 text-xs">
                {Object.values(errors).map((err, idx) => <div key={idx}>{err}</div>)}
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 bg-gray-200 text-[#b08b2e] py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-300 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setErrors({});
                  if (stepperRef.current) stepperRef.current.back();
                }}
              >
                Back
              </button>
              <button
                className="flex-1 bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                onClick={async (e) => {
                  e.preventDefault();
                  await handleSubmit();
                }}
              >
                Submit Inquiry
              </button>
            </div>
          </motion.div>
        </Step>
      </Stepper>
    </motion.div>
  );

  return (
    <section className="bg-white max-w-full h-full text-gray-900 flex justify-center md:py-16 py-5 overflow-hidden">
      {isMobile ? (
        <div className="w-full flex flex-col px-0 ">
          {mobileStep === 1 && (
            <div className="w-full flex items-center justify-center h-16 border-b border-[#b08b2e]/20 shadow-b-sm mb-4 relative">
              <button
                className="absolute left-4 flex items-center text-[#b08b2e] font-semibold text-base focus:outline-none"
                onClick={() => {
                  setStepDirection(-1);
                  setMobileStep(0);
                }}
                aria-label="Back"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
              <span className="flex-1 text-center text-lg font-semibold text-[#b08b2e]">Contact Form</span>
            </div>
          )}
          {/* Mobile Stepper: hide step indicators, keep animation and navigation */}
          {mobileStep === 0 ? (
            ContactInfo(isMobile, (step: number) => { setStepDirection(1); setMobileStep(step); }, setStepDirection)
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <Stepper
                key={stepperKey}
                initialStep={1}
                onStepChange={setCurrentStep}
                ref={stepperRef}
                disableStepIndicators={true}
                nextButtonProps={{}}
                backButtonProps={{}}
              >
                {/* Step 1: Personal Info */}
                <Step>
                  <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex space-x-3">
                      <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
                      <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
                    </div>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className={`w-full border ${errors.email ? 'border-red-500' : 'border-[#b08b2e]'} rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition`} required />
                    <PhoneInput
                      country={'ph'}
                      value={phone}
                      onChange={(value: string) => {
                        setPhone(value);
                      }}
                      inputClass={`!w-full !p-2 !px-14 !border !rounded-lg !h-11 !text-base ${errors.phone || errors.country ? '!border-red-500' : '!border-[#b08b2e]'} !focus:ring-2 !focus:ring-[#b08b2e] castoro-titling-regular`}
                      buttonClass="!border-[#b08b2e] !rounded-lg !bg-white hover:!bg-[#f5f5f5] !h-11 !px-1"
                      dropdownClass="!border-[#b08b2e] castoro-titling-regular !rounded !bg-white !z-[2999]"
                      containerClass="!w-full"
                      dropdownStyle={{ top: 'auto', bottom: '40%', zIndex: 2999, maxHeight: 200, overflowY: 'auto', position: 'fixed' }}
                    />
                    {(errors.phone || errors.country) && <div className="text-red-500 text-xs">{errors.phone || errors.country}</div>}
                    {errors.firstName && <div className="text-red-500 text-xs">{errors.firstName}</div>}
                    {errors.lastName && <div className="text-red-500 text-xs">{errors.lastName}</div>}
                    {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                    {/* Step 1: Next only */}
                    <div className="flex mt-6">
                      <button
                        className="w-full bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                        onClick={(e) => {
                          e.preventDefault();
                          const validationErrors = validateStep1();
                          if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            const missingFields = getMissingFields(validationErrors);
                            toast.error(`Please fill in: ${missingFields}`);
                            return;
                          }
                          setErrors({});
                          if (stepperRef.current) stepperRef.current.next();
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                </Step>
                {/* Step 2: Property & Message */}
                <Step>
                  <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="mb-2">
                      <Select
                        name="property"
                        value={form.property ? { value: form.property, label: form.property } : null}
                        onChange={option => setForm(prev => ({ ...prev, property: option ? option.value : '' }))}
                        options={projects.map(project => ({ value: project.formalName || project.title, label: project.formalName || project.title }))}
                        placeholder="Select Property"
                        isClearable
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor: errors.property ? '#ef4444' : '#b08b2e',
                            boxShadow: state.isFocused ? '0 0 0 2px #b08b2e33' : base.boxShadow,
                            borderRadius: '0.5rem',
                            minHeight: '44px',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#b08b2e' : state.isFocused ? '#f7f3e9' : '#fff',
                            color: state.isSelected ? '#fff' : '#222',
                            fontWeight: state.isSelected ? 600 : 400,
                            fontFamily: 'inherit',
                          }),
                          menu: base => ({
                            ...base,
                            zIndex: 2999,
                            borderRadius: '0.5rem',
                            boxShadow: '0 8px 24px 0 #b08b2e22',
                          }),
                        }}
                      />
                      {errors.property && <div className="text-red-500 text-xs mt-1">{errors.property}</div>}
                    </div>
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" className="w-full border border-[#b08b2e] rounded-lg p-2 focus:ring-2 focus:ring-[#b08b2e] focus:border-[#b08b2e] focus:outline-none castoro-titling-regular transition" rows={4}></textarea>
                    {/* Step 2: Back and Next */}
                    <div className="flex gap-4 mt-6">
                      <button
                        className="flex-1 bg-gray-200 text-[#b08b2e] py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-300 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          setErrors({});
                          if (stepperRef.current) stepperRef.current.back();
                        }}
                      >
                        Back
                      </button>
                      <button
                        className="flex-1 bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                        onClick={(e) => {
                          e.preventDefault();
                          const validationErrors = validateStep2();
                          if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            const missingFields = getMissingFields(validationErrors);
                            toast.error(`Please fill in: ${missingFields}`);
                            return;
                          }
                          setErrors({});
                          if (stepperRef.current) stepperRef.current.next();
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                </Step>
                {/* Step 3: Review & Submit */}
                <Step>
                  <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <h2 className="text-lg font-semibold mb-2">Review your information</h2>
                    <div className="bg-[#f7f3e9] rounded-lg p-4">
                      <div className="mb-2"><span className="font-semibold">Full Name:</span> {form.firstName}<span className="ml-2">{form.lastName}</span> </div>
                      <div className="mb-2"><span className="font-semibold">Email:</span> {form.email}</div>
                      <div className="flex space-x-3">
                        <div className="mb-2"><span className="font-semibold">Phone:</span> {phone}</div><div className="mb-2"><span className="font-semibold">Country:</span> {form.country}</div>
                      </div>
                      <div className="mb-2"><span className="font-semibold">Property:</span> {form.property}</div>
                      <div className="mb-2"><span className="font-semibold">Message:</span> {form.message}</div>
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className="text-red-500 text-xs">
                        {Object.values(errors).map((err, idx) => <div key={idx}>{err}</div>)}
                      </div>
                    )}
                    <div className="flex gap-4 mt-4">
                      <button
                        className="flex-1 bg-gray-200 text-[#b08b2e] py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-300 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          setErrors({});
                          if (stepperRef.current) stepperRef.current.back();
                        }}
                      >
                        Back
                      </button>
                      <button
                        className="flex-1 bg-[#b08b2e] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#a07a1e] transition"
                        onClick={async (e) => {
                          e.preventDefault();
                          await handleSubmit();
                        }}
                      >
                        Submit Inquiry
                      </button>
                    </div>
                  </motion.div>
                </Step>
              </Stepper>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-10 items-center justify-center  z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {ContactInfo(isMobile, setMobileStep, setStepDirection)}
          {FormStepper}
        </motion.div>
      )}
    </section>
  );
};

export default Contact;
