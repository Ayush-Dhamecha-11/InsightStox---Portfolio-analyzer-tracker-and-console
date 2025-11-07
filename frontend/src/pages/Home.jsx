import React, { useState } from "react";
import "./Home.css";
import home_background from "../assets/home-page-bg.jpg";
import dashboard_background from "../assets/desh_board.png";
import ImgDiv from "../components/ImgDiv.jsx";
import ButtonDiv from "../components/ButtonDiv.jsx";
import TextDiv from "../components/TextDiv.jsx";
import Footer from "../components/Footer.jsx";
import upArrow from "../assets/upArrow.png"
import optimize_act from "../assets/Optimize_Act.png";
import trackPerformace from "../assets/trackPerformance.png";
import addPortfolio from "../assets/addPortfolio.png";
import creatACC from "../assets/creatAcc.png";
import downArrow from "../assets/downArrow.png"
import featurelogo1 from "../assets/featuredivlogo1.png"
import featurelogo2 from "../assets/featuredivlogo2.png"
import featurelogo3 from "../assets/featuredivlogo3.png"
import featurelogo4 from "../assets/featuredivlogo4.png"
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAppContext } from "../context/AppContext";

export const Home = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const { darkMode, setDarkMode } = useAppContext();
  const [expandedCard, setExpandedCard] = useState(null);
  function toggleArrow(index) { 
    setOpenIndex(openIndex === index ? 0 : index)
  }
  
  function CardClick(cardNumber) {
    setExpandedCard(cardNumber);
  }
  
  function SeeLess() {
    setExpandedCard(null);
  }
  return (
      <div className="home-main">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} pageType="/" />

        <div className="main_page">

          <div className="home-body">
            <ImgDiv className="home_img" src={home_background} alt="Home Background" />
            
            <div className="middle_text_part">
              <TextDiv tagName="h1" className="title" data_aos="fade-down" val={<>Go Beyond Guesswork.<br />Invest with <span style={{color : "#00C853"}}>Insight</span>.</>}/>
              <TextDiv tagName="p" className="subtitle" data_aos="fade-up" val={<>Empower your financial decisions with our platform's <br /> advanced analytics and intelligent forecasting.</>}/>
              <Link to="/auth" onClick={() => {sessionStorage.setItem("isLogin", "true");
                                              sessionStorage.setItem("forgotpassword", "false");}}>
                <ButtonDiv className="get_started_btn" data_aos="zoom-in" val="Get Started"/>
              </Link>
            </div>

          </div>
      

          <div className="dash_board_template" data-aos="fade-up">
            <h1>Your entire portfolio, beautifully visualized.</h1>
            <img src={dashboard_background} alt="Dashboard Background" />
          </div>

          <div className="features_div" id="feature" data-aos="fade-up">
            <TextDiv tagName="h1" className="features_title_div" val={<>Everything You Need to Invest <br /> Smarter</>}/>
            <div className={`features_section ${expandedCard ? 'expanded' : ''}`} >

           <div className={`features_card ${expandedCard === 1 ? 'expanded' : expandedCard && expandedCard !== 1 ? 'hidden' : ''}`} 
                onClick={() =>CardClick(1)}>
                <div className="logo-title">
                <ImgDiv className="feature_img" src={featurelogo1} alt="logo" />
                <TextDiv className="feature_title" tagName="h2" val="Dynamic Portfolio Tools" />
                </div>
                <TextDiv tagName="p" className="feature_para" val="Your portfolio isn't static, and your tools shouldn't be either. Model potential changes, analyze your diversification, and rebalance your assets with powerful, easy-to-use tools that help you stay in control."/>
                {expandedCard === 1 && (
                  <div className="see_less">
                      <button onClick={(e) => {e.stopPropagation(); SeeLess();}}>See less</button>
                  </div>
                )}
            </div>

              <div className={`features_card ${expandedCard === 2 ? 'expanded' : expandedCard && expandedCard !== 2 ? 'hidden' : ''}`} 
                onClick={() =>CardClick(2)}>
                <div className="logo-title">
                <ImgDiv className="feature_img" src={featurelogo2} alt="logo" />
                <TextDiv className="feature_title" tagName="h2" val="Unified Dashboard" />
                </div>
                <TextDiv tagName="p" className="feature_para" val="Stop juggling spreadsheets and multiple apps. See your entire financial picture, across all assets, in one clean, real time view. Track your net worth and performance effortlessly."/>
                {expandedCard === 2 && (
                  <div className="see_less">
                      <button onClick={(e) => {e.stopPropagation(); SeeLess();}}>See less</button>
                  </div>
                )}
              </div>

              <div className={`features_card ${expandedCard === 3 ? 'expanded' : expandedCard && expandedCard !== 3 ? 'hidden' : ''}`} 
              onClick={() =>CardClick(3)}>
                <div className="logo-title">
                <ImgDiv className="feature_img" src={featurelogo3} alt="log" />
                <TextDiv className="feature_title" tagName="h2" val="Smart Watchlist" />
                </div>
                <TextDiv tagName="p" className="feature_para" val="Keep potential investments organized and ready for analysis. Track key metrics for stocks you're interested in, all in one place, so you can act with confidence when the time is right."/>
                {expandedCard === 3 && (
                  <div className="see_less">
                      <button onClick={(e) => {e.stopPropagation(); SeeLess();}}>See less</button>
                  </div>
                )}
              </div>


              <div className={`features_card ${expandedCard === 4 ? 'expanded' : expandedCard && expandedCard !== 4 ? 'hidden' : ''}`}
               onClick={() =>CardClick(4)}>
                <div className="logo-title">
                <ImgDiv className="feature_img" src={featurelogo4} alt="logo" />
                <TextDiv className="feature_title" tagName="h2"  val="Intelligent Insights"/>
                </div>
                <TextDiv tagName="p" className="feature_para" val='Go beyond raw data. Our AI-powered "Intellisense" analyzes your portfolio to highlight hidden risks, uncover new opportunities, and provide actionable suggestions so you can invest with confidence, not guesswork.'/>
                {expandedCard === 4 && (
                  <div className="see_less">
                      <button onClick={(e) => {e.stopPropagation(); SeeLess();}}>See less</button>
                  </div>
                )}
              </div>
                
            </div>
          </div>

          <div id="HowItWorks" className="powerful_features" data-aos="fade-up">
            <TextDiv tagName="h1" className="p_features_title_div" data_aos="fade-up" val={<>Unlock powerful insights in four <br/> simple steps.</>}/>
            <div className="powerful_features_section" data-aos="fade-up">

              <div className="p_features_card_1 p_features_card">
                <ImgDiv className="p_feature_img" src={creatACC} alt="Creat account img" />
                <TextDiv tagName="h2" tagName2="p" className="p_feature_text_div" val="1. Create Your Account" val2="Create your secure account to access your personalized dashboard."/>
              </div>

              <div className="p_features_card_2 p_features_card">
                <ImgDiv className="p_feature_img" src={addPortfolio} alt="add portfolio logo" />
                <TextDiv className="p_feature_text_div" tagName="h2" tagName2="p" val="2. Add Portfolio" val2="Connect your brokerage or manually add assets to build your portfolio"/>
              </div>

              <div className="p_features_card_3 p_features_card">
                <ImgDiv className="p_feature_img" src={trackPerformace} alt="portfolio Tracking log" />
                <TextDiv className="p_feature_text_div" tagName="h2" tagName2="p" val="3. Track Performance" val2="Monitor real-time performance with clear charts and key metrics."/>
              </div>

              <div className="p_features_card_4 p_features_card">
                <ImgDiv className="p_feature_img" src={optimize_act} alt="optimize & act logo" />
                <TextDiv className="p_feature_text_div" tagName="h2" tagName2="p" val="4. Optimize & Act" val2="Use insights to optimize your portfolioaand make informed trades."/>
              </div>
                
            </div>
          </div>

          <div id="FAQs" className="FAQs_div" data-aos="fade-up" data-aos-duration="1000" data-aos-offset="100">
            <TextDiv className="FAQ_title" tagName="h1" val="Frequently Asked Questions"/>
            <div className="question_div">
              <div className="que1 que">
                <div className="innerBoxOfQue">
                  <h2>Q : Is my financial data secure?</h2>
                  <ImgDiv className="arrow_img_div" src={openIndex==1 ? upArrow : downArrow} alt=" Arrow logo" onClick={() => toggleArrow(1)}/>
                </div>
                <p className="answer_text" style={{display : openIndex==1 ? "block" : "none"}}>Absolutely. We use bank-level encryption and follow industry best practices to ensure your data is always protected. We will never share your personal or financial data without your explicit consent.</p>
              </div>

              <div className="que2 que">
                <div className="innerBoxOfQue">
                  <h2>Q : Is InsightStox a financial advisor?</h2>
                  <ImgDiv className="arrow_img_div" src={openIndex==2 ? upArrow : downArrow} alt=" Arrow logo" onClick={() => toggleArrow(2)}/>
                </div>
                <p className="answer_text" style={{display : openIndex==2 ? "block" : "none"}}>InsightStox offers a powerful free plan that includes a dashboard, portfolio tracking, and a limited number of AI insights per month. For unlimited insights, advanced analytics, and priority support, you can upgrade to our Pro plan. You can find detailed information on our pricing page.</p>
              </div>

              <div className="que3 que">
                <div className="innerBoxOfQue">
                  <h2>Q : What is the pricing for InsightFolio?</h2>
                  <ImgDiv className="arrow_img_div" src={openIndex==3 ? upArrow : downArrow} alt=" Arrow logo" onClick={() => toggleArrow(3)}/>
                </div>
                <p className="answer_text" style={{display : openIndex==3 ? "block" : "none"}}>Our AI analyzes market data from trusted sources, including real-time price feeds, historical performance, and key financial metrics. It uses this data to identify trends and patterns, generating insights based on established investment principles to help you optimize your portfolio.</p>
              </div>

              <div className="que4 que">
                <div className="innerBoxOfQue">
                  <h2>Q : Which brokerages can I connect?</h2>
                  <ImgDiv className="arrow_img_div" src={openIndex==4 ? upArrow : downArrow} alt=" Arrow logo" onClick={() => toggleArrow(4)}/>
                </div>
                <p className="answer_text" style={{display : openIndex==4 ? "block" : "none"}}>We are constantly expanding our integrations. Currently, we support connections with major brokerages like Zerodha, Groww, and Upstox, with more coming soon. You can also add your holdings manually.</p>
              </div>

              <div className="que5 que">
                <div className="innerBoxOfQue">
                  <h2>Q : How does the AI generate its suggestions?</h2>
                  <ImgDiv className="arrow_img_div" src={openIndex==4 ? upArrow : downArrow} alt=" Arrow logo" onClick={() => toggleArrow(5)}/>
                </div>
              <p className="answer_text" style={{display : openIndex==5 ? "block" : "none"}}>Absolutely. We use bank-level encryption and follow industry best practices to ensure your data is always protected. We will never share your personal or financial data without your explicit consent.</p>
              </div>
                
            </div>
          </div>


          <div className="signup_div" data-aos="fade-up">
            <TextDiv className="_text" tagName="h1" tagName2="p" val={<>Ready to Take Control of Your <br/>Investments ?</>} val2="Sign up for free and start making smarter, data-backed decisions today."/>
            <Link to ={`/auth`} onClick={() => {sessionStorage.setItem("isLogin", "false");
                                              sessionStorage.setItem("forgotpassword", "false");}}>
            <ButtonDiv className="signup_btn" val="Sign Up Now" />
            </Link>
          </div>
        <Footer darkMode={darkMode}  
                navigationLinks={[
                    { text: "Features", href: "#feature" },
                    { text: "FAQs", href: "#FAQs" },
                    { text: "How It Works?", href: "#HowItWorks" },
                ]}
                legalLinks={[
                    { text: "Privacy Policy", href: "#privacy" },
                    { text: "Terms Of Service", href: "#terms" },
                ]}/>
        </div>
      </div>
  );
};
