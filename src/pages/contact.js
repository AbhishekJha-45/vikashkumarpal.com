import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically imported components
const FaFacebook = dynamic(() => import("react-icons/fa").then(mod => mod.FaFacebook));
const FaInstagram = dynamic(() => import("react-icons/fa").then(mod => mod.FaInstagram));
const FaLinkedin = dynamic(() => import("react-icons/fa").then(mod => mod.FaLinkedin));
const BsTwitterX = dynamic(() => import("react-icons/bs").then(mod => mod.BsTwitterX));
const Link = dynamic(() => import("next/link"));

// Regular imports for utility and data-fetching functions
import { getPageQuery } from "../services/queryLibrary";
import { registeredPages } from "../utils/constants";
import { loadHomePageData, saveFormData } from "../services/siteServies";
import { containsRestrictedWords, containsUrl } from "../utils/stopWords";
import { checkNullOrUndefined, checkValidEmail } from "../utils/globalFunctions";

// Dynamically imported components
const Template = dynamic(() => import("../components/atom/template"));
const ContentWithSideRowCounts = dynamic(() => import("../components/organisms/ContentWithSideRowCounts"));
const TestimonialsSlider = dynamic(() => import("../components/organisms/testimonialsSlider"));
const BrandSliderWithSideContent = dynamic(() => import("../components/organisms/brandSliderWithSideContent"));
const HeaderDescContainer = dynamic(() => import("../components/molecules/headerDescContainer"));
const ThemeButton = dynamic(() => import("../components/atom/themeButton"));

export async function getServerSideProps() {
    const currentPageData = await loadHomePageData(getPageQuery(registeredPages.CONTACT));
    return {
        props: {
            currentPageData,
        },
    };
}

const Contact = ({ currentPageData }) => {
    const pageVars = currentPageData.page[registeredPages.CONTACT];
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [website, setWebsite] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitFormHandler = () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        // Check for required fields
        if (checkNullOrUndefined(name)) {
            alert("Name is required!");
            setIsSubmitting(false);
            return false;
        } else if (checkNullOrUndefined(email)) {
            alert("Email is required!");
            setIsSubmitting(false);
            return false;
        } else if (!checkValidEmail(email)) {
            alert("Not a valid email!");
            setIsSubmitting(false);
            return false;
        } else if (checkNullOrUndefined(company)) {
            alert("Company is required!");
            setIsSubmitting(false);
            return false;
        } else if (checkNullOrUndefined(message)) {
            alert("Message is required!");
            setIsSubmitting(false);
            return false;
        }

        // Check for bad words in all text fields
        const fieldsToCheck = [name, company, message, website].filter(field => field);
        if (containsRestrictedWords(fieldsToCheck)) {
            alert("Your message contains inappropriate content. Please revise your message.");
            setIsSubmitting(false);
            return false;
        }

        if (containsUrl(message)) {
            alert("Please don't include URLs in your message.");
            setIsSubmitting(false);
            return false;
        } else if (containsUrl(name)) {
            alert("Please don't include URLs in your name.");
            setIsSubmitting(false);
            return false;
        }
        else if (containsUrl(company)) {
            alert("Please don't include URLs in your company name.");
            setIsSubmitting(false);
            return false;
        }
        else if (!containsUrl(website)) {
            alert("Please include a valid URL.");
            setIsSubmitting(false);
            return false;
        }
        const formDataObject = {
            name: name,
            email: email,
            company: company,
            message: message
        }

        if (!checkNullOrUndefined(website))
            formDataObject.website = website;

        saveFormData(formDataObject).then(response => {
            if (response.success) {
                window.location.href = '/thank-you';
            } else {
                alert(response.error);
                setIsSubmitting(false);
            }
        }).catch(error => {
            alert("An error occurred. Please try again.");
            setIsSubmitting(false);
        });
    }

    return (
        <Template currentPageData={currentPageData} >
            <section>
                <HeaderDescContainer
                    highligter={"Contact Us"}
                    header={pageVars.contactHeading}
                    desc={pageVars.contactPc}
                    addClass={"w-res-50 mx-aut  o"}
                    textAlignCenter={true}
                />

                <div className="card col-lg-6 col-md-8 col-sm-10 mx-auto" style={{ padding: "2%", paddingTop: '5%', paddingBottom: '5%', borderRadius: 20 }}>
                    <div className="form-inline justify-content-center">
                        <div className="row my-auto d-flex align-items-end">
                            <div className="col-6 col-lg-6 ">
                                <span className={"font-b"}> Your Name*</span>
                                <input type="text" className="form-control p-2 mt-2" id="name" placeholder="James Smith" onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="col-6 col-lg-6 ">
                                <span className={"font-b"}> Your Email*</span>
                                <input type="email" className="form-control p-2 mt-2" id="email" placeholder="name@email.com" onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="col-6 col-lg-6 mt-4">
                                <span className={"font-b"}> Company Name*</span>
                                <input type="text" className="form-control p-2 mt-2" id="business-name" placeholder="Apple" onChange={e => setCompany(e.target.value)} />
                            </div>
                            <div className="col-6 col-lg-6 mt-4">
                                <span className={"font-b"}> Website</span>
                                <input type="url" className="form-control p-2 mt-2" placeholder="https://example.com" onChange={e => setWebsite(e.target.value)} />
                            </div>
                            <div className="col-12 col-lg-12 mt-4">
                                <span className={"font-b"}> Leave us a message*</span>
                                <textarea name="message" className={"form-control mt-2"} cols="20" rows="5" placeholder={"Tell me about your site, project requirements, and when you'd like to start."} onChange={e => setMessage(e.target.value)}>
                                </textarea>
                            </div>
                            <div className="col-12 mt-4 mt-md-2 mt-lg-4 ">
                                <div className="row align-items-center mt-3">
                                    <div className="col-lg-6 col-6 pe-0">
                                        <ThemeButton
                                            text={isSubmitting ? "Sending..." : "Send Message >"}
                                            buttonAction={() => submitFormHandler()}
                                            isDisabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-lg-auto ms-auto col-6 ps-0">
                                        {
                                            [
                                                {
                                                    title: <FaInstagram size={20} />,
                                                    link: currentPageData.siteOption.siteOptions.instagram
                                                },
                                                {
                                                    title: <BsTwitterX size={15} />,
                                                    link: currentPageData.siteOption.siteOptions.twitter
                                                },
                                                {
                                                    title: <FaFacebook />,
                                                    link: currentPageData.siteOption.siteOptions.facebook
                                                },
                                                {
                                                    title: <FaLinkedin />,
                                                    link: currentPageData.siteOption.siteOptions.linkedin
                                                }
                                            ].map((iconDetails, index) => <Link key={index} href={iconDetails.link}
                                                className="elementor-icon hover-dark me-4">{iconDetails.title}</Link>)
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pt-5">
                <ContentWithSideRowCounts
                    heading={currentPageData.siteOption.siteOptions.resultsHighlightHeading}
                    desc={currentPageData.siteOption.siteOptions.resultsHighlightPara}
                    points={currentPageData.siteOption.siteOptions.deliveredNumbers.map((item, index) => ({
                        count: item.highlightNumbers,
                        desc: item.highlightTxt,
                        key: index,
                    }))}
                />
            </div>

            <TestimonialsSlider currentPageData={currentPageData} />

            <BrandSliderWithSideContent currentPageData={currentPageData} />
        </Template>
    );
};

export default Contact;
