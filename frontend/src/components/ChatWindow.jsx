import React,{useEffect,useRef, useState} from "react";
import "../components/ChatWindow.css";
import axios from "axios";
import ReactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import { useAppContext } from "../context/AppContext";
import { RingLoader } from "react-spinners";


const ChatWindow = () => {
// ----------------------------------------------------------state variables--------------------------------------------------------
    const [messages,setMessages] = useState([]);
    const [input,setInput] = useState("");
    const [chatStart,setChatStart] = useState(false);
    const { userDetails } = useAppContext(); 
    const chatEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

// ----------------------------------------------------------useEffects--------------------------------------------------------
   // Scroll to the bottom of the chat when a new message is added
useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior : "smooth"});
    },[messages])

// ----------------------------------------------------------functions--------------------------------------------------------
// Function to handle sending message
    const handleSend = async ()=>{
        const text = input.trim();
        if(!text)return;
        setIsLoading(true);
        setChatStart(true);
        setInput("");
        const typingMsg = { id: "typing", text: "Bot is typing... ", sender: "bot", typing: true };
        const userMsg = {id:Date.now(),text, sender:"user"};
        setMessages((prev) => [...prev, userMsg, typingMsg]);
        try{
                const res = await axios.post(import.meta.env.VITE_BACKEND_LINK + "/api/v1/ai-insight/sendMessage",{
                message : userMsg,
                withCredentials: true,
            });
            
            const replyText = <ReactMarkDown remarkPlugins={[remarkGfm, remarkEmoji]}>{res.data.reply}</ReactMarkDown>;
            setMessages((prev) => [...prev.filter((msg)=>msg.id !== "typing"), { id: Date.now(), text: replyText, sender: 'bot' }]);
            setIsLoading(false);
        }catch(err){
            console.error("Error sending message:", err);
            setMessages((prev) => [...prev.filter((msg) => msg.id !== "typing"), { 
                text: err.message, 
                sender: 'bot',
                typing: false
            }]);
            setIsLoading(false);
        }
    }
// Function to handle Enter key press
    const handleKeyDown = (e) => {
        if(e.key === "Enter") handleSend();
    }
    
    

// ----------------------------------------------------------JSX--------------------------------------------------------
  return (
    <div className="chat-window">

    {!chatStart && (
        <div className="chat-welcome-message">
                    <h2>Hello, <span className="user-name">{userDetails?.name?.split(" ")[0]  || 'Guest'}!</span></h2>
                    <h3>How can I help you Today?</h3>
        </div>
    )}
        <div className="chat-messages">
                {messages.map((msg) => (
                    <div className={`chat-bubble ${msg.sender}-bubble ${msg.typing ? "typing" : ""}`} key={msg.id}>
                        <div>{msg.text}</div>
                    </div>
                ))}
                <div ref={chatEndRef} />
        </div>

        <div className={`chat-input-area ${isLoading ? "loading" : ""}`}>
                <input type="text" value={input} onChange={(e) => {setInput(e.target.value)}} onKeyDown={handleKeyDown} placeholder="Type a message..." className="chat-input"/>
                <button className="send-btn" onClick={handleSend}>{isLoading ? <RingLoader color="#000000" size={25}/> : <>Send</>}</button>
        </div>
    </div>
  )
}

export default ChatWindow