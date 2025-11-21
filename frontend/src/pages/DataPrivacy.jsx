import React, { useEffect, useState } from "react";
import axios from "axios";
import "../pages/DataPrivacy.css";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import Toggle from "../components/Toggle.jsx";

import GoToArrow from "../assets/routeicon.svg";
import { useAppContext } from "../context/AppContext";


export const DataPrivacy = () => {
  axios.defaults.withCredentials = true;

  const { darkMode, setDarkMode } = useAppContext();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    profimg: ""
  });

  const [aiToggle, setAiToggle] = useState(false);
  const [downloadRequested, setDownloadRequested] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      alert("Account deletion confirmed");
      setDeleteRequested(true);
      try{
        await axios.delete(
          import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/deleteAccount",
          { withCredentials: true }
        );
        console.log("Account deletion initiated");
        setDeleteRequested(false);
      }catch(err){
        console.error("Error deleting account:", err.response?.data?.message || err.message);
        setDeleteRequested(false);
      }
      // TODO: call your DELETE API here
    }
  };

  const handleDownload = async () => {
    //alert("Your data is downloading...");
    setDownloadRequested(true);
    try{
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/downloadPortfolioData",
        { withCredentials: true }
      );
      console.log("Data download initiated:", res.data);
      setDownloadRequested(false);
    }
    catch(err){
      console.error("Error initiating data download:", err.response?.data?.message || err.message);
      setDownloadRequested(false);
    }
    // TODO: call your download API here
  };

  // PATCH / update handler for the toggle (optimistic update + revert on error)
  const handleToggleChange = async (value) => {
    // optimistic UI update
    const prev = aiToggle;
    setAiToggle(value);

    try {
      // adjust endpoint / payload key to match your backend contract
      await axios.patch(
        import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/toggleAISuggestion",
        { aisuggestion: value },
        { withCredentials: true }
      );

      console.log("AI toggle updated on server:", value);
    } catch (err) {
      setAiToggle(prev);
      console.error("Failed to update AI toggle:", err.response?.data?.message || err.message);
      alert("Unable to save preference. Please try again.");
    }
  };

  useEffect(() => {
    const fetchDataPrivacySettings = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/myProfile",
          { withCredentials: true }
        );

        console.log("Fetched successfully:", res.data);

        const user = res.data?.data;
        if (user) {
          setUserInfo({
            name: user.name,
            email: user.email,
            profimg: user.profileImage,
          });

          // set toggle from backend field (user.aisuggestion used previously)
          setAiToggle(Boolean(user.aisuggestion));
        }
      } catch (err) {
        console.error(
          "Error fetching user info:",
          err.response?.data?.message || err.message
        );
      }
    };

    fetchDataPrivacySettings();
  }, []);

  return (
    <div className="Page">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pageType="myprofile"
        profileData={{
          name: userInfo.name,
          email: userInfo.email,
          profileImage: userInfo.profimg
        }}
      />

      <div className="Container">
        <Sidebar
          primaryData={{
            name: userInfo.name,
            email: userInfo.email,
            profileImage: userInfo.profimg
          }}
        />


        <main className="MainContent-data-privacy">
          <h2 className="title">Data & Privacy</h2>

          <div className="privacy-section">
            
            {/* AI Insights */}
            <div className="ai-insights">
              <p className="main-concept">AI-Powered Insights & Suggestions</p>
              <div className="usage-brief1">
                
              <p className="usage-brief">  Allow us to securely analyze your portfolio data to provide personalized insights.</p>

                <div className="toggle-component">
                  {/* NOTE: prop name is onChange (camelCase) */}
                  <Toggle value={aiToggle} onChange={handleToggleChange} className="toggle400"/>
                </div>
              </div>
            </div>

            <div className="hr" />

            {/* Privacy Policy */}
            <div className="analytics-improvement">
              <p className="main-concept">Privacy Policy</p>
              <div className="usage-brief">
                Read our Privacy Policy
                <img className="more-info" src={GoToArrow} alt="arrow" />
              </div>
            </div>

            <div className="hr" />

            {/* Terms */}
            <div className="consent-compliance">
              <p className="main-concept">Terms & Condition</p>
              <p className="usage-brief">
                Read our Terms & Condition
                <img className="more-info" src={GoToArrow} alt="arrow" />
              </p>
            </div>

            <div className="hr" />

            {/* Manage Data */}
            <div className="manage-data">
              <p className="main-concept">Manage Your Data</p>
              <div className="usage-brief1">
                <p className="usage-brief">
                  Export a copy of your personal and portfolio data in CSV file.
                </p>

                <button onClick={handleDownload} className="download">
                  Download Data
                </button>
              </div>
            </div>

            <div className="hr" />

            {/* Delete Account */}
            <div className="delete-account">
              <div className="main-concept">Delete Account</div>
              <div className="usage-brief2">
                <p className="del-acc-p">
                  Permanently delete your account, portfolio data, and all personal information. This action is irreversible.
                </p>

                <button onClick={handleDelete} className="delete">
                  Delete My Account
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
            { text: "Portfolio", href: "#" },
            { text: "AI Insights", href: "#" },
            { text: "Watchlist", href: "#" },
            { text: "Compare Stocks", href: "#" }
          ]}
          legalLinks={[
            { text: "Privacy Policy", href: "#privacy" },
            { text: "Terms Of Service", href: "#terms" },
            { text: "Contact Us", href: "#contact" }
          ]}
        />
      </div>
    </div>
  );
};
