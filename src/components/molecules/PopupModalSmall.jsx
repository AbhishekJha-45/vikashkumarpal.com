"use client";

import { saveNewsLetterFormData } from "../../services/siteServies";
import { checkNullOrUndefined, checkValidEmail } from "../../utils/globalFunctions";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function ScrollModalSmall() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    let pathname = "";
    useEffect(() => {
        pathname = window.location.pathname;
        const handleScroll = () => {
            const scrollPercent =
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent >= 30 && sessionStorage.getItem("isNewsLetterPopUpDisplayed") !== "true") {
                setIsVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    const submitFormHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        if (checkNullOrUndefined(email)) {
            alert("Email is required!");
            setIsLoading(false);
            return false;
        }

        if (!checkValidEmail(email)) {
            alert("Valid Email is required!");
            setIsLoading(false);
            return false;
        }

        try {
            // Execute both API calls in parallel
            const [crmResponse, dbResponse] = await Promise.allSettled([
                saveNewsLetterFormData(email),
                fetch("/api/newsletter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }).then(res => res.json())
            ]);

            // Check for errors
            const errors = [];

            if (crmResponse.status === 'rejected' || !crmResponse.value?.success) {
                errors.push("CRM submission failed");
            }

            if (dbResponse.status === 'rejected' || dbResponse.value?.error) {
                errors.push("Database submission failed");
            }

            if (errors.length > 0) {
                alert(`Subscription partially succeeded. Issues: ${errors.join(', ')}`);
                return;
            }

            // Success case
            alert('Thank You for Subscribing!\nYou\'re now part of our community!');
            setIsVisible(false);
            setEmail('');
            sessionStorage.setItem("isNewsLetterPopUpDisplayed", "true");

        } catch (error) {
            alert("An unexpected error occurred. Please try again.");
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 z-3 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
            <div className="position-relative w-60 overflow-hidden rounded-4 shadow-lg bg-dark text-white p-4 mx-2 mx-md-0" style={{ maxWidth: "600px" }}>
                <div className="d-flex justify-content-end align-items-center mb-4 position-relative">
                    <button
                        className="p-1 bg-dark text-white rounded-pill border position-absolute top-0"
                        // style={{ transform: 'translateX(30%)' }}
                        onClick={() => {
                            setIsVisible(false)
                            sessionStorage.setItem("isNewsLetterPopUpDisplayed", "true")
                        }}
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <h2 className="h4 fw-bold mb-3 text-center mt-5">
                    Stay Ahead with <span className="text-primary">SEO With Intent</span>
                </h2>

                <p className="text-secondary small text-center mx-auto">
                    Get personalized SEO strategies to boost your rankings, generate leads, and enhance your online presence.
                </p>

                {/* Mobile View (stacked) */}
                <div className="d-flex flex-column d-md-none">
                    <div className="my-2 rounded-pill bg-transparent border border-[#e0e0e0] overflow-hidden p-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-100 px-4 py-1 fs-6 bg-transparent text-white border-0"
                            style={{ outline: 'none' }}
                        />
                    </div>
                    <button className="btn bg-white text-dark fw-semibold  w-100 py-2 fs-6 rounded-pill mt-2" onClick={submitFormHandler} disabled={isLoading} >
                        {isLoading ? "Submitting..." : `Subscribe Now – It's Free!`}
                    </button>
                </div>

                {/* Desktop View (inline) */}
                <div className="d-none d-md-flex align-items-center my-2 rounded-pill bg-transparent border border-[#e0e0e0] overflow-hidden p-" style={{ padding: '3px' }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-grow-1 px-4 py-2 bg-transparent text-white border-0"
                        style={{ outline: 'none' }}
                    />
                    <button className="btn bg-white text-dark fw-semibold px-5 py-2 rounded-pill" disabled={isLoading} >
                        {isLoading ? "Submitting..." : `Subscribe Now – It's Free!`}
                    </button>
                </div>

                <p className="text-secondary small text-center mt-2">
                    We&apos;ll get in touch with expert strategies tailored for your business growth.
                </p>
            </div>
        </div>
    );
}

