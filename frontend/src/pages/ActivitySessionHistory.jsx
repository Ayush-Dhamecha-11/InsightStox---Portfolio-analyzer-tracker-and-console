import React, { useState, useEffect } from "react";
import "../pages/ActivitySessionHistory.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import axios from "axios";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
// Reusable hook for See More
const useSeeMore = (initialData, limit) => {
    const [fullData, setFullData] = useState(initialData);
    const [showAll, setShowAll] = useState(false);

    const displayData = showAll ? fullData : fullData.slice(0, limit);

    const toggleSeeMore = () => setShowAll(prev => !prev);

    const updateFullData = (newData) => setFullData(newData);

    const isExpandable = fullData.length > limit;

    return { displayData, showAll, toggleSeeMore, isExpandable, updateFullData };
};

export const ActivitySessionHistory = () => {
    const [darkMode, setDarkMode] = useState(true);
    
    axios.defaults.withCredentials = true;

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        profimg: "",
    });

    // Active Sessions
    const [activeSessions, setActiveSessions] = useState([]);

    // Security Alerts
    const {
        displayData: securityAlerts,
        showAll: showAllSecurityAlerts,
        toggleSeeMore: toggleSecurityAlerts,
        isExpandable: isAlertsExpandable,
        updateFullData: updateSecurityAlertsData
    } = useSeeMore([], 3);

    // Activity History
    const {
        displayData: recentActivities,
        showAll: showAllRecentActivities,
        toggleSeeMore: toggleRecentActivities,
        isExpandable: isActivitiesExpandable,
        updateFullData: updateRecentActivitiesData
    } = useSeeMore([], 4);

    // Fetch everything in one function
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // 1️⃣ Fetch Profile + Embedded Alerts & Activities
                const profileRes = await axios.get(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/myProfile",
                    { withCredentials: true }
                );

                const user = profileRes.data?.data;
                const history = profileRes.data?.history;

                if (user) {
                    setUserInfo({
                        name: user.name,
                        email: user.email,
                        profimg: user.profileImage,
                    });
                }

                if (history?.activities)
                    updateRecentActivitiesData(
                        history.activities.map(activity => ({
                            id: activity.createdAt,
                            action: activity.message,
                            date: new Date(activity.createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata"
                            }),
                        }))
                    );

                if (history?.alerts)
                    updateSecurityAlertsData(
                        history.alerts.map(alert => ({
                            id: alert.createdAt,
                            text: alert.message,
                            date: new Date(alert.createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata"
                            }),
                        }))
                    );

                // 2️⃣ Fetch Active Sessions
                const sessionRes = await axios.get(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/activityAndSessionHistory",
                    { withCredentials: true }
                );

                const sessions = sessionRes.data?.activeSessions;

                if (sessions) {
                    setActiveSessions(
                        sessions.map(session => ({
                            id: session.token,
                            device: `${session.browser_type} - ${session.os_type}`,
                            lastActive: new Date(session.last_active_time).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata"
                            }), // IST TIME
                        }))
                    );
                }

                // 3️⃣ Fetch All Security Alerts (Full)
                const alertsRes = await axios.get(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/getAllSecurityAlerts",
                    { withCredentials: true }
                );

                const alerts = alertsRes.data?.alerts;

                if (alerts) {
                    updateSecurityAlertsData(
                        alerts.map(alert => ({
                            id: alert.createdAt,
                            text: alert.message,
                            date: new Date(alert.createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata"
                            }),
                        }))
                    );
                }

                // 4️⃣ Fetch Full Activity History
                const activityRes = await axios.get(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/getAllActivityHistory",
                    { withCredentials: true }
                );

                const activities = activityRes.data?.history;

                if (activities) {
                    updateRecentActivitiesData(
                        activities.map(activity => ({
                            id: activity.createdAt,
                            action: activity.message,
                            date: new Date(activity.createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata"
                            }),
                        }))
                    );
                }

            } catch (err) {
                console.error("Error fetching all data:", err);
            }
        };

        fetchAllData();
    }, []);

    //check auth every 10 seconds
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

    // Sign out single device
    const handleSignOut = async (sessionId) => {
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId));

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/logoutSession",
                { token: sessionId },
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    // Sign out all devices
    const handleSignOutAll = async () => {
        setActiveSessions([]);

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/logoutAllSessions",
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Error signing out all:", err);
        }
    };

    // Download Activity
    const handleDownloadActivity = async () => {
        try {
            await axios.get(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/downloadActivityHistoryReport",
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Error downloading report:", err);
        }
    };

    // Clear history
    const handleClearHistory = async () => {
        updateRecentActivitiesData([]);

        try {
            await axios.delete(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/clearActivityHistory",
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Error clearing history:", err);
        }
    };

    return (
        <div className="Page">
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                pageType="myprofile"
                profileData={userInfo}
            />

            <div className="Container">
                <Sidebar
                    primaryData={{
                        name: userInfo.name,
                        email: userInfo.email,
                        profileImage: userInfo.profimg
                    }}
                />

                <main className="MainContent">
                    <div className="activity-and-session">
                        <h2>Activity & Session History</h2>
                    </div>

                    {/* Active Sessions */}
                    <div className="header-section">
                        <h3>Active Sessions</h3>
                        <p>Manage all devices currently logged into your account</p>

                        <div className="activity-list">
                            {activeSessions.map((session) => (
                                <div key={session.id} className="activity-item">
                                    {session.device}
                                    <span className="dot"></span>
                                    <span className="date">{session.lastActive}</span>

                                    <button
                                        className="signout"
                                        onClick={() => handleSignOut(session.id)}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ))}

                            <button className="sign-out-all" onClick={handleSignOutAll}>
                                Sign Out from All Devices
                            </button>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Security Alerts */}
                    <div className="header-section">
                        <h3>Security Alerts</h3>
                        {isAlertsExpandable && (
                            <button className="seemore" onClick={toggleSecurityAlerts}>
                                {showAllSecurityAlerts ? "See Less" : "See More"}
                            </button>
                        )}

                        <div className="activity-list">
                            {securityAlerts.map((alert) => (
                                <div key={alert.id} className="security-alerts">
                                    <span className="dot"></span> {alert.text} — {alert.date}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Activity History */}
                    <div className="header-section">
                        <h3>Activity History</h3>
                        {isActivitiesExpandable && (
                            <button className="seemore" onClick={toggleRecentActivities}>
                                {showAllRecentActivities ? "See Less" : "See More"}
                            </button>
                        )}

                        <div className="activity-list">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="security-alerts">
                                    <span className="dot"></span> {activity.action} — {activity.date}
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
                        { text: "Portfolio", href: "/portfolio" },
                        { text: "AI Insights", href: "/ai-insight" },
                        { text: "Watchlist", href: "/watchlist" },
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
