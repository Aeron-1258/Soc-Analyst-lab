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
    toast.success(`IP ${ip} locked down successfully`, {
      icon: '🛡️',
      style: { background: '#171717', color: '#FAFAFA', border: '1px solid #2A2A2A' }
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
      className="space-y-6 relative font-sans text-[#A3A3A3]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#FAFAFA] flex items-center gap-2 tracking-tight font-display">
            <ShieldAlert className="text-[#DC2626]" size={18} /> Incident Management
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-0.5">Review, filter, export, and respond to active system security threats</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-slate-200 hover:text-white rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === f 
                ? 'bg-[#1E1E1E] text-[#FAFAFA] border border-[#2A2A2A] shadow-sm' 
                : 'bg-transparent text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="glass-panel overflow-hidden border border-[#2A2A2A] bg-[#171717] relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#A3A3A3] text-[10px] uppercase tracking-wider bg-[#111111]">
                <th className="px-6 py-3.5 font-bold">Timestamp</th>
                <th className="px-6 py-3.5 font-bold">Severity</th>
                <th className="px-6 py-3.5 font-bold">Event Type</th>
                <th className="px-6 py-3.5 font-bold">Source IP</th>
                <th className="px-6 py-3.5 font-bold">Target Node</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.tr 
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-[#1E1E1E]/30 transition-colors group text-[#FAFAFA]"
                  >
                    <td className="px-6 py-3 text-xs font-mono text-[#A3A3A3]">
                      {new Date(alert.timestamp).toLocaleString([], { hour12: false })}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                        alert.severity === 'Critical' ? 'bg-[#DC2626]/5 text-[#DC2626] border-[#DC2626]/20' :
                        alert.severity === 'High' ? 'bg-[#EA580C]/5 text-[#EA580C] border-[#EA580C]/20' :
                        alert.severity === 'Medium' ? 'bg-[#F59E0B]/5 text-[#F59E0B] border-[#F59E0B]/20' :
                        'bg-[#16A34A]/5 text-[#16A34A] border-[#16A34A]/20'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs font-medium text-[#FAFAFA]">
                      {alert.type}
                    </td>
                    <td className="px-6 py-3 text-xs font-mono">
                      <div className="flex flex-col">
                        <span className={blacklist.includes(alert.sourceIP) ? 'text-[#DC2626] font-semibold' : 'text-[#FAFAFA]'}>{alert.sourceIP}</span>
                        {blacklist.includes(alert.sourceIP) && (
                          <span className="text-[7px] text-[#DC2626] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1 font-mono">
                            <ShieldX size={8} /> Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-[#A3A3A3] font-mono">
                      {alert.targetIP}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => openInvestigation(alert)}
                        className={`text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                          alert.type === "🚨 SUSPICIOUS SUCCESSFUL LOGIN" || alert.type?.includes("PHISHING") 
                          ? "text-[#DC2626] hover:text-[#B91C1C]" 
                          : "text-[#4F46E5] hover:text-[#3730A3]"
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
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-[#A3A3A3] italic text-xs">
              No security incidents match the filter criteria
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
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                  className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#171717] border-l border-[#2A2A2A] z-50 p-8 overflow-y-auto shadow-2xl flex flex-col justify-between font-sans"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2A2A]">
                      <h3 className="text-xs font-bold text-[#FAFAFA] flex items-center gap-2 uppercase tracking-wider">
                        <Activity className="text-[#4F46E5]" size={14} /> Forensic Console
                      </h3>
                      <button 
                        onClick={() => setSelectedAlert(null)}
                        className="p-1 hover:bg-[#2A2A2A] rounded-md text-[#A3A3A3] cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="p-5 bg-[#111111] rounded-xl border border-[#2A2A2A] relative">
                        <span className="text-[9px] text-[#A3A3A3] font-semibold uppercase tracking-wider block mb-2 font-mono">Event Details</span>
                        <h4 className="text-sm font-semibold text-[#FAFAFA] mb-3">{selectedAlert.type}</h4>
                        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-[#A3A3A3] uppercase">Source IP</span>
                            <span className="text-[#4F46E5] font-semibold">{selectedAlert.sourceIP}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-[#A3A3A3] uppercase">Target Node</span>
                            <span className="text-[#FAFAFA]">{selectedAlert.targetIP}</span>
                          </div>
                          <div className="flex flex-col gap-0.5 ml-auto text-right">
                            <span className="text-[9px] text-[#A3A3A3] uppercase">Severity</span>
                            <span className={selectedAlert.severity === 'Critical' ? 'text-[#DC2626] font-semibold' : 'text-[#4F46E5] font-semibold'}>{selectedAlert.severity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-[#A3A3A3] uppercase tracking-wider block ml-0.5 font-mono">Payload Packet Log</span>
                        <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#2A2A2A] font-mono text-[11px] text-[#16A34A] overflow-hidden relative">
                          <p className="mb-1 opacity-50">// DEEP PACKET SEC_SCAN COMPLETE</p>
                          <p className="text-[#FAFAFA]">GET /api/v1/users?id=1' OR '1'='1' -- HTTP/1.1</p>
                          <p className="text-[#A3A3A3]">Host: internal-auth-api.prod</p>
                          <p className="text-[#A3A3A3]">User-Agent: SecurityProbeClient/0.92</p>
                          <p className="mt-3 text-[#FAFAFA] font-semibold uppercase">// EVAL: SQL Injection signature match confirmed.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#111111] rounded-xl border border-[#2A2A2A]">
                          <span className="text-[9px] text-[#A3A3A3] uppercase tracking-wider block mb-2 font-mono">Intelligence Geo</span>
                          <div className="space-y-1 text-xs">
                            <p className="text-[#A3A3A3]">Origin: <span className="text-[#FAFAFA] font-medium">Moscow, RU</span></p>
                            <p className="text-[#A3A3A3]">ISP: <span className="text-[#FAFAFA] font-medium">Local Router Gateway</span></p>
                            <p className="text-[#A3A3A3]">Reputation: <span className="text-[#DC2626] font-semibold">MALICIOUS</span></p>
                          </div>
                        </div>
                        <div className="p-4 bg-[#111111] rounded-xl border border-[#2A2A2A]">
                          <span className="text-[9px] text-[#A3A3A3] uppercase tracking-wider block mb-2 font-mono">Playbook Recommendation</span>
                          <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
                            Signature matches exploit vector CVE-2023-4567. Force immediate IP lockdown and invoke active routing blocks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-[#2A2A2A] flex gap-4">
                    <button 
                      onClick={() => handleBlock(selectedAlert.sourceIP)}
                      className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white py-3 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <ShieldX size={14} /> Block Attacker
                    </button>
                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="flex-1 bg-[#1E1E1E] border border-[#2A2A2A] text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#2A2A2A] py-3 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-all cursor-pointer"
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
