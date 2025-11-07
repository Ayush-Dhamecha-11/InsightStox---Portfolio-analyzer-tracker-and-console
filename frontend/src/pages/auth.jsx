import React, { useEffect, useState } from "react";
import "./auth.css";
import bg_img from "../assets/dark-mode-login-bg.png";
import LogoDark from "../assets/LogoDark.png";
import {Link} from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import SignupForm from "../components/SignupForm.jsx";
export const Auth = () => {
  const [isLogin, setIsLogin] = useState(() => {
    return sessionStorage.getItem("isLogin") === "false" ? false : true;
  });

  const resetFormStates = () => {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("forgotpassword");
  };

  const toggleForm = () => {
    setIsLogin(prev => {
      const newVal = !prev;
      sessionStorage.setItem("isLogin", newVal);
      return newVal;
    });
  };
  return (
    <div className="container">
      <div className="auth_main_div px-0 py-0">
       <Link to ="/">
         <button className="backToHome"  onClick={() => {resetFormStates();}}>← Back to Home</button>
         </Link>
        <div className="left_inner_div">
         
          <div className="back_img_div">
            <img src={bg_img} alt="Background img" />
          </div>
          <div className="tagline-div text-black">
            <h2>
              Analyze Smarter,
              <br />
              Invest Better.
            </h2>
          </div>
        </div>

        <div className="right_inner_div">
          <div className="logo">
            <img src={LogoDark} alt="Dark Mode Logo" />
          </div>
          <div className="auth_form">
            {isLogin ? (<LoginForm toggleForm={toggleForm} resetFormStates={resetFormStates} />) : (<SignupForm toggleForm={toggleForm} resetFormStates={resetFormStates} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
