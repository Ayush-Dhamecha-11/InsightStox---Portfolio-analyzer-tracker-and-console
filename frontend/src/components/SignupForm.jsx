// import all relavent modules and components
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "./InputField.jsx";
import PasswordInputField from "./PasswordInputField.jsx";
import  {checkPasswordStrength,validateEmail,validateNameStrength} from "../utils/validation.js";
import { useAppContext } from "../context/AppContext.jsx"
const SignupForm = ({ toggleForm, resetFormStates: parentResetFormStates }) => {
/*----------------------------------- State Variables----------------------------------------------------------- */
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
    const [timer, setTimer] = useState(30);
    axios.defaults.withCredentials = true;
    const {setUserLoggedIn} = useAppContext();

/*----------------------------------- Functions--------------------------------------------------------------- */
// Function to reset all form states
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
    setIsOtpSent(false);
    // Also call parent reset
    if (parentResetFormStates) parentResetFormStates();
  }
/*----------------------------------- Registration handlers-----------------------------------------------------------------------*/
// Function to handle OTP generation
const handleOtpGeneration = async () => {
    setIsLoading(true);
    setAreAllFieldsValid(false);
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_LINK+"/api/v1/users/registerOtpGeneration", {email : email, name: name, password : password}, {withCredentials: true});
        console.log("✅ OTP generation successful:", res.data);
        setAreAllFieldsValid(true);
        setIsOtpSent((prev)=>!prev);
        setTimer(30);
    } catch (err) {
      if(err.response.data.message)
        setTitleError(err.response.data.message);
        console.error("❌ OTP generation error:", err.response.data.message);
    }finally{
        setIsLoading(false);
    }
  };

// Function to handle OTP resend
  const handleResendOtpGeneration = async () => {
    setIsLoading(true);
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_LINK+"/api/v1/users/registerOtpGeneration", {email : email, name: name, password : password}, {withCredentials: true});
         console.log("✅ OTP resend successful:", res.data);
        setTimer(30);
    } catch (err) {
       console.log("❌ OTP resend error:", err.response.data.message);
       setTitleError(err.response.data.message);
    }finally{
        setIsLoading(false);
    }
  };

// Function to handle user registration
const handleRegister = async () => {
    setIsLoading(true);
   try {
    const res = await axios.post(import.meta.env.VITE_BACKEND_LINK+"/api/v1/users/register", {email : email, otp: otp}, {withCredentials: true});
    console.log("✅ Registered successfully:", res.data);
    setIsOtpSent((prev)=>!prev);
    setUserLoggedIn(true);
    navigate("/Dashboard");
    } catch (err) {
          setTitleError(err.response.data.message);
        
        console.log("❌ Register error:", err.response.data.message);
    } finally {
        setIsLoading(false);
    }
};
/*----------------------------------- useEffect Hooks---------------------------------------------------------- */
//useEffect for validating all fields
useEffect(() => {
    if(isOtpSent)
    {
      setTitleError("");  
      setAreAllFieldsValid(otp.trim() !== "");
    }
    else
    {
        const allValid = email.trim() !== "" && password.trim() !== "" && name.trim() !== "" && confirmPassword.trim() !== "" && password === confirmPassword && passwordError === "" && nameError === "" && emailError === "";
        setAreAllFieldsValid(allValid)
    }
  }, [email, password, name, confirmPassword, passwordError, nameError, emailError, otp, isOtpSent]);
  
  //useEffect for error message validation
  useEffect(() => {
    const trimmedName = name.trim();
      if (trimmedName && !validateNameStrength(trimmedName)) {
        setNameError("Name should not contain numbers or special characters");
      } else {
        setNameError("");
      }
    }, [name]);

    //useEffect for password error message validation
useEffect(() => {
        const trimmedPassword = password.trim();
        if (!trimmedPassword) {
          setPasswordError(""); // default message
        } else {
          setPasswordError(checkPasswordStrength(trimmedPassword));
        }
       }, [password]);
    
    //useEffect for confirm password error message validation
useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
   }, [confirmPassword, password]);

   //useEffect for email error message validation
useEffect(() => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && !validateEmail(trimmedEmail)) {
      setEmailError("Invalid email format");
   } else {
      setEmailError("");
   }
  }, [email]);

  //useEffect for OTP resend timer
  useEffect(() => {
    if(timer <= 0)return;
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

/*----------------------------------- JSX --------------------------------------------------------------------- */
    return (
        <>
          <div className="title-text">
            <h1>{isOtpSent ? 'Check your email for the OTP' : 'Create your account'}</h1>
          </div>
        
        <form className="form" style={{ gap: isOtpSent ? '0.3rem' : '0rem' }} onSubmit={(e)=>{e.preventDefault();}}>
        <InputField htmlFor="name" type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="Enter your full name" labelVal="Full Name" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="name-error error">{nameError}</p>
        <InputField htmlFor="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter your email" labelVal="Email" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="email-error error">{emailError}</p>
        <PasswordInputField htmlFor="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" labelVal="Password" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="pass-error error">{passwordError}</p>
        <PasswordInputField htmlFor="confirmPassword" type="password" value={confirmPassword} onPaste={(e) => e.preventDefault()} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="Confirm your password" labelVal="Confirm Password" styleVal={{ display: isOtpSent ? 'none' : 'block' }} />
          <p style={{ display: isOtpSent ? 'none' : 'block' }} className="confirm-pass-error error">{confirmPasswordError}</p>
        <InputField htmlFor="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} id="otp" placeholder="Enter the OTP" labelVal="OTP" styleVal={{ display: isOtpSent ? 'block' : 'none' }} />

        <button type="submit" disabled={!areAllFieldsValid} className="submit loading" style = {{opacity: areAllFieldsValid ? 1 : 0.5, cursor: areAllFieldsValid ? 'pointer' : 'not-allowed'}} onClick={() => {setTitleError(""); (isOtpSent ? handleRegister() : handleOtpGeneration()); }}>{isLoading ? <><i className="pi pi-spin pi-spinner spin"></i><span>Processing...</span></> : <>{isOtpSent ? 'Verify OTP' : 'Sign Up'}</>}</button>
        <button type="submit" className="resubmit" disabled = {timer!==0} style = {{opacity: timer===0 ? 1 : 0.5, cursor: timer===0 ? 'pointer' : 'not-allowed',display: isOtpSent ? 'block' : 'none'}} onClick={() => {setTitleError("");handleResendOtpGeneration();}}>Resend</button>

        <p className="auth-text">Already have an account ?<a onClick={() => {toggleForm();setTitleError("");resetFormStates();}} style={{ cursor: 'pointer' }}>Login</a></p>
        <p className="text-center" style={{display : isOtpSent ? 'block' : 'none'}}>{`Didn’t receive the OTP? Resend in ${timer}s`}</p>
        <p className="title-error">{titleError}</p>
        </form>
        </>
      );    
};

export default SignupForm;
