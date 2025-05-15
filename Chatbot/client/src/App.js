//App.js
import React, { useState, useEffect } from 'react';
import LeadBot from './components/LeadBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Lead Generation Bot Demo</h1>
        <p>
          This is a demonstration of a customizable lead generation bot.
          Click the chat button in the bottom right to start a conversation.
        </p>
      </header>
      
      <main className="App-main">
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>Collects visitor information (name, email, phone, company)</li>
            <li>Validates input data (email format, phone number)</li>
            <li>Sends lead data to MongoDB database</li>
            <li>Sends email notifications for new leads</li>
            <li>Customizable conversation flow</li>
            <li>Mobile-responsive design</li>
          </ul>
        </section>
      </main>
      
      {/* Lead Generation Bot Component */}
      <LeadBot />
    </div>
  );
}

export default App;