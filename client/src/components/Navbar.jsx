import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
  const { currentUser } = useAuth();
  const { alerts } = useSocket();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <header className="h-16 glass-panel m-4 mb-0 flex items-center justify-between px-6 border-b border-slate-800/50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search threats, IPs, or logs..." 
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm border-r border-slate-800 pr-6">
          <Clock size={16} />
          <span>{time.toLocaleTimeString()}</span>
        </div>

        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            {criticalCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-neon-red text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-pulse">
                {criticalCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{currentUser?.email?.split('@')[0] || 'Analyst'}</p>
            <p className="text-xs text-slate-500">Tier 3 Analyst</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-neon-blue/20 border border-neon-blue/50 flex items-center justify-center text-neon-blue">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
