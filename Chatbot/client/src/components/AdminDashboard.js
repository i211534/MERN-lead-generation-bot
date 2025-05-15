//AdminDashboard.js
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }
      
      const data = await response.json();
      setLeads(data.data);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    fetchLeads();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Lead Generation Admin Dashboard</h1>
      </div>
      
      {!authenticated ? (
        <div className="auth-container">
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Admin Login</h2>
            <div className="form-group">
              <label htmlFor="apiKey">API Key</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your admin API key"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-actions">
            <button onClick={fetchLeads} className="refresh-btn">
              Refresh Data
            </button>
            <span className="lead-count">{leads.length} Leads</span>
          </div>
          
          {isLoading ? (
            <div className="loading">Loading leads...</div>
          ) : (
            <div className="leads-table-container">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Interest</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td>
                          <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        </td>
                        <td>
                          <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                        </td>
                        <td>{lead.company}</td>
                        <td>{lead.interest}</td>
                        <td>{formatDate(lead.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-leads">
                        No leads found. Your chatbot hasn't collected any leads yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="export-section">
            <h3>Export Options</h3>
            <div className="export-buttons">
              <button 
                className="export-btn"
                onClick={() => {
                  const csvContent = [
                    ["Name", "Email", "Phone", "Company", "Interest", "Date"],
                    ...leads.map(lead => [
                      lead.name,
                      lead.email,
                      lead.phone,
                      lead.company,
                      lead.interest,
                      formatDate(lead.createdAt)
                    ])
                  ]
                  .map(row => row.join(","))
                  .join("\n");
                  
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `leads_${new Date().toISOString().slice(0,10)}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Export to CSV
              </button>
              
              <button 
                className="export-btn"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  const htmlContent = `
                    <html>
                    <head>
                      <title>Leads Report - ${new Date().toLocaleDateString()}</title>
                      <style>
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1 { color: #333; }
                      </style>
                    </head>
                    <body>
                      <h1>Leads Report - ${new Date().toLocaleDateString()}</h1>
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Interest</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${leads.map(lead => `
                            <tr>
                              <td>${lead.name}</td>
                              <td>${lead.email}</td>
                              <td>${lead.phone}</td>
                              <td>${lead.company}</td>
                              <td>${lead.interest}</td>
                              <td>${formatDate(lead.createdAt)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </body>
                    </html>
                  `;
                  printWindow.document.write(htmlContent);
                  printWindow.document.close();
                  printWindow.print();
                }}
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;