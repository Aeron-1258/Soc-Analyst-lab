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
      className="space-y-6 font-sans text-[#A3A3A3]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#FAFAFA] flex items-center gap-2 tracking-tight font-display">
            <FileText className="text-[#4F46E5]" size={18} /> System Audit Logs
          </h2>
          <p className="text-xs text-[#A3A3A3] mt-0.5">Raw system audit logs, connection handshakes, and diagnostic logs</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-slate-200 rounded-lg transition-all cursor-pointer">
            <Filter size={14} />
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-slate-200 hover:text-white rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="glass-panel overflow-hidden border border-[#2A2A2A] bg-[#171717] relative">
        <div className="bg-[#111111] px-5 py-3 border-b border-[#2A2A2A] flex justify-between items-center">
          <span className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-wider">Operational Audit Stream</span>
          <span className="text-[10px] text-[#16A34A] font-semibold flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></span>
            ACTIVE_STREAM
          </span>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto p-5 space-y-3 scrollbar-hide bg-[#171717]/30">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex gap-4 items-start group hover:bg-[#1E1E1E]/40 p-2 rounded-lg transition-colors text-[#A3A3A3] text-xs">
              <span className="text-[#64748B] shrink-0 font-mono">[{new Date(log.timestamp).toISOString()}]</span>
              <span className={`shrink-0 font-bold uppercase text-[8px] px-2 py-0.5 rounded border ${
                log.severity === 'Critical' ? 'bg-[#DC2626]/5 border-[#DC2626]/20 text-[#DC2626]' : 
                log.severity === 'High' ? 'bg-[#EA580C]/5 border-[#EA580C]/20 text-[#EA580C]' : 'bg-[#4F46E5]/5 border-[#4F46E5]/20 text-[#4F46E5]'
              }`}>
                {log.severity}
              </span>
              <span className="text-slate-300 leading-normal flex-1">
                Event: <span className="text-[#FAFAFA] font-semibold">{log.type}</span> from <span className="text-[#4F46E5] font-semibold font-mono">{log.sourceIP}</span> 
                target <span className="text-[#A3A3A3] font-mono">{log.targetIP}</span>
              </span>
              <span className="text-[9px] text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity font-mono">ID: {log.id.slice(0, 8)}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center py-16 text-[#64748B] italic text-xs">
              No audit logs captured in this session
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogsPage;
