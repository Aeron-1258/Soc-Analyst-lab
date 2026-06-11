import React from 'react';
import { useSocket } from '../context/SocketContext';
import { FileText, Download, Filter } from 'lucide-react';
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
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight font-sans">
            <FileText className="text-neon-purple" size={20} /> SYSTEM LOGS
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-0.5">Raw security events and audit trails</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-slate-300 rounded-xl transition-all cursor-pointer">
            <Filter size={16} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white rounded-xl text-xs font-bold font-mono tracking-wider shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer"
          >
            <Download size={14} /> EXPORT_CSV
          </button>
        </div>
      </div>

      {/* Terminal Glass Container */}
      <div className="glass-panel overflow-hidden border border-white/5 bg-[#0b0b0b]/60 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

        <div className="bg-[#050505]/60 p-4 border-b border-white/5 flex justify-between items-center">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">Live Audit Stream</span>
          <span className="text-[9px] text-neon-green font-bold font-mono flex items-center gap-1.5">
            <span className="w-1 h-1 bg-neon-green rounded-full animate-pulse shadow-[0_0_4px_#10b981]"></span>
            SECURE_LINK_UP
          </span>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto font-mono text-[11px] p-5 space-y-2.5 scrollbar-hide bg-[#050505]/20">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-4 items-start group hover:bg-white/[0.02] p-1.5 rounded-lg transition-colors text-slate-400">
              <span className="text-slate-600 shrink-0 font-medium">[{new Date(log.timestamp).toISOString()}]</span>
              <span className={`shrink-0 font-extrabold uppercase text-[9px] px-1.5 py-0.5 rounded border ${
                log.severity === 'Critical' ? 'bg-neon-red/10 border-neon-red/20 text-neon-red' : 
                log.severity === 'High' ? 'bg-neon-orange/10 border-neon-orange/20 text-neon-orange' : 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple'
              }`}>
                {log.severity}
              </span>
              <span className="text-slate-300 leading-relaxed">
                Event: <span className="text-white font-bold">{log.type}</span> from <span className="text-neon-cyan font-bold">{log.sourceIP}</span> 
                target <span className="text-slate-500 font-semibold">{log.targetIP}</span>
              </span>
              <span className="ml-auto text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px]">ID: {log.id}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-16 text-slate-600 italic text-xs font-mono">
              NO STREAM LOGS RECORDED IN THIS SESSION
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogsPage;
