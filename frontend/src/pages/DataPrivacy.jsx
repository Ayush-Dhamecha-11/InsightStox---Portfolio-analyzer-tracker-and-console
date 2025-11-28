import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../pages/DataPrivacy.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import Toggle from "../components/Toggle.jsx";
import GoToArrow from "../assets/routeicon.svg";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
// --- START: MODAL COMPONENT ---
// 💡 This Modal is designed to close when clicking the close button or clicking the background overlay.
const PolicyModal = ({ title, content, isOpen, onClose }) => {
    // Ref to detect clicks inside the modal content
    const modalRef = useRef();

    // Effect to listen for clicks outside the modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the modal is open AND the click is NOT on the modal content itself
            if (isOpen && modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Attach the listener to the document body
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the listener when the component unmounts or modal closes
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]); // Rerun effect when isOpen or onClose changes

    if (!isOpen) return null;

    // The first div is the full-screen overlay (modal-overlay)
    return (
        <div className="modal-overlay">
            {/* The ref is attached to the inner content to exclude it from the click detection */}
            <div className="modal-content" ref={modalRef}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    {content}
                </div>
            </div>
        </div>
    );
};
// --- END: MODAL COMPONENT ---


export const DataPrivacy = () => {
    axios.defaults.withCredentials = true;
    const { darkMode, setDarkMode, userDetails } = useAppContext();
    const [aiToggle, setAiToggle] = useState(false);
    const [downloadRequested, setDownloadRequested] = useState(false);
    const [deleteRequested, setDeleteRequested] = useState(false);
    // 🟢 New state to track which modal is open ('privacy', 'terms', or null)
    const [activeModal, setActiveModal] = useState(null);
    const navigate = useNavigate();
      const { ensureAuth } = useAppContext();
    
      useEffect(() => {
                 // Run an initial check: this page is an auth/home page, so pass true
              (async () => {
                try {
                  await ensureAuth(navigate, false);
                } catch (e) {
                  console.error("ensureAuth initial check failed:", e);
                }
              })();
        
              const intervalId = setInterval(() => {
                ensureAuth(navigate, false).catch((e) => console.error(e));
              }, 10000);
        
              return () => {
                clearInterval(intervalId);
              };
        },  [navigate, ensureAuth]);
        
    // 🟢 NEW HANDLER: Opens the specified modal
    const openModal = (type) => {
        setActiveModal(type);
    };

    // 🟢 NEW HANDLER: Closes the modal
    const closeModal = () => {
        setActiveModal(null);
    };

    // 📝 UPDATED: Comprehensive Privacy Policy Content
    const PrivacyPolicyContent = (
        <div className="policy-text">
            <p><strong>1. Introduction</strong><br />
                Welcome to InsightStox. We provide a platform designed to help individual investors track portfolios, analyze market data, and receive AI-driven investment insights. We are committed to operating within legal boundaries and ensuring the security of your financial data. This policy outlines our data practices in compliance with relevant regulations.</p>

            <p><strong>2. Information We Collect</strong><br />
                <strong>&bull;&nbsp;Account & Profile Data</strong><br />
                To provide our services, we collect personal details during registration (Sign Up) and login, including your name, email address, and authentication credentials. We may also collect your risk profile and investment goals to tailor AI suggestions.<br />
                <strong>&bull;&nbsp;Portfolio & Watchlist Data</strong><br />
                We process the financial data you input, including:
                <ul>
                    <li>Stocks added to your Portfolio (Ticker, Quantity, Purchase Price).</li>
                    <li>Stocks added to your Watchlists for monitoring.</li>
                    <li>Transaction history for performance analysis.</li>
                </ul>
            </p>

            <p><strong>3. How We Use Your Information</strong><br />
                <ul>
                    <li><strong>&bull;&nbsp;Real-time Tracking:</strong> To fetch live market data and update your portfolio valuation with minimal latency.</li>
                    <li><strong>&bull;&nbsp;AI Insights:</strong> To generate personalized recommendations, risk alerts, and portfolio optimization strategies based on your holdings.</li>
                    <li><strong>&bull;&nbsp;Dashboard Visualization:</strong> To render interactive charts and performance graphs for better decision-making.</li>
                    <li><strong>&bull;&nbsp;Service Availability: </strong>To ensure the platform remains accessible during NSE/BSE trading hours.</li>
                </ul>
            </p>

            <p><strong>4. Regulatory Compliance</strong><br />
                InsightStox operates as a financial tool and adheres to guidelines set by regulatory authorities to ensure transparency and investor protection.<br />
                <strong>&bull;&nbsp;Compliance Authorities</strong><br />
                We strive to comply with norms established by bodies such as SEBI (Securities and Exchange Board of India), SEC, and applicable GDPR regulations. Our advisory features are designed to be informational tools, following disclosure norms and data handling policies.</p>

            <p><strong>5. Data Sharing and Disclosure</strong><br />
                We respect your privacy. Data sharing is limited to the following stakeholders essential for platform functionality:<br />
                <strong>&bull;&nbsp;API & Data Providers</strong><br />
                We interact with NSE-approved data APIs to fetch real-time prices and historical data. Your portfolio aggregation does not require sharing personal identity with these providers.<br />
                <strong>&bull;&nbsp;Legal Obligations</strong><br />
                We may disclose information if required by law or to comply with valid requests from regulators (e.g., SEBI audits) or law enforcement.</p>

            <p><strong>6. Data Security</strong><br />
                Security is a core requirement of InsightStox. We implement robust measures to protect your data from unauthorized access.<br />
                <ul>
                    <li><strong>&bull;&nbsp;Encryption:</strong><br /> Sensitive user data is encrypted to ensure confidentiality.</li>
                    <li><strong>&bull;&nbsp;Secure Authentication:</strong><br />We use secure login/logout mechanisms to manage user sessions and prevent unauthorized access.</li>
                    <li><strong>&bull;&nbsp;Reliability::</strong><br />Our system is built to handle failures gracefully, ensuring consistent data processing and integrity.</li>
                </ul>
            </p>

            <p><strong>7. Your Rights</strong><br />
                As an investor using our platform, you have the right to:<br />
                <ul>
                    <li><strong>&bull;&nbsp;Access & Portability:</strong><br />View and export your portfolio data at any time.</li>
                    <li><strong>&bull;&nbsp;Accuracy:</strong><br />Correct any inaccuracies in your personal or financial data.</li>
                    <li><strong>&bull;&nbsp;Withdrawal:</strong><br /> You may securely delete your account and portfolio information from our systems at any time.</li>
                </ul>
            </p>

            <p><strong>8. Contact Us</strong><br />
                If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
    );

    // 📝 UPDATED: Terms and Conditions Content with new bullet points for Section 4
    const TermsConditionContent = (
        <div className="policy-text">
            <p><strong> 1. Agreement to Terms :</strong>&nbsp; These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity and InsightStox, concerning your access to and use of the InsightStox platform. By accessing the site, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions.</p>
            <p><strong>2. User Registration and Account Security :</strong>&nbsp;
                You must register for an account to access certain features such as portfolio tracking and AI insights.
                You agree to keep your password confidential and will be responsible for all use of your account and password.
                You represent and warrant that all registration information you submit will be true, accurate, current, and complete.
                We reserve the right to remove or reclaim a username if we determine, in our sole discretion, that such username is inappropriate or offensive.</p>
            <p><strong>3. Acceptable Use :</strong>&nbsp;
                You may not access or use the platform for any purpose other than that for which we make it available. As a user of the platform, you agree not to:
                <ul>
                    <li>&bull;&nbsp;Systematically retrieve data or other content from the Site to create or compile a collection, compilation, database, or directory without written permission from us.</li>
                    <li>&bull;&nbsp;Use the platform in a manner inconsistent with any applicable laws or regulations (e.g., SEBI regulations).</li>
                    <li>&bull;&nbsp;Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
                </ul>
            </p>
            <p><strong>4. Investment Disclaimers & AI Insights :</strong>&nbsp;
                Important Risk Warning
                InsightStox is an informational tool, not a registered investment advisor. The AI-driven insights, risk alerts, and portfolio suggestions provided are for educational and informational purposes only.
                <ul>
                    <li>&bull;&nbsp;We do not guarantee the accuracy, completeness, or timeliness of any financial data or AI analysis.</li>
                    <li>&bull;&nbsp;Investment in the stock market involves significant risk, including the loss of principal.</li>
                    <li>&bull;&nbsp;You are solely responsible for your own investment decisions. We strongly recommend consulting with a qualified financial advisor before making any investment decisions.</li>
                </ul>
            </p>
            <p><strong>5. Data Sources & API Limits :</strong>&nbsp;
                Our platform relies on third-party data providers and APIs (including NSE-approved sources) for real-time market data.<br />
               <strong>&bull;&nbsp;Data Accuracy</strong><br />
                While we strive for accuracy, market data may be delayed or subject to errors from the source. We are not liable for any inaccuracies in the data displayed.<br />
                <strong>&bull;&nbsp;Service Limits</strong><br/>
                To ensure platform stability for all users and comply with API provider rules, we may impose limits on the frequency of data refreshes or API calls.
            </p>
            <p><strong>6. Termination :</strong>&nbsp;
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
            <p><strong>7. Changes to Terms :</strong>&nbsp;
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            <p><strong>8. Contact Us :</strong>&nbsp;
                If you have any questions about these Terms, please contact us.</p>
        </div>
    );


    // --- EXISTING HANDLERS ---
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
            setDeleteRequested(true);
            try {
                await axios.delete(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/deleteAccount",
                    { withCredentials: true }
                );
                alert("Account deletion initiated. You will be logged out shortly.");
                // TODO: Handle redirection/logout here
            } catch (err) {
                console.error("Error deleting account:", err.response?.data?.message || err.message);
                alert("Account deletion failed. Please try again.");
            } finally {
                setDeleteRequested(false);
            }
        }
    };

    const handleDownload = async () => {
        setDownloadRequested(true);
        try {
            const res = await axios.get(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/downloadPortfolioData",
                { withCredentials: true }
            );
            console.log("Data download initiated:", res.data);
            alert("Your data download should start shortly or be delivered via email.");
        } catch (err) {
            console.error("Error initiating data download:", err.response?.data?.message || err.message);
            alert("Data download failed. Please try again.");
        } finally {
            setDownloadRequested(false);
        }
    };

    const handleToggleChange = async (checked) => {
        const previousToggleState = aiToggle;
        setAiToggle(checked); // Optimistic update

        try {
            await axios.patch(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/toggleAiSuggestion",
                { aisuggestion: checked },
                { withCredentials: true }
            );
            console.log("Successfully updated AI toggle:", checked);
        } catch (err) {
            console.error("Failed to update AI toggle:", err);
            alert("Unable to save preference. Please try again.");
            setAiToggle(previousToggleState); // Revert on error
        }
    };

    useEffect(() => {
        const fetchDataPrivacySettings = async () => {
            try {
                const res = await axios.get(import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/getDataAndPrivacy", { withCredentials: true });
                const user = res.data?.data;
                if (user && typeof user.aisuggestion !== 'undefined') {
                    setAiToggle(user.aisuggestion);
                }
            } catch (err) {
                console.error("Error fetching info:", err.response?.data?.message || err.message);
            }
        };
        fetchDataPrivacySettings();
    }, []);

    // --- RENDER ---
    return (
        <div className="Page">
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                pageType="myprofile"
                profileData={{
                    name: userDetails?.name,
                    email: userDetails?.email,
                    profileImage: userDetails?.profimg
                }}
            />

            <div className="Container">
                <Sidebar
                    primaryData={{
                        name: userDetails?.name,
                        email: userDetails?.email,
                        profileImage: userDetails?.profimg
                    }}
                />

                <main className="MainContent-data-privacy">
                    <h2 className="title">Data & Privacy</h2>

                    <div className="privacy-section">
                        {/* AI Insights */}
                        <div className="ai-insights">
                            <p className="main-concept">AI-Powered Insights & Suggestions</p>
                            <div className="usage-brief1">
                                <p className="usage-brief"> 	Allow us to securely analyze your portfolio data to provide personalized insights.</p>
                                <div className="toggle-component">
                                    <Toggle value={aiToggle} onChange={handleToggleChange} className="toggle400" />
                                </div>
                            </div>
                        </div>

                        <div className="hr" />

                        {/* Privacy Policy */}
                        <div className="analytics-improvement">
                            <p className="main-concept">Privacy Policy</p>
                            <div className="usage-brief">
                                Read our Privacy Policy
                                {/* 🟢 Updated onClick to open the 'privacy' modal */}
                                <button onClick={() => openModal('privacy')}>
                                    <img className="more-info" src={GoToArrow} alt="arrow" />
                                </button>
                            </div>
                        </div>

                        <div className="hr" />

                        {/* Terms */}
                        <div className="consent-compliance">
                            <p className="main-concept">Terms & Condition</p>
                            <div className="usage-brief"> {/* Changed p tag to div for button placement */}
                                Read our Terms & Condition
                                {/* 🟢 Updated onClick to open the 'terms' modal */}
                                <button onClick={() => openModal('terms')}>
                                    <img className="more-info" src={GoToArrow} alt="arrow" />
                                </button>
                            </div>
                        </div>

                        <div className="hr" />

                        {/* Manage Data and Delete Account sections here... */}

                        <div className="manage-data">
                            <p className="main-concept">Manage Your Data</p>
                            <div className="usage-brief1">
                                <p className="usage-brief">
                                    Export a copy of your personal and portfolio data in CSV file.
                                </p>
                                <button onClick={handleDownload} className="download" disabled={downloadRequested}>
                                    {downloadRequested ? 'Downloading...' : 'Download Data'}
                                </button>
                            </div>
                        </div>

                        <div className="hr" />

                        <div className="delete-account">
                            <div className="main-concept">Delete Account</div>
                            <div className="usage-brief2">
                                <p className="del-acc-p">
                                    Permanently delete your account, portfolio data, and all personal information. This action is irreversible.
                                </p>
                                <button onClick={handleDelete} className="delete" disabled={deleteRequested}>
                                    {deleteRequested ? 'Deleting...' : 'Delete My Account'}
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <div className="footer-div">
                <Footer
                    darkMode={darkMode}
                    navigationLinks={[
                        { text: "Portfolio", href: "/portfolio" },
                        { text: "AI Insights", href: "/ai-insight" },
                        { text: "Watchlist", href: "/watchlist" },
                        { text: "Compare Stocks", href: "#" }
                    ]}
                    legalLinks={[
                        { text: "Privacy Policy", href: "#privacy" },
                        { text: "Terms Of Service", href: "#terms" },
                        { text: "Contact Us", href: "#contact" }
                    ]}
                />
            </div>

            {/* 🟢 MODAL RENDERING: Display the modals at the bottom of the component */}
            <PolicyModal
                title="Privacy Policy"
                content={PrivacyPolicyContent}
                isOpen={activeModal === 'privacy'}
                onClose={closeModal}
            />

            <PolicyModal
                title="Terms and Conditions"
                content={TermsConditionContent}
                isOpen={activeModal === 'terms'}
                onClose={closeModal}
            />
        </div>
    );
};