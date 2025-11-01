import React, { useState, useRef, useEffect, use } from "react";
import "../components/BotSidebar.css";
import close_icon from "../assets/closeIcon.png";
import open_icon from "../assets/openIcon.png";
import profileicon from "../assets/profileicon.svg";

const BotSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  return (
    <div className={`bot-sidebar ${isOpen ? "open" : "close"}`}>
      {/* close icon */}
      <img
        src={isOpen ? close_icon : open_icon}
        alt="toggle sidebar icon"
        className="bot-toggle-sidebar-btn"
        height={35}
        onClick={toggleSidebar}
      />

      {isOpen && (
        <>
        <div className="chatbot-feature">
          <h2>What You Can Ask</h2>
          <p>Discover how InsightStox AI helps you understand markets, stocks, and trends.</p>


          <div className="chatbot-feature-list">
            <div className="chatbot-f1 chatbot-f">
              <h4>Portfolio Analyzer</h4>
              <p>Get insights into your portfolio’s value, gains, and performance.</p>
            </div>
            <div className="chatbot-f2 chatbot-f">
              <h4>Stock Data Lookup</h4>
              <p>View live stock prices and key financial metrics instantly.</p>
            </div>
            <div className="chatbot-f3 chatbot-f">
              <h4>Risk & Diversification Check</h4>
              <p>Check if your portfolio is balanced and risk-free.</p>
            </div>
            <div className="chatbot-f4 chatbot-f">
              <h4>Market News & Sentiment</h4>
              <p>Track market mood with AI-powered news and sentiment analysis.</p>
            </div>
          </div>
        </div>
          <div className="userInfo">
            <img src={profileicon} alt="profile icon" height={50} className="bot-userProfile-img"/>
            <h3>Ayush Dhamecha</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default BotSidebar;
