const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Simulation Data Generators
const ATTACK_TYPES = ["Brute Force", "SQL Injection", "DDoS", "Malware", "Phishing", "Unauthorized Access"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const COUNTRIES = ["USA", "China", "Russia", "Germany", "Brazil", "UK", "India", "France"];

const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateAlert = () => {
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  return {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    severity,
    sourceIP: generateRandomIP(),
    targetIP: "192.168.1.105",
    location: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    status: "Active"
  };
};

const generateTraffic = () => {
  return {
    timestamp: new Date().toISOString(),
    incoming: Math.floor(Math.random() * 500) + 100,
    outgoing: Math.floor(Math.random() * 300) + 50,
  };
};

const generateThreatMapPoint = () => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    from: {
      lat: (Math.random() * 140) - 70,
      lng: (Math.random() * 360) - 180,
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      ip: generateRandomIP()
    },
    to: {
      lat: 40.7128, // Target: New York
      lng: -74.0060,
      country: "USA",
      ip: "10.0.0.1"
    },
    severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)]
  };
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial burst of data
  const initialAlerts = Array.from({ length: 5 }, generateAlert);
  socket.emit('initial_alerts', initialAlerts);

  // Start Simulation Loops
  let alertInterval = setInterval(() => {
    socket.emit('new_alert', generateAlert());
  }, 5000);

  let trafficInterval = setInterval(() => {
    socket.emit('traffic_update', generateTraffic());
  }, 2000);

  let mapInterval = setInterval(() => {
    socket.emit('new_threat', generateThreatMapPoint());
  }, 3000);

  // Manual Controls
  socket.on('simulate_breach', () => {
    const breach = {
      ...generateAlert(),
      type: "🔥 CRITICAL BREACH",
      severity: "Critical",
      location: "Internal Server Cluster"
    };
    socket.emit('new_alert', breach);
    socket.emit('new_threat', generateThreatMapPoint());
  });

  socket.on('activate_mitigation', () => {
    console.log('Mitigation activated - slowing down alerts');
    clearInterval(alertInterval);
    clearInterval(mapInterval);
    
    // Resume normal simulation after a "cool down"
    setTimeout(() => {
      alertInterval = setInterval(() => {
        socket.emit('new_alert', generateAlert());
      }, 5000);
      mapInterval = setInterval(() => {
        socket.emit('new_threat', generateThreatMapPoint());
      }, 3000);
    }, 10000);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(alertInterval);
    clearInterval(trafficInterval);
    clearInterval(mapInterval);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// --- EXTERNAL ATTACK WEBHOOKS ---

// 1. SQL Injection Trigger
app.post('/api/attack/sql-injection', (req, res) => {
  const alert = {
    ...generateAlert(),
    type: "💉 SQL INJECTION DETECTED",
    severity: "Critical",
    sourceIP: req.body.ip || "103.24.12.8",
    targetIP: "DB-PROD-01"
  };
  io.emit('new_alert', alert);
  res.json({ message: 'SQL Injection Event Logged' });
});

// 2. DDoS Trigger
app.post('/api/attack/ddos', (req, res) => {
  const alert = {
    ...generateAlert(),
    type: "🌀 DDOS ATTACK (UDP FLOOD)",
    severity: "High",
    sourceIP: "BOTNET_CLUSTER_A",
    targetIP: "GATEWAY_LB"
  };
  io.emit('new_alert', alert);
  res.json({ message: 'DDoS Event Logged' });
});

// 3. Malware Trigger
app.post('/api/attack/malware', (req, res) => {
  const alert = {
    ...generateAlert(),
    type: "🦠 MALWARE EXECUTION PREVENTED",
    severity: "Critical",
    sourceIP: "192.168.1.45",
    targetIP: "WS-ANALYST-12"
  };
  io.emit('new_alert', alert);
  res.json({ message: 'Malware Event Logged' });
});

// 4. Mitigation Trigger
app.post('/api/prevent', (req, res) => {
  io.emit('mitigation_status', { 
    active: true, 
    type: req.body.type || "Auto-Block",
    target: req.body.target || "All Nodes"
  });
  res.json({ message: 'Prevention System Activated' });
});

// --- HONEY POT / DECEPTIVE PROBE SENSORS ---
app.get('/api/honey-pot/:path', (req, res) => {
  const alert = {
    ...generateAlert(),
    type: `🚨 DECEPTIVE PROBE: /${req.params.path}`,
    severity: "High",
    sourceIP: req.ip || "REMOTE_VISITOR",
    targetIP: "HONEY_POT_DECOY"
  };
  io.emit('new_alert', alert);
  res.status(403).send("<h1>403 Forbidden</h1><p>Access Denied. Your IP has been logged by the SOC Security System.</p>");
});

server.listen(PORT, () => {
  console.log(`SOC Simulation Server running on port ${PORT}`);
});
