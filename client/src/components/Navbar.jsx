import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Clock, Menu, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const { alerts, searchTerm, setSearchTerm } = useSocket();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <header className="h-16 glass-panel m-4 mb-0 flex items-center justify-between px-4 md:px-6 border border-white/5 bg-[#0b0b0b]/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative">
      {/* Top indicator line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>

      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/10 transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>
        
        {/* Search Bar Container */}
        <div className="relative flex-1 max-w-xs md:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-neon-purple transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search network vectors, IPs, or events..." 
            className="w-full bg-[#050505]/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/10 transition-all font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Monospace Clock */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-xs md:text-sm border-r border-white/5 pr-4 md:pr-6">
          <Clock size={14} className="text-neon-purple animate-pulse" />
          <span className="font-semibold text-slate-300 tracking-wider">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>

        {/* Alerts Notification Button */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-xl transition-all relative cursor-pointer group">
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            {criticalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neon-red text-[8px] flex items-center justify-center rounded-full text-white font-extrabold shadow-[0_0_8px_#ef4444] animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>
        </div>

        {/* Analyst Tier/Profile Area */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/5">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-bold text-white tracking-wide font-mono">
              {currentUser?.email?.split('@')[0]?.toUpperCase() || 'ANALYST'}
            </p>
            <p className="text-[9px] text-neon-purple font-semibold font-mono tracking-widest uppercase">
              Tier 3 Admin
            </p>
          </div>
          
          <div className="relative w-9 h-9 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-neon-purple shadow-[0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden group">
            {/* Spinning/rotating border glow on profile */}
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple/20 to-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <User size={16} className="relative z-10 text-slate-200 group-hover:text-neon-purple transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
