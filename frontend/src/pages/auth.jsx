import React, { useState } from "react";
import "./auth.css";
import bg_img from "../assets/dark-mode-login-bg.png";
import LogoDark from "../assets/LogoDark.png";
import google_logo from "../assets/google_logo.svg";
import { InputField } from "../components/InputField.jsx";
import { PasswordInputField } from "../components/PasswordInputField.jsx";
import 'primeicons/primeicons.css';
import axios from "axios";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  {checkPasswordStrength} from "../components/authFunctions.jsx";

export const Auth = () => {
   const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(() => {
  return sessionStorage.getItem("isLogin") === "false" ? false : true;
});
const [isForgotPassword, setIsForgotPassword] = useState(() => {
  return sessionStorage.getItem("forgotpassword") === "true";
});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
  function resetFormStates(){
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setOtp("");
    setNameError("");
    setPasswordError("");
    setEmailError("");
    setConfirmPasswordError("");
    setTitleError("");
    setIsOtpSubmitted(false);
    setIsOtpSent(false);
  }


React.useEffect(() => {
  if(isLogin)
  {
    if(isForgotPassword)
    {
      setAreAllFieldsValid(email !== "");
      return;
    }
    if(email !== "" && password !== "")
      setAreAllFieldsValid(true);
    else
      setAreAllFieldsValid(false);
  }
  else{
    if(email !== "" && password !== "" && name !== "" && confirmPassword !== "" && (isOtpSent ? otp !== "" : true) && checkPasswordStrength(password) === "Strong password" && password === confirmPassword && validateEmail(email) && validateNameStrength(name))
      setAreAllFieldsValid(true);
    else
      setAreAllFieldsValid(false);
  }
},[email, password, name, confirmPassword, otp]);

const validateRequiredFields = () => {
  if(email === "" || password === "" || (!isLogin && name === "") || (!isLogin && confirmPassword === "") || (isOtpSent && otp === "")){
    return false;
  }
  setTitleError("");
  return true;
}

  const handleLogin = async () => {
    try {
        const res = await axios.post("/api/v1/users/login", {email : email, password : password});
        console.log("Logged in successfully");
        navigate("/Dashboard");
    } catch (err) {
      if(err.response.data.message){
        setTitleError(err.response.data.message);
        return;
      }
       console.log("Login error:", err.response.data.message);
    }
  };
  function validateNameStrength(name) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  }

  //useEffect for error message validation
  React.useEffect(() => {
    if (name && !validateNameStrength(name)) {
      setNameError("Name should not contain numbers or special characters");
    } else {
      setNameError("");
    }
  }, [name]);

  React.useEffect(() => {
    if (!password) {
      setPasswordError(""); // default message
    } else {
      setPasswordError(checkPasswordStrength(password));
    }
   }, [password]);

   React.useEffect(() => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
   }, [confirmPassword, password]);

   React.useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError("Invalid email format");
   } else {
      setEmailError("");
   }
  }, [email]);

   const handleOtpGeneration = async () => {
    try {
        const res = await axios.post("/api/v1/users/registerOtpGeneration", {email : email, name: name, password : password});
        console.log("OTP generation successful");
        setIsOtpSent(!isOtpSent); 
    } catch (err) {
      if(err.response.data.message === "User Already exists"){
        setTitleError("User already exists. Please login.");
        return;
      }
       console.log("OTP generation error:", err.response.data.message);
    }
  };
   const handleResendOtpGeneration = async () => {
    try {
        const res = await axios.post("/api/v1/users/registerOtpGeneration", {email : email, name: name, password : password});
        console.log("OTP resend successful");
    } catch (err) {
       console.log("OTP resend error:", err.response.data.message);
    }
  };
  
  const handleRegister = async () => {
   try {
        const res = await axios.post("/api/v1/users/register", {email : email, otp: otp});
        console.log("Registered successfully");
        setIsOtpSent(!isOtpSent);
        navigate("/Dashboard");
    } catch (err) {
      if(err.response.data.message){
        setTitleError(err.response.data.message);
        return;
      }
       console.log("Register error:", err.response.data.message);
    }
  };


 const toggleForm = () => {
  setIsLogin(prev => {
    const newVal = !prev;
    sessionStorage.setItem("isLogin", newVal);  // update sessionStorage
    return newVal;
  });
  setIsOtpSent(false);
};
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email);
}
const toggleForgotPassword = () => {
  setIsForgotPassword(prev => {
    const newVal = !prev;
    sessionStorage.setItem("forgotpassword", newVal); // update sessionStorage
    return newVal;
  });
};
  
  const handleForgotPasswordInputToggle = () => {
    if (email === "") {
      alert("Email is required");
    } else {
      setIsOtpSubmitted(!isOtpSubmitted);
    } 
  };



  const renderForm = () => {
    if (isLogin) {
      return (
        <>
        <div className="authlogo">
            <img src={LogoDark} alt="Dark Mode Logo" />
          </div>
          <div className="title-text">
            <h1>{isForgotPassword ? 'Reset your password' : 'Login to your account'}</h1>
          </div>
          <form className="form" style={{gap : isForgotPassword ? '0.5rem' : '0rem' }}>
            <InputField htmlFor="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email" labelVal="Email" styleVal={{ display: isOtpSubmitted ? 'none':'block' }}/>
              <p className="email-error error" style={{ display: isOtpSent ? 'none' : 'block' }}>{emailError}</p>
              <div className="forgot-password" >
                <a onClick={() => {toggleForgotPassword();resetFormStates();}} style={{display: isForgotPassword ? 'none' : 'block'}} >Forgot?</a>
              </div>
            <PasswordInputField htmlFor="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" labelVal="Password" styleVal={{display: isForgotPassword ? 'none' : 'block'}}/>
            <InputField htmlFor="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} id="otp" placeholder="Enter the OTP" labelVal="OTP" styleVal={{ display: isOtpSubmitted ? 'block' : 'none' }} />

            <button type="submit" className="submit_forget_pass" style={{display: isForgotPassword ? 'none' : 'block', opacity: areAllFieldsValid ? 1 : 0.5, cursor: areAllFieldsValid ? 'pointer' : 'not-allowed'}} onClick={(e) => {e.preventDefault();handleLogin(); validateRequiredFields();}}>Login</button>
            <button type="submit" className="submit" onClick= {(e)=>{e.preventDefault();isOtpSent ? null : handleForgotPasswordInputToggle();setTitleError("");}} style={{display: isForgotPassword ? 'block' : 'none', opacity: areAllFieldsValid ? 1 : 0.5, cursor: areAllFieldsValid ? 'pointer' : 'not-allowed'}}>{isOtpSubmitted ? 'Verify OTP' : 'Send OTP'}</button>
            <button type="submit" className="resubmit" onClick={ (e) => {e.preventDefault();isOtpSent ? null : handleForgotPasswordInputToggle();setTitleError("");}} style={{display: isOtpSubmitted ? 'block' : 'none'}}>Resend</button>
            <button type="button" className="google-btn" style={{display: isForgotPassword ? 'none' : 'flex'}}><img src={google_logo} alt="google logo"  />Continue with Google</button>

            <p className="auth-text" style={{display: isForgotPassword ? 'none' : 'block'}}>
              Don't have an account ?
              <a onClick={() => {toggleForm();setTitleError("");resetFormStates()}} style={{ cursor: 'pointer' }}>Sign up</a>
            </p>
            {isForgotPassword && (
        <p className="auth-text">
          Remembered your password ?
          <a onClick={()=>{toggleForgotPassword();setTitleError("");resetFormStates()}} style={{ cursor: 'pointer' }}>Login</a>
        </p>
      )}
      <p className="title-error">{titleError}</p>
          </form>
        </>
      );
    } else {
      return (
        <>
        <div className="authlogo">
            <img src={LogoDark} alt="Dark Mode Logo" />
          </div>
          <div className="title-text">
            <h1>{isOtpSent ? 'Check your email for the OTP' : 'Create your account'}</h1>
          </div>
          <form className="form" style={{ gap: isOtpSent ? '0.3rem' : '0rem' }}>
        <InputField htmlFor="name" type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Enter your full name" labelVal="Full Name" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="name-error error">{nameError}</p>
        <InputField htmlFor="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email" labelVal="Email" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="email-error error">{emailError}</p>
        <PasswordInputField htmlFor="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" labelVal="Password" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="pass-error error">{passwordError}</p>
        <PasswordInputField htmlFor="confirmPassword" type="password" value={confirmPassword} onPaste={(e) => e.preventDefault()} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="Confirm your password" labelVal="Confirm Password" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="confirm-pass-error error">{confirmPasswordError}</p>
        <InputField htmlFor="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} id="otp" placeholder="Enter the OTP" labelVal="OTP" styleVal={{ display: isOtpSent ? 'block' : 'none' }} />

        <button type="submit" className="submit" style = {{opacity: areAllFieldsValid ? 1 : 0.5, cursor: areAllFieldsValid ? 'pointer' : 'not-allowed'}} onClick={(e) => {e.preventDefault();setAreAllFieldsValid(false); validateRequiredFields() && (isOtpSent ? handleRegister() : handleOtpGeneration()); }}>{isOtpSent ? 'Verify OTP' : 'Sign Up'}</button>
        <button type="submit" className="resubmit" onClick={(e) => {e.preventDefault(); setTitleError("");handleResendOtpGeneration();}} style={{display: isOtpSent ? 'block' : 'none'}}>Resend</button>

        <p className="auth-text">
          Already have an account ?
          <a onClick={() => {toggleForm();setTitleError("");resetFormStates();}} style={{ cursor: 'pointer' }}>Login</a>
        </p>
        <p className="title-error">{titleError}</p>
          </form>
        </>
      );
    }
  };
  return (

      <div className="auth_main_div px-0 py-0">
       <Link to ="/">
         <button className="backToHome"  onClick={() => {sessionStorage.removeItem("isLogin");sessionStorage.removeItem("forgotpassword");resetFormStates();}}> <i class="pi pi-arrow-left"></i> Back</button>
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
          <div className="auth_form_wrapper">
            <div className="auth_form">
              {renderForm()}
            </div>
            </div>
          </div>

        </div>
      

  );
};
