import React from "react";
import github_logo from "../assets/github_logo.png";
import TextDiv from "./TextDiv.jsx";
import ImgDiv from "./ImgDiv.jsx";
import "./Footer.css";
import logofooter from "../assets/logofooter.svg";
import logotext from "../assets/logotext.svg";
const Footer = ({ darkMode ,navigationLinks=[],legalLinks=[] }) => {
  return (
    <div className="footer_div" >
      <div className="footer_text_part">
        <div className="footer_upper_text_part">
          <div className="footer_first_column column_div">
            <div className="footer_web">
              
                <img src={logofooter} alt="Website logo" />
            </div>
            <div className="textcolumn">
              <ImgDiv className="logotext" src={logotext} alt="InsightStox text logo"/>
              <TextDiv tagName="p" className="tagline_text" val={<>Analyze Smarter,<br/>Invest Better</>} />
             
              <ImgDiv className="github_logo" src={github_logo} alt="Github logo"/>
          </div>
          </div>

          <div className="footer_second_column column_div">
            <TextDiv tagName="h2" className="navigation_text" val="NAVIGATION" />
            {navigationLinks.map((link) => (
              <TextDiv key={link.text} tagName="a"className={`${link.className || "nav_link"}`} val={link.text}href={link.href}/>
            ))}
          </div>

          <div className="footer_third_column column_div">
            <TextDiv tagName="h2" className="legal_text" val="LEGAL" />
             {legalLinks.map((link) => (
              <TextDiv key={link.text} tagName="a"className={`${link.className || "nav_link"}`} val={link.text}href={link.href}/>
            ))}
          </div>
        </div>
        <div className="footer_below_text_part">
          <TextDiv 
            tagName="p" 
            className="rights_text"  
            val={<>© 2025 InsightStox. All Rights Reserved. This platform is for demonstration purposes only. All financial data and <br/>AI-powered suggestions are for informational purposes and should not be considered financial advice.</>}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
