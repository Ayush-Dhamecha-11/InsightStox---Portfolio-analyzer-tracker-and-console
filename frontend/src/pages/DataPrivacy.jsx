import React, { useState } from "react";
import "../pages/DataPrivacy.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import Toggle from "../components/Toggle.jsx";
import GoToArrow from "../assets/routeicon.svg";

export const DataPrivacy = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [downloadRequested, setDownloadRequested] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  return (
    <div className="Page">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pageType="dataprivacy"
        profileData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
      />

      <div className="Container">
        <Sidebar
          primaryData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
        />

        <main className="MainContent">
            
            <h2 className="title">Data & Privacy</h2>
            <div className="privacy-section">
              <div className="ai-insights">
                <p className="main-concept">
                  AI-Powered Insights & Suggestions
                </p>
                <div className="usage-brief">
                  <p>Allow us to securely analyze your portfolio data to provide personalized insights.</p>
                  <div className="toggle-component">
                    <Toggle />
                  </div>
                  
                </div>
                
                
              </div>
              <hr/>
              <div className="analytics-improvement">
                <p className="main-concept">
                  Privacy Policy
                </p>
                <p className="usage-brief">
                  Read our Privacy Policy
                  <img className="more-info" src={GoToArrow}/>
                </p>
              </div>
              <hr/>
              <div className="consent-compliance">
                <p className="main-concept">Terms & Condition</p>
                <p className="usage-brief">
                  Read our Terms & Condition
                  <img className="more-info" src={GoToArrow}/>
                </p>
                  
              </div>
              <hr/>
              <div className="manage-data">
                <p className="main-concept">Manage Your Data</p>
                <div className="usage-brief1">
                  <p className="line-content">Export a copy of your personal and portfolio data in CSV file.</p>
                  <button
                    onClick={() => setDownloadRequested(true)}
                    className="download"
                  >
                    Download Data
                  </button>
                </div>
              </div>
              <hr/>
              <div className="delete-account">
                <div className="main-concept">Delete Account</div>
                <div className="usage-brief2">
                  <p className="del-acc-p">Permanently delete your account, portfolio data, and all personal information. This action is irreversible.</p>
                  <div className="button-container">
                  <button
                    onClick={() => setDeleteRequested(true)}
                    className="delete"
                  >
                    Delete My Account
                  </button>
                </div>
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
            { text: "Compare Stocks", href: "#" },
          ]}
          legalLinks={[
            { text: "Privacy Policy", href: "#privacy" },
            { text: "Terms Of Service", href: "#terms" },
            { text: "Contact Us", href: "#contact" },
          ]}
        />
      </div>
    </div>
  );
};