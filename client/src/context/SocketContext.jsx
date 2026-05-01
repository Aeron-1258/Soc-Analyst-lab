import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

// Simulation Constants (Ported from Server)
const ATTACK_TYPES = ["Brute Force", "SQL Injection", "DDoS", "Malware", "Phishing", "Unauthorized Access"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const COUNTRIES = ["USA", "China", "Russia", "Germany", "Brazil", "UK", "India", "France"];

const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateAlert = (override = {}) => {
  const severity = override.severity || SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  return {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    type: override.type || ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
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

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [threats, setThreats] = useState([]);
  const [isMitigating, setIsMitigating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [blacklist, setBlacklist] = useState(["192.168.1.100", "45.12.33.1"]);

  // --- LOCAL SIMULATION ENGINE ---
  const triggerAlert = useCallback((alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 50));
    
    if (alert.severity === 'Critical') {
      toast.error(`CRITICAL THREAT: ${alert.type}. Initiating Autonomous Response...`, {
        duration: 3000,
        icon: '🤖'
      });

      setTimeout(() => {
        setIsMitigating(true);
        setBlacklist((prev) => [...new Set([alert.sourceIP, ...prev])].slice(0, 10));
        toast.success(`SYSTEM HEALED: IP ${alert.sourceIP} has been Blacklisted`, {
          duration: 5000,
          icon: '🛡️'
        });
        setTimeout(() => setIsMitigating(false), 8000);
      }, 2000);
    }
  }, []);

  const triggerThreat = useCallback((threat) => {
    setThreats((prev) => [...prev, threat].slice(-10));
  }, []);

  const triggerTraffic = useCallback((data) => {
    setTrafficData((prev) => [...prev, data].slice(-20));
  }, []);

  // Simulation Logic
  useEffect(() => {
    if (!isConnected) {
      console.log("Running in Standalone Simulation Mode");
      
      const alertInterval = setInterval(() => {
        if (!isMitigating) triggerAlert(generateAlert());
      }, 5000);

      const trafficInterval = setInterval(() => {
        triggerTraffic(generateTraffic());
      }, 2000);

      const threatInterval = setInterval(() => {
        if (!isMitigating) triggerThreat(generateThreatMapPoint());
      }, 3000);

      return () => {
        clearInterval(alertInterval);
        clearInterval(trafficInterval);
        clearInterval(threatInterval);
      };
    }
  }, [isConnected, isMitigating, triggerAlert, triggerThreat, triggerTraffic]);

  // --- SOCKET CONNECTION ---
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      reconnectionAttempts: 3,
      timeout: 5000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log("Connected to live SOC Server");
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log("Disconnected from server, switching to Standalone Mode");
    });

    newSocket.on('initial_alerts', (initialAlerts) => setAlerts(initialAlerts));
    newSocket.on('new_alert', triggerAlert);
    newSocket.on('traffic_update', triggerTraffic);
    newSocket.on('new_threat', triggerThreat);

    return () => newSocket.close();
  }, [triggerAlert, triggerTraffic, triggerThreat]);

  // Manual Trigger Helpers
  const simulateAttack = (type) => {
    const alert = generateAlert({ type, severity: 'Critical' });
    if (socket && isConnected) {
      socket.emit('simulate_breach', { type });
    } else {
      triggerAlert(alert);
      triggerThreat(generateThreatMapPoint());
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      alerts, 
      trafficData, 
      threats, 
      isMitigating, 
      blacklist, 
      setBlacklist,
      isConnected,
      simulateAttack 
    }}>
      {children}
    </SocketContext.Provider>
  );
};
