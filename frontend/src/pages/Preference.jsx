import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import "./Preference.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


export const Preference = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [layout, setLayout] = useState("simple");
  const [loading, setLoading] = useState(true);

  //  Backend fetch logic (commented for now)
  useEffect(() => {
    // Uncomment when backend is connected
    /*
    async function fetchPreferences() {
      try {
        const response = await fetch("/api/preferences");
        if (!response.ok) throw new Error("Failed to fetch preferences");

        const data = await response.json();
        setTheme(data.theme);
        setLayout(data.layout);
        setSavedTheme(data.theme);
        setSavedLayout(data.layout);
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
    */

    //  Temporary local simulation (no backend)
    setTimeout(() => setLoading(false), 400);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //to be Uncommented when backend is ready
    /*
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, layout }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      setSavedTheme(theme);
      setSavedLayout(layout);
      alert(" Preferences saved successfully!");
    } catch (error) {
      alert(" Could not save preferences.");
      console.error(error);
    }
    */

    //  Temporary local save
    setSavedTheme(theme);
    setSavedLayout(layout);
    alert(` Preferences saved locally!\nTheme: ${theme}\nLayout: ${layout}`);
  };


  return (
    <div className="PreferenceLayout">
      {/* --- Navbar --- */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pageType="preferences"
        profileData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
      />

      <div className="PreferenceBody">
        {/* --- Sidebar --- */}
        <Sidebar
          primaryData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
        />

        {/* --- Main Content --- */}
        <main className="PreferenceContainer">
          <h2>Preferences & Personalisation</h2>

          <form className="preferences-form" onSubmit={handleSubmit}>
            {/* Theme Section */}
            <div className="form-group">
              <label htmlFor="theme-select">Theme</label>
              <div className="select-wrapper">
              <select
                id="theme-select"
                name="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
              <MdOutlineKeyboardArrowDown className="select-icon" />
              </div>    
              <p className="description">Choose the app appearance.</p>
            </div>

            {/* Dashboard Layout Section */}
            <div className="form-group">
              <label htmlFor="layout-select">Dashboard Layout</label>
              <div className="select-wrapper">              
              <select
                id="layout-select"
                name="layout"
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
              >
                <option value="simple">Simple (Essential Metrics)</option>
                <option value="detailed">Detailed (Advanced Insights)</option>
              </select>
              <MdOutlineKeyboardArrowDown className="select-icon" />
              </div>
              <p className="description">
                Customize the level of information displayed in your Dashboard.
              </p>
            </div>

          </form>
        </main>
      </div>

      {/* --- Footer --- */}
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
            { text: "Terms of Service", href: "#terms" },
            { text: "Contact Us", href: "#contact" },
          ]}
        />
      </div>
    </div>
  );
};
