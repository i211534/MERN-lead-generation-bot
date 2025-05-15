// server.js - Node.js/Express Backend with Neon Database (PostgreSQL)

const express = require('express');
const { Pool } = require('pg');  // PostgreSQL client
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Neon Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some Neon Database connections
  }
});

// Test database connection
pool.connect()
  .then(() => console.log('Connected to Neon PostgreSQL database'))
  .catch(err => console.error('Neon PostgreSQL connection error:', err));

// Initialize database by creating tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Create leads table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        company VARCHAR(100) NOT NULL,
        interest VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized: tables created if they did not exist');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Call the initialize function when the server starts
initializeDatabase();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use 'gmail' directly since that's what you're using
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,  // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD  // This should be your app password
  }
});

// API Endpoint to receive lead data
app.post('/api/lead', async (req, res) => {
  try {
    const { name, email, phone, company, interest } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !company || !interest) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }

    // Insert lead into PostgreSQL database
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, company, interest) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, phone, company, interest]
    );

    const newLeadId = result.rows[0].id;

    // Send notification email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: 'New Lead Generated',
      text: `
        New lead information:
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Company: ${company}
        Interested in: ${interest}
        
        Date: ${new Date().toLocaleString()}
      `
    };

    // Only send email if configured properly
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter.sendMail(mailOptions)
        .then(() => console.log('Lead notification email sent'))
        .catch(error => console.error('Error sending email:', error));
    }

    // Return success
    res.status(201).json({
      success: true,
      message: 'Lead successfully created',
      data: { id: newLeadId }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// API to get all leads (for admin dashboard)
app.get('/api/leads', async (req, res) => {
  try {
    // Basic API key authentication
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized' 
      });
    }
    
    const result = await pool.query(
      'SELECT * FROM leads ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});