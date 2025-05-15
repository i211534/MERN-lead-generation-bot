// Lead Generation Bot Configuration

// This file contains the configuration options for customizing
// the lead generation bot behavior, appearance, and flow.

const botConfig = {
    // General Settings
    general: {
      botName: "Lead Assistant",
      welcomeDelay: 3000, // Time in ms before the bot appears (3 seconds)
      typingSpeed: 50,    // Typing speed simulation (characters per second)
      autoOpen: true,     // Automatically open the chat after welcomeDelay
      persistState: true, // Save conversation state in localStorage
      maxIdleTime: 300000 // Close chat after 5 minutes of inactivity
    },
    
    // Appearance
    appearance: {
      primaryColor: "#4a6cf7",
      secondaryColor: "#f1f3f4",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "14px",
      borderRadius: "12px",
      botAvatar: "", // URL to bot avatar image (leave empty for no avatar)
      userAvatar: ""  // URL to user avatar image (leave empty for no avatar)
    },
    
    // Conversation Stages
    stages: [
      {
        id: "welcome",
        message: "Hi there! 👋 I'm your virtual assistant. Are you interested in learning more about our services?",
        responseType: "confirmation"
      },
      {
        id: "name",
        message: "Great! Can I have your name please?",
        responseType: "text",
        validation: {
          required: true,
          minLength: 2,
          errorMessage: "Please enter your name to continue."
        }
      },
      {
        id: "email",
        message: "Thanks, {name}! What's your email address so we can reach out to you?",
        responseType: "email",
        validation: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          errorMessage: "Please enter a valid email address."
        }
      },
      {
        id: "phone",
        message: "Perfect! Could I also get your phone number?",
        responseType: "phone",
        validation: {
          required: true,
          pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
          errorMessage: "Please enter a valid phone number."
        }
      },
      {
        id: "company",
        message: "Almost done! Which company are you representing?",
        responseType: "text",
        validation: {
          required: true,
          errorMessage: "Please enter your company name."
        }
      },
      {
        id: "interest",
        message: "Last question, {name}. Which of our services are you most interested in?\n\n1. Web Development\n2. Mobile Apps\n3. Digital Marketing\n4. AI Solutions",
        responseType: "selection",
        options: [
          { value: "Web Development", label: "Web Development" },
          { value: "Mobile Apps", label: "Mobile Apps" },
          { value: "Digital Marketing", label: "Digital Marketing" },
          { value: "AI Solutions", label: "AI Solutions" }
        ],
        validation: {
          required: true,
          errorMessage: "Please select a service you're interested in."
        }
      },
      {
        id: "completion",
        message: "Thank you for your interest, {name}! Our team will contact you shortly at {email} to discuss how we can help {company} with {interest}.",
        responseType: "none"
      }
    ],
    
    // Follow-up Settings
    followUp: {
      enabled: true,
      delay: 86400000, // 24 hours in milliseconds
      message: "Hi {name}, just checking if you have any questions about our {interest} solutions before our team reaches out?"
    },
    
    // API Endpoints
    api: {
      submitLead: "/api/lead",
      validateEmail: "/api/validate/email"
    },
    
    // Notifications
    notifications: {
      sound: true,
      browserNotification: true,
      notificationTitle: "New Message",
      notificationIcon: "/notification-icon.png"
    }
  };
  
  export default botConfig;