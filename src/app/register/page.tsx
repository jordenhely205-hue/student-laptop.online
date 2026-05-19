"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    cnic: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    tehsil: "",
    address: "",
    degreeLevel: "",
    matricBoard: "",
    matricRollNo: "",
    matricRegNo: "",
    matricPassingYear: "",
    matricTotalMarks: "",
    matricObtainedMarks: "",
    interBoard: "",
    interRollNo: "",
    interRegNo: "",
    interPassingYear: "",
    interTotalMarks: "",
    interObtainedMarks: "",
    gradBoard: "",
    gradRollNo: "",
    gradRegNo: "",
    gradPassingYear: "",
    gradTotalMarks: "",
    gradObtainedMarks: "",
    declaration: false,
  });

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-[16px] bg-white transition";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === "cnic") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 13) formatted = formatted.slice(0, 13);
      if (formatted.length > 5 && formatted.length <= 12) {
        formatted = `${formatted.slice(0, 5)}-${formatted.slice(5)}`;
      } else if (formatted.length > 12) {
        formatted = `${formatted.slice(0, 5)}-${formatted.slice(5, 12)}-${formatted.slice(12)}`;
      }
      setFormData(prev => ({ ...prev, cnic: formatted }));
      if (errors.cnic) setErrors(prev => ({ ...prev, cnic: "" }));
      return;
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const calculatePercentage = (obtained: string, total: string) => {
    const o = parseFloat(obtained);
    const t = parseFloat(total);
    if (!isNaN(o) && !isNaN(t) && t > 0) {
      return ((o / t) * 100).toFixed(2) + "%";
    }
    return "";
  };

  const validateStep1 = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Required.";
    if (!formData.fatherName) newErrors.fatherName = "Required.";
    
    if (!formData.cnic || formData.cnic.length !== 15) {
      newErrors.cnic = "Valid 13-digit CNIC required.";
    } else if (typeof window !== "undefined") {
      const registeredCNICs = JSON.parse(localStorage.getItem("registeredCNICs") || "[]");
      if (registeredCNICs.includes(formData.cnic)) {
        newErrors.cnic = "This CNIC is already registered!";
      }
    }

    if (!formData.gender) newErrors.gender = "Required.";
    if (!formData.dob) newErrors.dob = "Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.phone) newErrors.phone = "Required.";
    if (!formData.province) newErrors.province = "Required.";
    if (!formData.district) newErrors.district = "Required.";
    if (!formData.tehsil) newErrors.tehsil = "Required.";
    if (!formData.address) newErrors.address = "Required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.degreeLevel) {
      newErrors.degreeLevel = "Please select your current degree level.";
      setErrors(newErrors);
      return false;
    }
    
    if (!formData.matricBoard) newErrors.matricBoard = "Required.";
    if (!formData.matricTotalMarks || !formData.matricObtainedMarks) newErrors.matricMarks = "Marks required.";
    
    if (["Inter", "Bachelor", "Master"].includes(formData.degreeLevel)) {
      if (!formData.interBoard) newErrors.interBoard = "Required.";
      if (!formData.interTotalMarks || !formData.interObtainedMarks) newErrors.interMarks = "Marks required.";
    }

    if (["Bachelor", "Master"].includes(formData.degreeLevel)) {
      if (!formData.gradBoard) newErrors.gradBoard = "Required.";
      if (!formData.gradTotalMarks || !formData.gradObtainedMarks) newErrors.gradMarks = "Marks required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    if (step === 3) isValid = validateStep3();

    if (isValid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(prev => prev - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) {
      setErrors({ declaration: "You must declare that the information is correct." });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      if (typeof window !== 'undefined') {
        const registeredCNICs = JSON.parse(localStorage.getItem("registeredCNICs") || "[]");
        if (!registeredCNICs.includes(formData.cnic)) {
          registeredCNICs.push(formData.cnic);
          localStorage.setItem("registeredCNICs", JSON.stringify(registeredCNICs));
        }

        const challanData = {
          uniqueId: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formData.name,
          fatherName: formData.fatherName,
          cnic: formData.cnic,
          level: formData.degreeLevel,
          phone: formData.phone,
          score: formData.degreeLevel === 'Matric' 
                  ? calculatePercentage(formData.matricObtainedMarks, formData.matricTotalMarks) 
                  : (['Inter', 'Bachelor', 'Master'].includes(formData.degreeLevel) 
                      ? calculatePercentage(formData.interObtainedMarks, formData.interTotalMarks) 
                      : ""),
          boardOrUniversity: formData.degreeLevel === 'Matric' ? formData.matricBoard : (['Inter'].includes(formData.degreeLevel) ? formData.interBoard : formData.gradBoard),
        };
        
        localStorage.setItem("challanData", JSON.stringify(challanData));
      }
      
      alert("Application Submitted Successfully!");
      router.push("/challan");
    }, 1500);
  };

  const generateYearOptions = () => {
    const years = [];
    for (let i = 2026; i >= 2010; i--) {
      years.push(i);
    }
    return years.map(year => <option key={year} value={year}>{year}</option>);
  };

  const steps = [
    { title: "Personal Profile" },
    { title: "Contact Details" },
    { title: "Academic Record" },
    { title: "Review & Submit" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 md:p-10 relative">
        
        {/* Cancel Link */}
        <Link href="/" className="absolute top-4 right-6 text-sm text-gray-500 hover:text-gray-800 font-medium transition">
          Cancel
        </Link>

        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Student Laptop Scheme" className="h-14 w-auto object-contain mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Registration Wizard</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((s, idx) => (
              <div key={idx} className={`text-[10px] md:text-xs font-semibold ${step >= idx + 1 ? 'text-blue-600' : 'text-gray-400'} hidden sm:block`}>
                {s.title}
              </div>
            ))}
            <div className="text-sm font-semibold text-blue-600 sm:hidden">
              Step {step} of {steps.length}
            </div>
          </div>
          <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">{steps[step - 1].title}</h2>
          </div>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* --- STEP 1: Personal Profile --- */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} 
                         className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`} placeholder="As per CNIC" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} 
                         className={`${inputClass} ${errors.fatherName ? 'border-red-500' : ''}`} />
                  {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Number *</label>
                  <input type="text" name="cnic" value={formData.cnic} onChange={handleInputChange} placeholder="00000-0000000-0"
                         className={`${inputClass} ${errors.cnic ? 'border-red-500' : ''}`} />
                  {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} 
                            className={`${inputClass} ${errors.gender ? 'border-red-500' : ''}`}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} 
                           className={`${inputClass} ${errors.dob ? 'border-red-500' : ''}`} />
                    {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* --- STEP 2: Contact Details --- */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="03XXXXXXXXX"
                           className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Optional"
                           className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <select name="province" value={formData.province} onChange={handleInputChange} 
                          className={`${inputClass} ${errors.province ? 'border-red-500' : ''}`}>
                    <option value="">Select Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                    <option value="AJK">AJK</option>
                    <option value="Federal">Islamabad</option>
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="e.g. Lahore"
                           className={`${inputClass} ${errors.district ? 'border-red-500' : ''}`} />
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tehsil *</label>
                    <input type="text" name="tehsil" value={formData.tehsil} onChange={handleInputChange} placeholder="e.g. Model Town"
                           className={`${inputClass} ${errors.tehsil ? 'border-red-500' : ''}`} />
                    {errors.tehsil && <p className="text-red-500 text-xs mt-1">{errors.tehsil}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Home Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="House, Street, Area"
                         className={`${inputClass} ${errors.address ? 'border-red-500' : ''}`} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            )}

            {/* --- STEP 3: Academic Record --- */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Degree Level *</label>
                  <select name="degreeLevel" value={formData.degreeLevel} onChange={handleInputChange} 
                          className={`${inputClass} ${errors.degreeLevel ? 'border-red-500' : ''}`}>
                    <option value="">Select Level</option>
                    <option value="Matric">Matric</option>
                    <option value="Inter">Intermediate</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                  </select>
                  {errors.degreeLevel && <p className="text-red-500 text-sm mt-1">{errors.degreeLevel}</p>}
                </div>

                {formData.degreeLevel && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    {/* Matric Section */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Matriculation Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Board / School Name</label>
                          <input type="text" name="matricBoard" value={formData.matricBoard} onChange={handleInputChange} className={inputClass} />
                          {errors.matricBoard && <p className="text-red-500 text-xs mt-1">{errors.matricBoard}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Roll No</label>
                          <input type="text" name="matricRollNo" value={formData.matricRollNo} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Passing Year</label>
                          <select name="matricPassingYear" value={formData.matricPassingYear} onChange={handleInputChange} className={inputClass}>
                            <option value="">Select</option>
                            {generateYearOptions()}
                          </select>
                        </div>
                        <div className="flex gap-2 lg:col-span-3">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Total Marks</label>
                            <input type="number" name="matricTotalMarks" value={formData.matricTotalMarks} onChange={handleInputChange} className={inputClass} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Obtained</label>
                            <input type="number" name="matricObtainedMarks" value={formData.matricObtainedMarks} onChange={handleInputChange} className={inputClass} />
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-gray-200 rounded-lg text-sm font-semibold text-center h-[46px] flex items-center justify-center">
                              {calculatePercentage(formData.matricObtainedMarks, formData.matricTotalMarks) || "0%"}
                            </div>
                          </div>
                        </div>
                      </div>
                      {errors.matricMarks && <p className="text-red-500 text-xs mt-2">{errors.matricMarks}</p>}
                    </div>

                    {/* Inter Section */}
                    {["Inter", "Bachelor", "Master"].includes(formData.degreeLevel) && (
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Intermediate Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Board / College Name</label>
                            <input type="text" name="interBoard" value={formData.interBoard} onChange={handleInputChange} className={inputClass} />
                            {errors.interBoard && <p className="text-red-500 text-xs mt-1">{errors.interBoard}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Roll No</label>
                            <input type="text" name="interRollNo" value={formData.interRollNo} onChange={handleInputChange} className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Passing Year</label>
                            <select name="interPassingYear" value={formData.interPassingYear} onChange={handleInputChange} className={inputClass}>
                              <option value="">Select</option>
                              {generateYearOptions()}
                            </select>
                          </div>
                          <div className="flex gap-2 lg:col-span-3">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Total Marks</label>
                              <input type="number" name="interTotalMarks" value={formData.interTotalMarks} onChange={handleInputChange} className={inputClass} />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Obtained</label>
                              <input type="number" name="interObtainedMarks" value={formData.interObtainedMarks} onChange={handleInputChange} className={inputClass} />
                            </div>
                            <div className="flex-1 flex flex-col justify-end">
                              <div className="bg-gray-200 rounded-lg text-sm font-semibold text-center h-[46px] flex items-center justify-center">
                                {calculatePercentage(formData.interObtainedMarks, formData.interTotalMarks) || "0%"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {errors.interMarks && <p className="text-red-500 text-xs mt-2">{errors.interMarks}</p>}
                      </div>
                    )}

                    {/* Graduation Section */}
                    {["Bachelor", "Master"].includes(formData.degreeLevel) && (
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Graduation Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">University Name</label>
                            <input type="text" name="gradBoard" value={formData.gradBoard} onChange={handleInputChange} className={inputClass} />
                            {errors.gradBoard && <p className="text-red-500 text-xs mt-1">{errors.gradBoard}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Roll/Reg No</label>
                            <input type="text" name="gradRollNo" value={formData.gradRollNo} onChange={handleInputChange} className={inputClass} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Passing Year</label>
                            <select name="gradPassingYear" value={formData.gradPassingYear} onChange={handleInputChange} className={inputClass}>
                              <option value="">Select</option>
                              {generateYearOptions()}
                            </select>
                          </div>
                          <div className="flex gap-2 lg:col-span-3">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Total CGPA/Marks</label>
                              <input type="number" step="0.01" name="gradTotalMarks" value={formData.gradTotalMarks} onChange={handleInputChange} className={inputClass} />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Obtained</label>
                              <input type="number" step="0.01" name="gradObtainedMarks" value={formData.gradObtainedMarks} onChange={handleInputChange} className={inputClass} />
                            </div>
                            <div className="flex-1 flex flex-col justify-end">
                              <div className="bg-gray-200 rounded-lg text-sm font-semibold text-center h-[46px] flex items-center justify-center">
                                {calculatePercentage(formData.gradObtainedMarks, formData.gradTotalMarks) || "0%"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {errors.gradMarks && <p className="text-red-500 text-xs mt-2">{errors.gradMarks}</p>}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* --- STEP 4: Review & Submit --- */}
            {step === 4 && (
              <div className="space-y-6 text-sm text-gray-700">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg font-medium mb-4 text-[16px]">
                  Please review your information carefully. You cannot change these details after submission.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
                  <div><span className="font-semibold block text-xs text-gray-500">Name</span> {formData.name}</div>
                  <div><span className="font-semibold block text-xs text-gray-500">Father Name</span> {formData.fatherName}</div>
                  <div><span className="font-semibold block text-xs text-gray-500">CNIC</span> {formData.cnic}</div>
                  <div><span className="font-semibold block text-xs text-gray-500">DOB</span> {formData.dob}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4">
                  <div><span className="font-semibold block text-xs text-gray-500">Phone</span> {formData.phone}</div>
                  <div><span className="font-semibold block text-xs text-gray-500">Email</span> {formData.email || 'N/A'}</div>
                  <div className="sm:col-span-2"><span className="font-semibold block text-xs text-gray-500">Address</span> {`${formData.address}, ${formData.tehsil}, ${formData.district}, ${formData.province}`}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                  <div><span className="font-semibold block text-xs text-gray-500">Applying Level</span> <span className="font-bold text-blue-600 text-base">{formData.degreeLevel}</span></div>
                  {formData.degreeLevel === "Matric" && <div><span className="font-semibold block text-xs text-gray-500">Percentage</span> {calculatePercentage(formData.matricObtainedMarks, formData.matricTotalMarks)}</div>}
                  {["Inter", "Bachelor", "Master"].includes(formData.degreeLevel) && <div><span className="font-semibold block text-xs text-gray-500">Highest Percentage</span> {calculatePercentage(formData.interObtainedMarks, formData.interTotalMarks)}</div>}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                    <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} 
                           className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-gray-700 leading-relaxed font-medium text-[16px]">I hereby declare that the information provided is correct and I take full responsibility for any discrepancies.</span>
                  </label>
                  {errors.declaration && <p className="text-red-500 text-sm mt-2 ml-10">{errors.declaration}</p>}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons (Inside Card) */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button onClick={prevStep} type="button" className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors w-[120px] text-[16px]">
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button onClick={nextStep} type="button" className="px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors w-[140px] text-[16px]">
              Next Step
            </button>
          ) : (
            <button onClick={handleFinalSubmit} disabled={loading} type="button" className="px-6 py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg transition-colors flex items-center text-[16px]">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Submitting...
                </>
              ) : "Submit"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
