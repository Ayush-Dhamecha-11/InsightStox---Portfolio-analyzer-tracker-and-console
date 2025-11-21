import React, { useState, useCallback, useEffect } from "react";
import "../pages/ActivitySessionHistory.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import axios from "axios";

const useSeeMore = (initialData, limit) => {
    const [fullData, setFullData] = useState(initialData);
    const [showAll, setShowAll] = useState(false);

    const displayData = showAll ? fullData : fullData.slice(0, limit);

    const toggleSeeMore = useCallback(() => {
        setShowAll(prev => !prev);
    }, []);

    const updateFullData = useCallback((newData) => {
        setFullData(newData);
    }, []);

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

    const initialActiveSessions = [
        { id: 1, device: "Chrome - Windows (Current Session)", lastActive: "10:42 AM", isCurrent: true },
        { id: 2, device: "Safari - iPhone", lastActive: "9:15 AM", isCurrent: false },
        { id: 3, device: "Edge - MacOS", lastActive: "2:35 PM", isCurrent: false },
        { id: 4, device: "Firefox - Linux", lastActive: "8:00 AM", isCurrent: false },
        { id: 5, device: "Mobile App - Android", lastActive: "7:00 AM", isCurrent: false },
    ];
    // NOTE: isExpandable and toggleSeeMore properties are no longer used for sessions.
    const { 
        displayData: activeSessions, 
        updateFullData: updateActiveSessionsData 
    } = useSeeMore(initialActiveSessions, 3);

    const initialRecentActivities = [
        { id: 1, action: "Login from Chrome - Windows", date: "Oct 10, 2025" },
        { id: 2, action: "Viewed AI Recommendation for Portfolio", date: "Oct 9, 2025" },
        { id: 3, action: "Edited Portfolio: Added TCS and Infosys", date: "Oct 7, 2025" },
        { id: 4, action: "Risk analysis performed on holdings", date: "Oct 4, 2025" },
        { id: 5, action: "Accessed settings page", date: "Oct 3, 2025" },
        { id: 6, action: "Logout successful", date: "Oct 2, 2025" },
    ];
    const { 
        displayData: recentActivities, 
        showAll: showAllRecentActivities, 
        toggleSeeMore: toggleRecentActivities, 
        isExpandable: isActivitiesExpandable,
        updateFullData: updateRecentActivitiesData
    } = useSeeMore(initialRecentActivities, 4);

    const initialSecurityAlerts = [
        { id: 1, text: "Password changed successfully", date: "Oct 5, 2025" },
        { id: 2, text: "Data & Privacy settings updated successfully", date: "Oct 2, 2025" },
        { id: 3, text: "Account email verified", date: "Sept 28, 2025" },
        { id: 4, text: "Two-Factor Authentication enabled", date: "Sept 20, 2025" },
    ];
    const { 
        displayData: securityAlerts, 
        showAll: showAllSecurityAlerts, 
        toggleSeeMore: toggleSecurityAlerts, 
        isExpandable: isAlertsExpandable,
        updateFullData: updateSecurityAlertsData
    } = useSeeMore(initialSecurityAlerts, 3);

    useEffect(() => {
        const fetchSessionHistory = async () => {
            try {
                const res = await axios.get(
                    import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/myProfile",
                    { withCredentials: true }
                );

                console.log("Fetched successfully:", res.data);

                const user = res.data?.data;
                const history = res.data?.history;

                if (user) {
                    setUserInfo({
                        name: user.name,
                        email: user.email,
                        profimg: user.profileImage,
                    });

                    if (history?.sessions) {
                        updateActiveSessionsData(history.sessions);
                    }
                    if (history?.activities) {
                        updateRecentActivitiesData(history.activities);
                    }
                    if (history?.alerts) {
                        updateSecurityAlertsData(history.alerts);
                    }
                }
            } catch (err) {
                console.error(
                    "Error fetching user info:",
                    err.response?.data?.message || err.message
                );
            }
        };

        fetchSessionHistory();
    }, [updateActiveSessionsData, updateRecentActivitiesData, updateSecurityAlertsData]); 

    const [signoutFromAllDevices, setSignoutFromAllDevices] = useState(false);
    const [downloadActivityRequested, setDownloadActivityRequested] = useState(false);
    const [clearActivityHistory, setClearActivityHistory] = useState(false);

    const handleSignOut = useCallback( async (sessionId) => {
        updateActiveSessionsData((prev) => prev.filter((s) => s.id !== sessionId));
        //alert("Signed out from this device.");

        try{
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/logoutSession",
                { token: sessionId },
                { withCredentials: true }
            );
            console.log("Signed out from session:", res.data);  
        }
        catch(err){
            console.error(
                "Error signing out from session:",
                err.response?.data?.message || err.message
            );  
        }
    }, [updateActiveSessionsData]);

    const handleSignOutAll = useCallback( async () => {
        updateActiveSessionsData([]);
        setSignoutFromAllDevices(true);
        //alert("Signed out from all devices.");

        try{
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/logoutAllSessions",
                {},
                { withCredentials: true }
            );
            console.log("Signed out from all devices:", res.data);
            setSignoutFromAllDevices(false);
        }
        catch(err){
            console.error(
                "Error signing out from all devices:",
                err.response?.data?.message || err.message
            );  
            setSignoutFromAllDevices(false);
        }
    }, [updateActiveSessionsData]);

    const handleDownloadActivity = useCallback( async () => {
        //alert("Your activity report is downloading...");
        setDownloadActivityRequested(true);
        try{
            const res = await axios.get(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/downloadActivityHistoryReport",
                { withCredentials: true }
            );
            console.log("Activity report download initiated:", res.data);
            setDownloadActivityRequested(false);
        }
        catch(err){
            console.error(
                "Error downloading activity report:",
                err.response?.data?.message || err.message
            );  
            setDownloadActivityRequested(false);
        }
    }, []);

    const handleClearHistory = useCallback( async () => {
        //alert("Your activity history has been cleared.");
        setClearActivityHistory(true);

        try{
            const res = await axios.delete(
                import.meta.env.VITE_BACKEND_LINK + "/api/v1/users/clearActivityHistory",
                { withCredentials: true }
            );
            console.log("Activity history cleared:", res.data);
            setClearActivityHistory(false);
        }
        catch(err){
            console.error(
                "Error clearing activity history:",
                err.response?.data?.message || err.message
            );  
            setClearActivityHistory(false);
        }
        updateRecentActivitiesData([]); 
    }, [updateRecentActivitiesData]);

    return (
        <div className="Page">
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                pageType="myprofile"
                profileData={{
                    name: userInfo.name,
                    email: userInfo.email,
                    profileImage: userInfo.profimg,
                }}
            />

            <div className="Container">
                <Sidebar
                    primaryData={{
                        name: userInfo.name,
                        email: userInfo.email,
                        profileImage: userInfo.profimg,
                    }}
                />

                <main className="MainContent">
                    <div className="activity-and-session">
                        <h2>Activity & Session History</h2>
                    </div>

                    <div className="header-section">
                        <h3>Active Sessions</h3>
                        <p>Manage all devices currently logged into your account</p>
                        
                        {/* The 'See More' button logic for Active Sessions has been removed as requested. */}
                        
                        <div className="activity-list">
                            {activeSessions.map((session) => (
                                <div key={session.id} className="activity-item">
                                    {session.device}
                                    <span className="dot"></span>
                                    <span className="date">{session.lastActive}</span>

                                    <button className="signout" onClick={() => handleSignOut(session.id)}>
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

                    <div className="header-section">
                        <h3>Security Alerts</h3>
                        {isAlertsExpandable && (
                            <button 
                                className="seemore" 
                                onClick={toggleSecurityAlerts}
                            >
                                {showAllSecurityAlerts ? "See Less" : "See More"}
                            </button>
                        )}

                        <div className="activity-list">
                            {securityAlerts.map((alert) => (
                                <div key={alert.id} className="security-alerts">
                                    <span className="dot"> </span>
                                    &nbsp; {alert.text} — {alert.date}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divider" /> 

                    <div className="header-section">
                        <h3>Activity History</h3>
                        {isActivitiesExpandable && (
                            <button 
                                className="seemore" 
                                onClick={toggleRecentActivities}
                            >
                                {showAllRecentActivities ? "See Less" : "See More"}
                            </button>
                        )}

                        <div className="activity-list">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="security-alerts">
                                    <span className="dot"></span>
                                    &nbsp; {activity.action} — {activity.date}
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
