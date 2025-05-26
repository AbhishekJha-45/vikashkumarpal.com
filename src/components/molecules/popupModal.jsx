"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Logo from "../../asserts/logos/Vikash-Logo-Black-BG.png"
import Image from "next/image";
import { saveStepFormData } from "../../services/siteServies";
import TrunkBoxLogo from "../../../public/logo/trunk-box.png";
import AkosLogo from "../../../public/logo/akos.png";
import BeetronicsLogo from "../../../public/logo/beetronics.png";
import MonikaAILogo from "../../../public/logo/monica-logo.png";
import One400Logo from "../../../public/one400-logo.jpg";
import RMCLogo from "../../../public/logo/rmc.png";

export default function ScrollModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({ step1: "", step2: {} });
    const [step, setStep] = useState(1);
    const clientsLogos = [TrunkBoxLogo, AkosLogo, BeetronicsLogo, MonikaAILogo, One400Logo, RMCLogo];
    useEffect(() => {
        const handleScroll = () => {
            const scrollPercent =
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= 40 && sessionStorage.getItem("isTwoSteprPopUpDisplayed") !== "true") {
                setIsVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 mt-4"
            style={{ backdropFilter: 'blur(4px)' }}>
            <div
                className="position-relative w-60 overflow-hidden rounded-4 shadow-lg mx-3 mx-md-0"
                style={{ maxWidth: "1000px" }}
            >
                <div className="row g-0">
                    <div className="col-md-5 d-none d-md-block text-white p-4 rounded-start-4" style={{ backgroundColor: "#5593E4" }}>
                        <div className="mb-4">
                            <Image src={Logo} className="" alt="Vikash Logo" width={110} height={30} />
                        </div>

                        <div className="bg-white bg-opacity-25 backdrop-blur rounded-4 p-4 mb-4">
                            <p className="small mb-3">
                                          As an educational institution, it was essential for us to have a strong online presence to attract prospective students. Vikash&apos;s expertise in SEO helped us achieve that and more. His collaborative approach and strategic recommendations have not only improved our search engine rankings but also enhanced our website&apos;s user experience. We&apos;ve seen a 82% increase in organic traffic YoY, and our online enrollment numbers have never been better.
                            </p>
                            <div className="d-flex align-items-center gap-3 border-top">
                                <Image
                                    src="https://vikashkumarpal.com/_next/image/?url=https%3A%2F%2Fadmin.vikashkumarpal.com%2Fwp-content%2Fuploads%2F2023%2F10%2Fclient-avatar-man-4.png&w=48&q=100"
                                    className="rounded-circle"
                                    alt="Vikash Logo"
                                    width={48}
                                    height={48}
                                />
                                <div className="d-flex flex-column pt-3">
                                    <p className="fw-semibold mb-0">Tabrez Siddique</p>
                                    <p className="small opacity-75">Executive Director | RMC Education</p>
                                </div>
                            </div>
                        </div>

                        <div className="row g-2">
                            {clientsLogos.map((logo, i) => (
                                <div key={i} className="col-4">
                                    <div className=" rounded-4 p- d-flex align-items-center justify-content-center">
                                        <Image
                                            src={logo}
                                            alt="Client Logo"
                                            width={120}
                                            height={50}
                                            className="rounded-4"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Render Step 1 or Step 2 based on state */}
                    {step === 1 ? (
                        <Step1 setStep={setStep} setFormData={setFormData} setIsVisible={setIsVisible} isVisible={isVisible} />
                    ) : (
                        <Step2 formData={formData} setFormData={setFormData} setIsVisible={setIsVisible} isVisible={isVisible} setStep={setStep} />
                    )}
                </div>
            </div>
        </div>

    );
}

const Step1 = ({ setStep, setFormData, setIsVisible }) => {
    const handleOptionClick = (option) => {
        setFormData((prev) => ({ ...prev, step1: option }));
        setStep(2);
    };

    return (
        <div className="col-md-7 bg-dark text-white p-4 rounded-end-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="bg-primary text-white small fw-medium px-3 py-1 rounded-pill">Step-1</span>
                <button className="p-2 bg-dark text-white rounded-pill border" onClick={() => {
                    setIsVisible(false)
                    sessionStorage.setItem("isTwoSteprPopUpDisplayed", "true")
                }}>
                    <IoClose size={24} />
                </button>
            </div>

            <div className="d-grid gap-4">
                <div>
                    <h2 className="h4 fw-bold mb-2">
                        Grow Your Business with <span className="text-primary">Expert SEO</span> Services?
                    </h2>
                    <p className="text-secondary small">
                        What&apos;s your primary goal with SEO? Select the option that best describes your needs.
                    </p>
                </div>

                <div className="d-grid gap-2">
                    {["1. Boost Rankings", "2. Generate More Leads", "3. Improve Local Visibility", "4. Not Sure Yet"].map(
                        (option) => (
                            <button
                                key={option}
                                className="w-100 p-3 text-start rounded-pill border border-secondary text-white bg-transparent 
                                hover-border-primary hover-bg-primary bg-opacity-10 transition"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

const Step2 = ({ formData, setFormData, setIsVisible, setStep }) => {
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            step2: { ...prev.step2, [name]: value },
        }));
    };
    const handleSubmit = (formData) => {
        setLoading(true);
        if (!formData.step2.fullName) {
            alert("Name is required!");
            setLoading(false);
            return;
        }
        if (!formData.step2.email) {
            alert("Email is Required!");
            setLoading(false);
            return;
        }
        if (!formData.step2.companyName) {
            alert("Company Name is Required!")
            setLoading(false);
            return;
        }
        if (!formData.step2.website) {
            alert("Website is Required!")
            setLoading(false);
            return;
        }
        saveStepFormData(formData).then((res) => {
            if (res.success) {
                setLoading(false)
                alert("Form submitted successfully!");
                sessionStorage.getItem("isNewsLetterPopUpDisplayed") !== "true" && sessionStorage.setItem("isTwoSteprPopUpDisplayed", "true");
                setStep(1)
                setIsVisible(false);
            } else {
                setLoading(false)
                alert("Error submitting form: " + res.error);
            }
            setFormData({ step1: "", step2: {} });
        });
    }

    return (
        <div className="col-md-7 bg-dark text-white p-4 rounded-end-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="bg-primary text-white small fw-medium px-3 py-1 rounded-pill">Step-2</span>
                <button className="p-1 bg-dark text-white rounded-pill border" onClick={() => {
                    setIsVisible(false)
                    sessionStorage.setItem("isTwoSteprPopUpDisplayed", "true")
                }}>
                    <IoClose size={24} />
                </button>
            </div>

            <h2 className="h4 fw-bold mb-2">
                Great! Let’s Connect and <span className="text-primary">Get Started.</span>
            </h2>
            <p className="text-white small mb-4">
                Share your contact details, and we&apos;ll reach out to discuss a personalized SEO strategy for your business.
            </p>

            <div className="d-grid gap-3">
                <input
                    type="text"
                    name="fullName"
                    value={formData.step2.fullName || ""}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="form-control bg-dark py-3  border-secondary text-white"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.step2.email || ""}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="form-control bg-transparent py-3 border-secondary text-white"
                />
                <input
                    type="text"
                    name="companyName"
                    value={formData.step2.companyName || ""}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className="form-control bg-transparent py-3 border-secondary text-white"
                />
                <input
                    type="url"
                    name="website"
                    value={formData.step2.website || ""}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="form-control bg-transparent py-3 border-secondary text-white"
                    style={{ color: 'white', caretColor: 'white' }} />
                <button className="btn btn-primary w-100 mt-3 py-2" onClick={() => handleSubmit(formData)} disabled={loading}>{loading ? "Submitting..." : "Let’s Go"}</button>
            </div>
        </div>
    );
};
