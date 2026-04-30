# Professional SOC Analyst Dashboard

A high-fidelity, full-stack cybersecurity operations center dashboard built with React, Node.js, and Firebase.

## Features

- 🔐 **Secure Authentication**: Firebase Auth for analyst access.
- 🚨 **Real-time Alert Simulation**: Live incident stream via Socket.io.
- 🌍 **Interactive Threat Map**: Stylized global attack visualization.
- 📊 **Analytics Command Center**: Distribution and frequency charts using Recharts.
- 📡 **Network Monitor**: Real-time traffic throughput visualization.
- 💎 **Premium UI**: Glassmorphism, neon accents, and animated cyber backgrounds.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: Firebase (Authentication & Firestore).
- **Charts**: Recharts.

## Setup Instructions

### 1. Clone & Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```
*Server will start on port 5000.*

### 3. Frontend Setup
1. Configure Firebase in `client/src/firebase.js` with your credentials.
2. Install and start:
```bash
cd client
npm install
npm run dev
```
*Client will start on port 5173.*

### 4. Firebase Configuration
To enable Authentication, create a project on [Firebase Console](https://console.firebase.google.com/), enable Email/Password Auth, and copy your web app config into `client/src/firebase.js`.

## Folder Structure

- `client/`: React frontend application.
- `server/`: Node.js simulation engine.
- `client/src/components/`: Reusable UI modules.
- `client/src/context/`: State management (Auth/Sockets).
- `client/src/pages/`: Main view layouts.

## License
MIT - Created for professional SOC simulation.
