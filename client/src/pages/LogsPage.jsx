import React from 'react';
import { useSocket } from '../context/SocketContext';
import { FileText, Search, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const LogsPage = () => {
  const { alerts, searchTerm } = useSocket();

  const filteredLogs = alerts.filter(log => 
    log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.sourceIP.includes(searchTerm) ||
    log.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    if (filteredLogs.length === 0) {
      toast.error("No logs to export");
      return;
    }
    const headers = ["Timestamp", "Severity", "Event", "Source", "Target", "Log ID"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.severity,
        log.type.replace(/,/g, ""),
        log.sourceIP,
        log.targetIP,
        log.id
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `logs_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Logs exported successfully");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-neon-blue" /> System Logs
          </h2>
          <p className="text-slate-400 text-sm mt-1">Raw security events and audit trails</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all">
            <Filter size={18} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-white rounded-lg text-sm font-bold shadow-neon-blue transition-all"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-slate-800/50">
        <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Audit Stream</span>
          <span className="text-[10px] text-neon-green animate-pulse">● SECURE CONNECTION ACTIVE</span>
        </div>
        <div className="max-h-[600px] overflow-y-auto font-mono text-[11px] p-4 space-y-1.5 scrollbar-hide">
          {filteredLogs.map((log, i) => (
            <div key={log.id} className="flex gap-4 group hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-slate-600 shrink-0">[{new Date(log.timestamp).toISOString()}]</span>
              <span className={`shrink-0 font-bold ${
                log.severity === 'Critical' ? 'text-neon-red' : 
                log.severity === 'High' ? 'text-orange-500' : 'text-neon-blue'
              }`}>
                {log.severity.toUpperCase()}
              </span>
              <span className="text-slate-300">
                Event: <span className="text-white">{log.type}</span> from <span className="text-neon-cyan">{log.sourceIP}</span> 
                target <span className="text-slate-400">{log.targetIP}</span>
              </span>
              <span className="ml-auto text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">ID: {log.id}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-10 text-slate-600 italic">No logs detected in the current session.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogsPage;
