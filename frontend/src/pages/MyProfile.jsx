import React, { useState } from "react";
import "../pages/MyProfile.css";
import "primeicons/primeicons.css";
import { checkPasswordStrength } from "../utils/validation.js";
import Navbar from "../components/Navbar.jsx";
import profileImg from "../assets/profileicon.svg";
import GoToArrow from "../assets/routeicon.svg";
import GoogleLogo from "../assets/google_logo.svg";
import Footer from '../components/Footer.jsx';
import { Sidebar } from "../components/Sidebar.jsx";

export const MyProfile = () => {

    const [userInfo, setUserInfo] = useState({
        name: "Ayush Dhamecha",
        email: "managethisstuff@gmail.com",
        password: "AaVvBb126#$*"
    });
    const [darkMode, setDarkMode] = useState(true);
    const [investmentExp, setInvestmentExp] = useState("");
    const [riskProfile, setRiskProfile] = useState("");
    const [InvHorizon, setInvHorizon] = useState("");
    const [FinGoal, setFinGoal] = useState("");
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingPass, setIsEditingPass] = useState(false);
    const [editedName, setEditedName] = useState(userInfo.name);
    const [currPass, setCurrPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const handleEditInfo = () => {
        setEditedName(userInfo.name);
        setIsEditingInfo(true);
    };
    const handleCancelInfo = () => setIsEditingInfo(false);

    const handleEditPass = () => setIsEditingPass(true);

    const handleCancelPass = () => {
        setIsEditingPass(false);
        setCurrPass("");
        setNewPass("");
        setConfirmPass("");
    }

    const handleSaveInfo = async () => {

        const testName = validateNameStrength(editedName);

        if (testName) {
            setUserInfo((prev) => ({
                ...prev,
                name: editedName
            }));
            setIsEditingInfo(false);
        }
        else {
            alert("Invalid Name!");
        }

    };

    const handleSavePass = () => {
        if (!verifyCurrPass(currPass)) {
            alert("Current password incorrect");
            setCurrPass("");
            setNewPass("");
            setConfirmPass("");
            return;
        }
        {/* pass criteria checks */ }
        const passStrength = checkPasswordStrength(newPass);

        if (passStrength) {
            alert(passStrength);
            setNewPass("");
            setConfirmPass("");
            return;
        }

        if (newPass !== confirmPass) {
            alert("New password and confirm password do not match");
            setNewPass("");
            setConfirmPass("");
            return;
        }

        console.log("Password changed succesfully!");
        setIsEditingPass(false);
        setCurrPass("");
        setNewPass("");
        setConfirmPass("");
    }

    function verifyCurrPass(password) {

        if (password !== userInfo.password) {
            return false;
        }
        else {
            return true;
        }
        {/*
        try {
            const response = await fetch("/api/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            const result = await response.json();
            return result.valid; // true if correct, false if not
        } catch (error) {
            console.error("Error verifying password:", error);
            return false;
        }
        */}
    }

    function validateNameStrength(name) {
        const nameRegex = /^[a-zA-Z\s]*$/;
        return nameRegex.test(name);
    }

    return (
        <div className="Page">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} pageType="myprofile"
                profileData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }} />

            <div className="Container">

                <Sidebar primaryData={{ name: "Ayush Dhamecha", email: "ma**@gmail.com" }} />

                <main className="MainContent">
                    <h2 className="PersProfile"> Your personal profile </h2>
                    <div className="ProfilePic">
                        <label>Profile photo</label>
                        <div className="PicSection">
                            <img className="PicPlaceholder" src={profileImg} alt="Profile Pic" />
                            <button className="ChangePhoto" val="Change Photo" >Change Photo</button>
                        </div>
                    </div>

                    <div className="Information">
                        {/* to be changed via checking the condition */}
                        <div className="InfRow1">
                            <label>
                                Name
                                {!isEditingInfo && <button className="EditDetails" val="Edit" onClick={handleEditInfo}>Edit</button>}
                            </label>

                            <div className="InfValue">
                                {isEditingInfo ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                ) : (
                                    <span>{editedName}</span>
                                )}
                            </div>
                        </div>

                        {isEditingInfo && (
                            <div className="SaveCancelBtns">
                                <button className="SaveBtn" val="Save Changes" onClick={handleSaveInfo}>Save changes</button>
                                <button className="CancelBtn" val="Cancel" onClick={handleCancelInfo}>Cancel</button>
                            </div>
                        )}
                        <hr />

                        <div className="InfRow2">
                            <label>Email address</label>
                            <div className="InfValue">
                                <span>managethisstuff@gmail.com</span>
                            </div>
                        </div>
                        <hr />

                        {/* to be changed via checking the condition */}

                        <div className="InfRow5">
                            <label>
                                Password
                                {!isEditingPass && <button className="EditDetails" val="Edit" onClick={handleEditPass}> Edit </button>}
                            </label>

                            <div className="InfValue">
                                {isEditingPass ? (
                                    <div className="Handler">
                                        <div className="PasswordEditFields">
                                            <div className="CurrPass">
                                                <input
                                                    type={showPassword1 ? "text" : "password"}
                                                    placeholder="Current password"
                                                    value={currPass}
                                                    onChange={(e) => setCurrPass(e.target.value)}
                                                />
                                                <a className="password-toggle1" onClick={() => setShowPassword1(!showPassword1)}>
                                                    <span className="eye-icon">
                                                        <i className={`pi ${showPassword1 ? "pi-eye-slash" : "pi-eye"}`}></i>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="NewPass">
                                                <input
                                                    type={showPassword2 ? "text" : "password"}
                                                    placeholder="New password"
                                                    value={newPass}
                                                    onChange={(e) => setNewPass(e.target.value)}
                                                />
                                                <a className="password-toggle2" onClick={() => setShowPassword2(!showPassword2)}>
                                                    <span className="eye-icon">
                                                        <i className={`pi ${showPassword2 ? "pi-eye-slash" : "pi-eye"}`}></i>
                                                    </span>
                                                </a>
                                            </div>
                                            <div className="ConfPass">
                                                <input
                                                    type={showPassword3 ? "text" : "password"}
                                                    placeholder="Confirm password"
                                                    value={confirmPass}
                                                    onChange={(e) => setConfirmPass(e.target.value)}
                                                />
                                                <a className="password-toggle3" onClick={() => setShowPassword3(!showPassword3)}>
                                                    <span className="eye-icon">
                                                        <i className={`pi ${showPassword3 ? "pi-eye-slash" : "pi-eye"}`}></i>
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="SaveCancelBtns">
                                            <button className="SaveBtn" val="Save Changes" onClick={handleSavePass}> Save changes</button>
                                            <button className="CancelBtn" val="Cancel" onClick={handleCancelPass}> Cancel </button>
                                        </div>
                                    </div>
                                ) : (
                                    <span>**********</span>
                                )}
                            </div>
                        </div>
                        <hr />

                        {/*<div className="InfRow5">
                            <label>Password
                                <button className="EditDetails" val="Edit" />
                            </label>
                            <div className="InfValue">
                                <span>**********</span>
                            </div>
                        </div>
                        */}

                        <div className="InfRow4">
                            <label>Linked accounts</label>
                            <div className="LinkedBox">
                                <img src={GoogleLogo} alt="Google Logo" />
                                <div className="InsideBox">
                                    <span className="ServiceName">Google</span>
                                    <span className="AccName">Ayush Dhamecha</span>
                                </div>
                                <button className="Disconnect" val="Disconnect"> Disconnect </button>
                            </div>
                        </div>
                        <hr />

                        <h2 className="InvProfile"> Your investment profile </h2>
                        <span className="AIspan"> This field helps us to provide you better suggestions.</span>
                        <div className="InfRow3">
                            <div className="InvExp">
                                <label>Investment Experience</label>
                                <div className="InfValueDropDown1">
                                    <select className="InvExpList" value={investmentExp} onChange={(e) => setInvestmentExp(e.target.value)}>
                                        <option value="" disabled>Select an option</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <img className="g1" src={GoToArrow} alt="go-to" />
                                </div>
                                <hr />
                            </div>
                            <div className="RiskProfile">
                                <label>Risk Profile</label>
                                <div className="InfValueDropDown2">
                                    <select className="RiskProfList" value={riskProfile} onChange={(e) => setRiskProfile(e.target.value)}>
                                        <option value="" disabled>Select an option</option>
                                        <option value="Low - Conservative">Low - Conservative</option>
                                        <option value="Medium - Moderate">Medium - Moderate</option>
                                        <option value="High - Aggressive">High - Aggressive</option>
                                    </select>
                                    <img className="g2" src={GoToArrow} alt="go-to" />
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="InfRow6">
                            <div className="FinGoals">
                                <label>Financial Goals</label>
                                <div className="InfValueDropDown3">
                                    <select className="FinGoalList" value={FinGoal} onChange={(e) => setFinGoal(e.target.value)}>
                                        <option value="" disabled>Select an option</option>
                                        <option value="Primary growth">Primary growth</option>
                                        <option value="Income generation">Income generation</option>
                                        <option value="Balanced growth & income">Balanced growth & income</option>
                                    </select>
                                    <img className="g1" src={GoToArrow} alt="go-to" />
                                </div>
                                <hr />
                            </div>
                            <div className="InvHorizon">
                                <label>Investment Horizon</label>
                                <div className="InfValueDropDown4">
                                    <select className="InvHorizonList" value={InvHorizon} onChange={(e) => setInvHorizon(e.target.value)}>
                                        <option value="" disabled>Select an option</option>
                                        <option value="Short-term (1-3 years)">Short-term (1-3 years)</option>
                                        <option value="Medium-term (3-10 years)">Medium-term (3-10 years)</option>
                                        <option value="Long-term (10+ years)">Long-term (10+ years)</option>
                                    </select>
                                    <img className="g2" src={GoToArrow} alt="go-to" />
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div className="footer-div">
                <Footer darkMode={darkMode}
                    navigationLinks={[
                        { text: "Portfolio", href: "#" },
                        { text: "AI Insigths", href: "#" },
                        { text: "Wacthlist", href: "#" },
                        { text: "Compare Stocks", href: "#" },

                    ]}
                    legalLinks={[
                        { text: "Privacy Policy", href: "#privacy" },
                        { text: "Terms Of Service", href: "#terms" },
                        { text: "Contact Us", href: "#contact" },
                    ]} />
            </div>
        </div>
    );
};

