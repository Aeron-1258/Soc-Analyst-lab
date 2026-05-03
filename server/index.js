const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// Models
const Alert = require('./models/Alert');
const Traffic = require('./models/Traffic');
const Threat = require('./models/Threat');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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
    type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
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
  let alertInterval = setInterval(async () => {
    const alertData = generateAlert();
    try {
      socket.emit('new_alert', alertData);
      const alert = new Alert(alertData);
      await alert.save();
    } catch (err) {
      console.error('⚠️ DB Error (Alert not saved):', err.message);
    }
  }, 5000);

  let trafficInterval = setInterval(async () => {
    const trafficData = generateTraffic();
    try {
      socket.emit('traffic_update', trafficData);
      const traffic = new Traffic(trafficData);
      await traffic.save();
    } catch (err) {
      // Silent error for traffic to avoid console flood
    }
  }, 2000);

  let mapInterval = setInterval(async () => {
    const threatData = generateThreatMapPoint();
    try {
      socket.emit('new_threat', threatData);
      const threat = new Threat(threatData);
      await threat.save();
    } catch (err) {
      // Silent error for threat
    }
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

  socket.on('simulate_compromise', async (data) => {
    const scenario = {
      user: "j.doe@enterprise.com",
      lastLogin: {
        ip: "192.168.1.45",
        location: "USA (New York)",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        device: "MacBook Pro - Chrome"
      },
      currentLogin: {
        ip: "103.24.12.8",
        location: "China (Beijing)",
        timestamp: new Date().toISOString(),
        device: "Unknown Linux Device - Firefox",
        userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
        mfaUsed: false
      },
      postLoginActivity: [
        { action: "Accessed Payroll DB", time: "2 mins ago" },
        { action: "Downloaded Customer_List.csv", time: "1 min ago" },
        { action: "Changed API Keys", time: "30 seconds ago" }
      ]
    };

    // 1. Send Failed Login Attempts
    for (let i = 0; i < 3; i++) {
      const failedAlert = {
        ...generateAlert(),
        type: "❌ FAILED LOGIN ATTEMPT",
        severity: "Medium",
        sourceIP: scenario.currentLogin.ip,
        location: scenario.currentLogin.location,
        targetIP: "AUTH-SERVER-01"
      };
      socket.emit('new_alert', failedAlert);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 2. Send Successful Login from New Country
    const successAlert = {
      ...generateAlert(),
      type: "🚨 SUSPICIOUS SUCCESSFUL LOGIN",
      severity: "High",
      sourceIP: scenario.currentLogin.ip,
      location: scenario.currentLogin.location,
      targetIP: "AUTH-SERVER-01",
      metadata: scenario // Attach the full scenario for investigation
    };
    
    try {
      socket.emit('new_alert', successAlert);
      const alert = new Alert(successAlert);
      await alert.save();
    } catch (err) {
      console.error('⚠️ DB Error (Compromise alert not saved):', err.message);
    }
  });

  socket.on('simulate_phishing', async () => {
    console.log("📩 Received simulate_phishing request");
    const scenario = {
      sender: "security-update@enterprise-support.com",
      displaySender: "IT Security Support",
      subject: "Urgent: Action Required on Your Account",
      headers: {
        spf: "PASS",
        dkim: "FAIL",
        dmarc: "FAIL",
        returnPath: "attacker-mta@evil-domain.ru"
      },
      links: [
        { 
          text: "Verify Account Here", 
          hoverUrl: "http://enterprise-support.com/verify", 
          actualUrl: "http://bit.ly/3xJkL9q",
          isMismatch: true,
          isShortener: true
        }
      ],
      attachments: [
        {
          name: "security_patch.exe",
          hash: "a1b2c3d4e5f6g7h8i9j0",
          size: "2.4 MB",
          status: "Malicious",
          threat: "Trojan.Generic"
        }
      ],
      recipients: [
        "j.doe@enterprise.com",
        "a.smith@enterprise.com",
        "b.jones@enterprise.com"
      ]
    };

    const phishingAlert = {
      ...generateAlert(),
      type: "📧 PHISHING ATTEMPT DETECTED",
      severity: "High",
      sourceIP: "185.23.12.99",
      location: "Russia (Moscow)",
      targetIP: "MAIL-GATEWAY-02",
      metadata: scenario
    };

    try {
      io.emit('new_alert', phishingAlert);
      const alert = new Alert(phishingAlert);
      await alert.save();
      console.log("✅ Phishing alert broadcasted and saving to DB...");
    } catch (err) {
      console.error('⚠️ DB Error (Phishing alert not saved):', err.message);
    }
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
app.post('/api/attack/sql-injection', async (req, res) => {
  const alert = new Alert({
    ...generateAlert(),
    type: "💉 SQL INJECTION DETECTED",
    severity: "Critical",
    sourceIP: req.body.ip || "103.24.12.8",
    targetIP: "DB-PROD-01"
  });
  await alert.save();
  io.emit('new_alert', alert);
  res.json({ message: 'SQL Injection Event Logged' });
});

// 2. DDoS Trigger
app.post('/api/attack/ddos', async (req, res) => {
  const alert = new Alert({
    ...generateAlert(),
    type: "🌀 DDOS ATTACK (UDP FLOOD)",
    severity: "High",
    sourceIP: "BOTNET_CLUSTER_A",
    targetIP: "GATEWAY_LB"
  });
  await alert.save();
  io.emit('new_alert', alert);
  res.json({ message: 'DDoS Event Logged' });
});

// 3. Malware Trigger
app.post('/api/attack/malware', async (req, res) => {
  const alert = new Alert({
    ...generateAlert(),
    type: "🦠 MALWARE EXECUTION PREVENTED",
    severity: "Critical",
    sourceIP: "192.168.1.45",
    targetIP: "WS-ANALYST-12"
  });
  await alert.save();
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
