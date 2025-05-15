#ReadMe.md
# Lead Generation Chatbot - Setup & Configuration Guide

This project implements a customizable lead generation chatbot with React frontend and Node.js/Express backend. The bot collects visitor information through a chat interface and stores it in a MongoDB database.

## Project Structure

```
lead-generation-bot/
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── LeadBot.js  # Bot component
│       │   └── LeadBot.css # Bot styles
│       ├── App.js          # Demo app with bot integration
│       └── ...
├── server.js              # Express backend
├── .env                   # Environment variables
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

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

### Step 3: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/leadgen
# or for MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leadgen

# Email Configuration (for lead notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com

# Admin API Key (for accessing leads API)
ADMIN_API_KEY=your-secure-api-key
```

Note: For Gmail, you'll need to use an App Password if you have 2FA enabled.

### Step 4: Run the application

#### Development Mode (separate servers)

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

## Customization Options

### 1. Edit Conversation Flow

To customize the conversation flow, modify the `stages` array in `client/src/components/LeadBot.js`:

```javascript
const stages = [
  { message: "Custom welcome message", type: "welcome" },
  { message: "Custom name question", type: "name" },
  // Add more stages or modify existing ones
];
```

### 2. Styling

Edit the `LeadBot.css` file to match your brand colors and styling preferences.

### 3. Backend Integration

You can connect the lead data to various services:

- Change the MongoDB schema in `server.js` if you need additional fields
- Modify the email notification template in `server.js`
- Add integrations with CRM systems (e.g., HubSpot, Salesforce)

### 4. Email Templates

For more advanced email templates, you can use HTML emails:

```javascript
const mailOptions = {
  // ...
  html: `
    <h1>New Lead Generated</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <!-- More fields -->
  `
};
```

## API Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/lead` | POST | Submit a new lead | None |
| `/api/leads` | GET | Get all leads | API Key |

## Deployment

This application can be deployed to:

- Heroku
- Vercel (frontend) + Heroku (backend)
- AWS/GCP/Azure
- Any platform supporting Node.js applications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue in the repository or contact the support team.