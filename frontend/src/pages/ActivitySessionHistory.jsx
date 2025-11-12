import React, { useState, useCallback } from "react";
import "../pages/ActivitySessionHistory.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";

export const ActivitySessionHistory = () => {
  const [darkMode, setDarkMode] = useState(true);

  const [setActiveSessions] = useState([
    {
      id: 1,
      device: "Chrome - Windows",
      lastActive: "10:42 AM",
      isCurrent: true
    },
    {
      id: 2,
      device: "Safari - iPhone",
      lastActive: "9:15 AM",
      isCurrent: false
    },
    {
      id: 3,
      device: "Edge - MacOS",
      lastActive: "2:35 PM",
      isCurrent: false
    }
  ]);

  const [recentActivities] = useState([
  { id: 1, action: "Login from Chrome - Windows", date: "Oct 10, 2025" },
  { id: 2, action: "Viewed AI Recommendation for Portfolio", date: "Oct 9, 2025" },
  { id: 3, action: "Edited Portfolio: Added TCS and Infosys", date: "Oct 7, 2025" },
  { id: 4, action: "Risk analysis performed on holdings", date: "Oct 4, 2025" },
]);

  const [securityAlerts] = useState([
    {
      id: 1,
      text: "Password changed successfully",
      date: "Oct 5, 2025"
    },
    {
      id: 2,
      text: "Data & Privacy settings updated successfully",
      date: "Oct 2, 2025"
    },
    {
      id: 3,
      text: "Account email verified",
      date: "Sept 28, 2025"
    }
  ]);

  const handleSignOut = useCallback((sessionId) => {
    setActiveSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
  }, []);

  const handleSignOutAll = useCallback(() => {
    setActiveSessions([]);
    setSignoutfromalldevices(true);
  }, []);

  const handleDownloadActivity = useCallback(() => {
    setDownloadActivityRequested(true);
    console.log("Downloading activity data...");
  }, []);

  const handleClearHistory = useCallback(() => {
    setClearactivityhistory(true);
    console.log("Clearing activity history...");
  }, []);


  return (
    <div className="Page">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pageType="myprofile"
        profileData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
      />

      <div className="Container">
        <Sidebar
          primaryData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }}
        />

        <main className="MainContent">
          <div className="activity-and-session">
            <h2>Activity & Session History</h2>
          </div>
            <div className="header-section">
            <h3>Active Sessions</h3>
            <div className="seemore">
              SeeMore

            </div>
            <p>Manage all devices currently logged into your account</p>
            </div>
            <div className="activity-list">
              {recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  {activity.action}
                   <span className="dot"></span>
                    <span className="date">{activity.date}</span>
                    <button className="signout" onClick={handleSignOut}>
                      Sign Out
                    </button>
                </div>
              ))}
              
            <button className="sign-out-all" onClick={handleSignOutAll}>
              Sign Out from All Devices
            </button>
            </div>

            <hr className="divider" />
            <div className="header-section">
            <h3>Security Alerts</h3>
            <span className="seemore">
              SeeMore

            </span>
            <div className="activity-list">
              {securityAlerts.map(alert => (
                <div key={alert.id} className="security-alerts">
                  <span className="dot"></span>
                  &nbsp;
                  {alert.text}
                   &nbsp;-&nbsp;
                  {alert.date}
                </div>
              ))}
            </div>
            </div>

            <hr className="divider" />
            <div className="header-section">
            <h3>Activity History</h3>
            <div className="seemore">
              SeeMore

            </div>
            <div className="activity-list">
              {securityAlerts.map(alert => (
                <div key={alert.id} className="security-alerts">
                  <span className="dot"></span>
                  &nbsp;
                  {alert.text}
                  &nbsp;&ndash;&nbsp;
                  {alert.date}
                </div>
              ))}
            </div>

            <div className="activity-actions">
              <button className="download-activity" onClick={handleDownloadActivity}>
                Download Activity Report (PDF)
              </button>
              <button className="clear-history" onClick={handleClearHistory}>
                Clear Activity History
              </button>
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
