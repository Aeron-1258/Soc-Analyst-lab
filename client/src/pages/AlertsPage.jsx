import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Download, Activity, X, ShieldX, KeyRound, UserX, Globe, Trash2, Zap } from 'lucide-react';
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
    toast.success(`IP ${ip} blocked from investigation terminal`, {
      icon: '🛡️',
      style: { background: '#0b0b0b', color: '#fff', border: '1px solid #ef4444' }
    });
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
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight font-sans">
            <ShieldAlert className="text-neon-red" size={20} /> INCIDENT MANAGEMENT
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Review and respond to system security events</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer shadow-md"
          >
            <Download size={14} /> EXPORT_DATA
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4.5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono transition-all cursor-pointer ${
              filter === f 
                ? 'bg-neon-purple/20 text-white border border-neon-purple/40 shadow-[0_0_12px_rgba(124,58,237,0.15)]' 
                : 'bg-[#0b0b0b] text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="glass-panel overflow-hidden border border-white/5 bg-[#0b0b0b]/60 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-[9px] uppercase tracking-widest font-mono bg-[#050505]/40">
                <th className="px-6 py-4 font-extrabold">Timestamp</th>
                <th className="px-6 py-4 font-extrabold">Severity</th>
                <th className="px-6 py-4 font-extrabold">Event Type</th>
                <th className="px-6 py-4 font-extrabold">Source IP</th>
                <th className="px-6 py-4 font-extrabold">Target Node</th>
                <th className="px-6 py-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.tr 
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.01] transition-colors group text-slate-300"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {new Date(alert.timestamp).toLocaleString([], { hour12: false })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase border ${
                        alert.severity === 'Critical' ? 'bg-neon-red/10 text-neon-red border-neon-red/20' :
                        alert.severity === 'High' ? 'bg-neon-orange/10 text-neon-orange border-neon-orange/20' :
                        alert.severity === 'Medium' ? 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20' :
                        'bg-neon-green/10 text-neon-green border-neon-green/20'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-white">
                      {alert.type}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono">
                      <div className="flex flex-col">
                        <span className={blacklist.includes(alert.sourceIP) ? 'text-neon-red font-bold' : 'text-slate-300'}>{alert.sourceIP}</span>
                        {blacklist.includes(alert.sourceIP) && (
                          <span className="text-[7px] text-neon-red font-bold uppercase tracking-widest mt-1 flex items-center gap-1 font-mono">
                            <ShieldX size={8} /> BLOCKED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {alert.targetIP}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openInvestigation(alert)}
                        className={`text-[10px] font-extrabold uppercase tracking-wider font-mono transition-colors cursor-pointer ${
                          alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING") 
                          ? "text-neon-red hover:underline" 
                          : "text-neon-purple hover:underline"
                        }`}
                      >
                        {alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING") 
                          ? "RUN PLAYBOOK" 
                          : "INVESTIGATE"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-slate-600 italic text-xs font-mono">
              NO SECURITY INCIDENTS FOUND
            </div>
          )}
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
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#050505] border-l border-white/5 z-50 p-8 overflow-y-auto shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-widest font-mono">
                        <Activity className="text-neon-purple" size={16} /> Forensic Console
                      </h3>
                      <button 
                        onClick={() => setSelectedAlert(null)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 bg-[#0b0b0b] rounded-xl border border-white/5 relative">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>
                        <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest block mb-2">Event Details</span>
                        <h4 className="text-md font-bold text-white mb-3">{selectedAlert.type}</h4>
                        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-500 uppercase">Source</span>
                            <span className="text-neon-purple font-bold">{selectedAlert.sourceIP}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-slate-500 uppercase">Target Node</span>
                            <span className="text-white">{selectedAlert.targetIP}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 ml-auto text-right">
                            <span className="text-[9px] text-slate-500 uppercase">Severity</span>
                            <span className={selectedAlert.severity === 'Critical' ? 'text-neon-red font-bold' : 'text-neon-purple font-bold'}>{selectedAlert.severity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest block ml-1 font-mono">Payload Stream</span>
                        <div className="bg-black p-4 rounded-xl border border-white/5 font-mono text-[10px] text-neon-green overflow-hidden relative">
                          <div className="absolute inset-0 bg-neon-green/5 animate-pulse pointer-events-none" />
                          <p className="mb-2 opacity-45">// DEEP PACKET INSPECTION IN PROCESS...</p>
                          <p>GET /api/v1/users?id=1' OR '1'='1' -- HTTP/1.1</p>
                          <p>Host: secure-api.internal</p>
                          <p>User-Agent: Mozilla/5.0 (Kali Linux) ...</p>
                          <p className="mt-3 text-white font-bold uppercase">// ANALYSIS: SQL Injection query detected in parameters.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#0b0b0b] rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-2 font-mono">Threat Intel</span>
                          <div className="space-y-1 text-xs font-mono">
                            <p className="text-slate-300">Origin: <span className="text-white">Moscow, RU</span></p>
                            <p className="text-slate-300">ISP: <span className="text-white">Rostelecom</span></p>
                            <p className="text-slate-300">Score: <span className="text-neon-red font-bold">CRITICAL</span></p>
                          </div>
                        </div>
                        <div className="p-4 bg-[#0b0b0b] rounded-xl border border-white/5">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest block mb-2 font-mono">AI Recommendation</span>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                            Signature matches CVE-2023-4567. Force immediate IP lockdown and block incoming traffic vectors.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex gap-4">
                    <button 
                      onClick={() => handleBlock(selectedAlert.sourceIP)}
                      className="flex-1 bg-neon-red/10 border border-neon-red/30 text-neon-red hover:bg-neon-red/20 py-3.5 rounded-xl font-bold uppercase tracking-widest font-mono text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldX size={14} /> BLOCK_ATTACKER
                    </button>
                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white py-3.5 rounded-xl font-bold uppercase tracking-widest font-mono text-[10px] transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
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
