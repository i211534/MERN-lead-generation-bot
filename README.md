# Lead Generation Chatbot - Setup & Configuration Guide

This project provides a customizable lead generation chatbot with a React frontend and Node.js/Express backend. The chatbot collects visitor information through an interactive chat interface and securely stores it in a Neon Database (PostgreSQL).

## Project Structure

```
lead-generation-bot/
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── LeadBot.js  # Chatbot component
│       │   └── LeadBot.css # Chatbot styles
│       ├── App.js          # Demo app with chatbot integration
│       └── ...
├── server.js              # Express backend
├── .env                   # Environment variables
└── package.json
```

## Setup Instructions

### Prerequisites
- **Node.js** (v14 or newer)
- **Neon Database** (PostgreSQL hosted database)
- **npm** or **yarn**

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd lead-generation-bot
```

### Step 2: Install dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following configuration:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Neon Database (PostgreSQL) Connection
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database-name>

# Email Configuration (for lead notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com

# Admin API Key (for accessing leads API)
ADMIN_API_KEY=your-secure-api-key
```

> **Note:** Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database-name>` with your Neon Database credentials. Neon typically provides an SSL-enabled connection string, so ensure SSL is properly configured as required.

### Step 4: Run the Application

#### Development Mode (Separate Servers)

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

#### Production Build

```bash
# Build the React frontend
cd client
npm run build
cd ..

# Start the server (serves both API and static frontend)
NODE_ENV=production npm start
```

---

## Screenshots

Add screenshots here to demonstrate key aspects of the application setup and functionality:

1. **Application Running (Frontend and Backend)**  
   _Include a screenshot of the app interface and backend logs here._

2. **Chatbot Interface**  
   _Include an image of the chatbot in action._

3. **Database Entries**  
   _Add a screenshot showing stored lead data in Neon Database._

4. **Email Notification**  
   _Provide a screenshot of the email notification for a new lead._

---

## Customization Options

### 1. Edit Conversation Flow

To tailor the chatbot’s conversation flow, modify the `stages` array in `client/src/components/LeadBot.js`:

```javascript
const stages = [
  { message: "Welcome to our site!", type: "welcome" },
  { message: "What is your name?", type: "name" },
  // Add or modify stages as needed
];
```

### 2. Styling

Customize the chatbot's appearance by editing the `LeadBot.css` file to align with your brand’s colors and design guidelines.

### 3. Backend Integration for Neon Database

- Use the `pg` Node.js client to connect to your Neon Database. Replace MongoDB code in `server.js` with the following:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});
```

- Update the schema and queries to match PostgreSQL syntax. For example, create a table to store leads:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- Replace MongoDB queries with SQL queries (e.g., `INSERT INTO` and `SELECT` statements).

### 4. Email Templates

For more advanced email notifications, use HTML templates:

```javascript
const mailOptions = {
  // ...
  html: `
    <h1>New Lead Generated</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <!-- Add more fields as necessary -->
  `
};
```

---

## API Endpoints

| Endpoint      | Method | Description          | Authentication |
|---------------|--------|----------------------|----------------|
| `/api/lead`   | POST   | Submit a new lead    | None           |
| `/api/leads`  | GET    | Retrieve all leads   | API Key        |

---

## Deployment

You can deploy this application on various platforms, such as:

- **Heroku**
- **Vercel** (frontend) + **Heroku** (backend)
- **AWS**, **GCP**, or **Azure**
- Any platform supporting Node.js applications

---

## License

This project is licensed under the MIT License. For more details, refer to the `LICENSE` file.

---

## Support

If you have any questions or encounter issues, please open an issue in this repository or reach out to the support team.
