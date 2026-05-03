import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, Download, Activity, X, ShieldX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import InvestigationModule from '../components/InvestigationModule';

const AlertsPage = () => {
  const { alerts, blacklist, setBlacklist, searchTerm, setSearchTerm } = useSocket();
  const [filter, setFilter] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showFullInvestigation, setShowFullInvestigation] = useState(false);

  const filteredAlerts = alerts
    .filter(alert => filter === 'All' || alert.severity === filter)
    .filter(alert => 
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sourceIP.includes(searchTerm)
    );

  const handleBlock = (ip) => {
    setBlacklist(prev => [...new Set([ip, ...prev])]);
    toast.success(`IP ${ip} blocked from investigation terminal`);
    setSelectedAlert(null);
  };

  const openInvestigation = (alert) => {
    setSelectedAlert(alert);
    if (alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING")) {
      setShowFullInvestigation(true);
    } else {
      setShowFullInvestigation(false);
    }
  };

  const handleExport = () => {
    if (filteredAlerts.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["ID", "Timestamp", "Severity", "Type", "Source IP", "Target IP", "Location"];
    const csvContent = [
      headers.join(","),
      ...filteredAlerts.map(a => [
        a.id,
        new Date(a.timestamp).toLocaleString().replace(/,/g, ""),
        a.severity,
        a.type.replace(/,/g, ""),
        a.sourceIP,
        a.targetIP,
        a.location
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `alerts_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Alerts exported successfully");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 relative"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-neon-red" /> Incident Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review and respond to system security events</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-all"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f 
                ? 'bg-neon-blue text-white shadow-neon-blue' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden border border-slate-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900/30">
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Event Type</th>
                <th className="px-6 py-4 font-semibold">Source IP</th>
                <th className="px-6 py-4 font-semibold">Target</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.tr 
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'Critical' ? 'bg-neon-red/10 text-neon-red border border-neon-red/30' :
                        alert.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' :
                        alert.severity === 'Medium' ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30' :
                        'bg-neon-green/10 text-neon-green border border-neon-green/30'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {alert.type}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      <div className="flex flex-col">
                        <span className={blacklist.includes(alert.sourceIP) ? 'text-neon-red' : 'text-slate-300'}>{alert.sourceIP}</span>
                        {blacklist.includes(alert.sourceIP) && (
                          <span className="text-[9px] text-neon-red font-bold uppercase mt-1 flex items-center gap-1">
                            <ShieldX size={10} /> BANNED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                      {alert.targetIP}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openInvestigation(alert)}
                        className={`text-xs font-bold transition-colors ${
                          alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING") 
                          ? "text-neon-red hover:text-white" 
                          : "text-neon-blue hover:text-white"
                        }`}
                      >
                        {alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING") 
                          ? "Run Playbook" 
                          : "Investigate"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <>
            {showFullInvestigation ? (
              <InvestigationModule 
                alert={selectedAlert} 
                onClose={() => {
                  setSelectedAlert(null);
                  setShowFullInvestigation(false);
                }} 
              />
            ) : (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedAlert(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-950 border-l border-slate-800 z-50 p-8 overflow-y-auto shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity className="text-neon-blue" /> Forensic Investigation
                    </h3>
                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-400"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block mb-1">Event Summary</span>
                      <h4 className="text-lg font-bold text-white mb-2">{selectedAlert.type}</h4>
                      <div className="flex gap-4 text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-500">Source</span>
                          <span className="text-neon-blue font-mono">{selectedAlert.sourceIP}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-500">Target</span>
                          <span className="text-white font-mono">{selectedAlert.targetIP}</span>
                        </div>
                        <div className="flex flex-col ml-auto text-right">
                          <span className="text-slate-500">Severity</span>
                          <span className={selectedAlert.severity === 'Critical' ? 'text-neon-red' : 'text-neon-yellow'}>{selectedAlert.severity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase block ml-1">Deep Packet Inspection (DPI)</span>
                      <div className="bg-black p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-neon-green overflow-hidden relative">
                        <div className="absolute inset-0 bg-neon-green/5 animate-pulse pointer-events-none" />
                        <p className="mb-2 opacity-50">// ANALYZING PAYLOAD...</p>
                        <p>GET /api/v1/users?id=1' OR '1'='1' -- HTTP/1.1</p>
                        <p>Host: secure-api.internal</p>
                        <p>User-Agent: Mozilla/5.0 (Kali Linux) ...</p>
                        <p className="mt-2 text-white">REASON: Malicious SQL Pattern detected in QueryString</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block mb-2">Attacker Intel</span>
                        <div className="space-y-1 text-xs">
                          <p className="text-white">Origin: <span className="text-slate-400">Moscow, RU</span></p>
                          <p className="text-white">ISP: <span className="text-slate-400">Rostelecom</span></p>
                          <p className="text-white">Reputation: <span className="text-neon-red">2/10 (MALICIOUS)</span></p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block mb-2">AI Recommendation</span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Signature matches CVE-2023-4567. Highly recommend immediate IP Blacklisting and WAF rule update.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button 
                        onClick={() => handleBlock(selectedAlert.sourceIP)}
                        className="flex-1 bg-neon-red/10 border border-neon-red/50 text-neon-red hover:bg-neon-red/20 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldAlert size={18} /> Block & Terminate
                      </button>
                      <button className="flex-1 bg-slate-800 text-white hover:bg-slate-700 py-3 rounded-xl font-bold transition-all">
                        Ignore Alert
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlertsPage;
