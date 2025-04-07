import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './chat.css';
import { FiMessageSquare, FiTrash2, FiX, FiSend } from 'react-icons/fi';

function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('session-' + Date.now());
  const [isOpen, setIsOpen] = useState(false);
  const chatBoxRef = useRef(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
  
    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
  
    try {
      const res = await axios.post('http://localhost:5000/chat', {
        prompt,
        sessionId,
        history: [...messages, userMessage],
      });
  
      const responseText = res?.data?.response || 'No response.';
      const botMessage = { sender: 'bot', text: responseText };
      setMessages((prev) => [...prev, botMessage]);
  
    } catch (err) {
      console.error(err);
      const errorMsg = { sender: 'bot', text: '❌ Error: Could not reach the server.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId('session-' + Date.now());
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="digi-chatbot-container">
      {/* Chat button */}
      <button 
        className="digi-chat-toggle-btn" 
        onClick={toggleChat}
        style={{
          display: isOpen ? 'none' : 'flex'
        }}
      >
        <FiMessageSquare size={35} />
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="digi-chat-window open">
          <div className="digi-chat-header">
            <h2>Chatbot</h2>
            <div className="digi-header-actions">
              <button className="digi-clear-btn" onClick={clearChat}>
                <FiTrash2 size={16} />
              </button>
              <button className="digi-close-btn" onClick={toggleChat}>
                <FiX size={16} />
              </button>
            </div>
          </div>
          
          <div className="digi-chat-body">
            <div className="digi-messages-wrapper">
              <div className="digi-messages-scroll" ref={chatBoxRef}>
                {messages.length === 0 && (
                  <div className="digi-welcome-block">
                    <h3>Welcome to Digi Chatbot!</h3>
                    <p>Ask me anything to get started.</p>
                  </div>
                )}
                
                {messages.map((msg, index) => (
                  <div key={index} className={`digi-message ${msg.sender}`}>
                    <div
                      className="digi-message-bubble"
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\n/g, '<br/>') // keeps newlines
                      }}
                    />
                  </div>
                ))}
                
                {loading && (
                  <div className="digi-message bot">
                    <div className="digi-message-bubble digi-loading">
                      <div className="digi-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="digi-input-container">
              <div className="digi-input-group">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={loading}
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !prompt.trim()}
                  className="digi-send-btn"
                >
                  <FiSend size={25} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;