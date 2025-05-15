//LeadBot.js
import React, { useState, useEffect } from 'react';
import './LeadBot.css';

const LeadBot = () => {
  // Chat state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentStage, setCurrentStage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: ''
  });
  
  // Chat flow stages
  const stages = [
    { message: "Hi there! 👋 I'm your virtual assistant. Are you interested in learning more about our services?", type: "welcome" },
    { message: "Great! Can I have your name please?", type: "name" },
    { message: "Thanks, {name}! What's your email address so we can reach out to you?", type: "email" },
    { message: "Perfect! Could I also get your phone number?", type: "phone" },
    { message: "Almost done! Which company are you representing?", type: "company" },
    { message: "Last question, {name}. Which of our services are you most interested in?\n\n1. Web Development\n2. Mobile Apps\n3. Digital Marketing\n4. AI Solutions", type: "interest" },
    { message: "Thank you for your interest, {name}! Our team will contact you shortly at {email} to discuss how we can help {company} with {interest}.", type: "completion" }
  ];

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(stages[0].message);
    }
  }, [isOpen]);

  // Process response based on current stage
  const processResponse = (userResponse) => {
    let isValid = true;
    let newLeadData = { ...leadData };
    
    // Validate and store response based on current stage
    switch(stages[currentStage].type) {
      case "welcome":
        // Any response moves to the next stage
        break;
      case "name":
        if (userResponse.trim().length > 0) {
          newLeadData.name = userResponse.trim();
        } else {
          isValid = false;
          addBotMessage("I need your name to continue. Please try again.");
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(userResponse)) {
          newLeadData.email = userResponse;
        } else {
          isValid = false;
          addBotMessage("That doesn't look like a valid email. Please try again.");
        }
        break;
      case "phone":
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (phoneRegex.test(userResponse.replace(/\s+/g, '')) || userResponse.length >= 10) {
          newLeadData.phone = userResponse;
        } else {
          isValid = false;
          addBotMessage("Please enter a valid phone number.");
        }
        break;
      case "company":
        if (userResponse.trim().length > 0) {
          newLeadData.company = userResponse.trim();
        } else {
          isValid = false;
          addBotMessage("I need your company name. Please try again.");
        }
        break;
      case "interest":
        // Handle numeric or text input for interests
        let interest = userResponse.trim();
        
        // Map numeric responses to service names
        if (interest === "1") interest = "Web Development";
        else if (interest === "2") interest = "Mobile Apps";
        else if (interest === "3") interest = "Digital Marketing";
        else if (interest === "4") interest = "AI Solutions";
        
        newLeadData.interest = interest;
        break;
      default:
        break;
    }
    
    setLeadData(newLeadData);
    
    if (isValid) {
      moveToNextStage(newLeadData);
    }
  };

  // Move to next stage in the conversation
  const moveToNextStage = (updatedLeadData) => {
    const nextStage = currentStage + 1;
    
    if (nextStage < stages.length) {
      setCurrentStage(nextStage);
      
      // Personalize message with user data
      let nextMessage = stages[nextStage].message;
      nextMessage = nextMessage.replace('{name}', updatedLeadData.name || '');
      nextMessage = nextMessage.replace('{email}', updatedLeadData.email || '');
      nextMessage = nextMessage.replace('{company}', updatedLeadData.company || '');
      nextMessage = nextMessage.replace('{interest}', updatedLeadData.interest || '');
      
      // Add a small delay to simulate typing
      setTimeout(() => {
        addBotMessage(nextMessage);
      }, 700);
      
      // Submit lead data when conversation is complete
      if (nextStage === stages.length - 1) {
        submitLeadData(updatedLeadData);
      }
    }
  };

  // Submit lead data to backend
  const submitLeadData = async (data) => {
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit lead data');
      }
      
      // Lead successfully submitted
      console.log('Lead submitted successfully');
    } catch (error) {
      console.error('Error submitting lead:', error);
      addBotMessage("There was an issue saving your information. Please try again later or contact us directly.");
    }
  };

  // Add a bot message to the chat
  const addBotMessage = (message) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { text: message, sender: 'bot' }]);
      setIsTyping(false);
    }, 800);
  };

  // Add a user message to the chat
  const addUserMessage = (message) => {
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
  };

  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (userInput.trim() === '') return;
    
    addUserMessage(userInput);
    processResponse(userInput);
    setUserInput('');
  };

  // Reset the conversation
  const resetChat = () => {
    setMessages([]);
    setCurrentStage(0);
    setLeadData({
      name: '',
      email: '',
      phone: '',
      company: '',
      interest: ''
    });
    addBotMessage(stages[0].message);
  };

  return (
    <div className="lead-bot-container">
      {/* Chat toggle button */}
      <button 
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬 Chat with us!'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Lead Generation Bot</h3>
            <button onClick={resetChat} className="reset-btn">↻</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="typing-indicator">...</div>}
          </div>

          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              disabled={currentStage >= stages.length - 1}
            />
            <button 
              type="submit"
              disabled={currentStage >= stages.length - 1}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LeadBot;