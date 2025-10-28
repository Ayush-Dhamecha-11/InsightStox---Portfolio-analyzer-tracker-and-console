import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoToArrow from "../assets/routeicon.svg";
import profileImg from "../assets/profileicon.svg";
import LogoutSym from "../assets/logoutSym.png";
import "./Sidebar.css";

//const navigate = useNavigate();

export const Sidebar = ({ primaryData = {} }) => {
    const [currentField, setActiveField] = useState(localStorage.getItem("activeMenu") || "My Profile");

    const handleMenuClick = (fieldName) => {
        setActiveField(fieldName);
        localStorage.setItem("activeMenu", fieldName);

        /*
        setActiveItem(fieldName);
        const route = fieldName.toLowerCase().replace(/\s+/g, "-");
        navigate(`/{route}`);
        */
    }

    return (
        <aside className="Sidebar">
            <div className="ProfileSection">
                <div className="Avatar">
                    <img src={profileImg} alt="Profile Pic" />
                </div>
                <h2>{primaryData.name}</h2>
                <p className="Email">{primaryData.email}</p>
            </div>

            <nav className="Menu">
                {[
                    "My Profile",
                    "Data & Privacy",
                    "Activity",
                    "Preferences",
                    "Help & Resources",
                    "Logout",
                ].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleMenuClick(item)}
                        className={`Sidebar-item ${currentField === item ? "Active" : ""}`}
                    >
                        {item}
                        <img
                            className={`go-to`}
                            src={item === "Logout" ? LogoutSym : GoToArrow}
                            alt="go-to"
                        />
                    </button>
                ))}
            </nav>
        </aside>
    );
};
