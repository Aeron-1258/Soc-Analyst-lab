import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [threats, setThreats] = useState([]);
  const [isMitigating, setIsMitigating] = useState(false);
  const [blacklist, setBlacklist] = useState(["192.168.1.100", "45.12.33.1"]); // Initial dummy data

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('initial_alerts', (initialAlerts) => {
      setAlerts(initialAlerts);
    });

    newSocket.on('new_alert', (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50));
      
      // --- AUTONOMOUS RESPONSE LOGIC ---
      if (alert.severity === 'Critical') {
        toast.error(`CRITICAL THREAT: ${alert.type}. Initiating Autonomous Response...`, {
          duration: 3000,
          icon: '🤖'
        });

        // Automatically trigger mitigation after 2 seconds of detection
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
      // ----------------------------------
    });

    newSocket.on('traffic_update', (data) => {
      setTrafficData((prev) => [...prev, data].slice(-20));
    });

    newSocket.on('new_threat', (threat) => {
      setThreats((prev) => [...prev, threat].slice(-10));
    });

    newSocket.on('mitigation_status', (status) => {
      if (status.active) {
        setIsMitigating(true);
        toast.success(`AUTO-PREVENTION: Blocked ${status.type} on ${status.target}`, {
          duration: 6000,
          style: { border: '1px solid #22c55e', background: '#064e3b' }
        });
        setTimeout(() => setIsMitigating(false), 8000);
      }
    });

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, alerts, trafficData, threats, isMitigating, blacklist, setBlacklist }}>
      {children}
    </SocketContext.Provider>
  );
};
