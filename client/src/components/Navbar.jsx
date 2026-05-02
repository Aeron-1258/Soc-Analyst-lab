import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Clock, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  const { alerts } = useSocket();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalCount = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <header className="h-16 glass-panel m-4 mb-0 flex items-center justify-between px-4 md:px-6 border-b border-slate-800/50">
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800/40 rounded-lg border border-slate-700/50"
        >
          <Menu size={20} />
        </button>
        
        <div className="relative flex-1 max-w-xs md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-1.5 md:py-2 pl-9 md:pl-10 pr-4 text-xs md:text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-xs md:text-sm border-r border-slate-800 pr-4 md:pr-6">
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

        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4">
          <div className="text-right hidden xs:block">
            <p className="text-xs md:text-sm font-medium text-white">{currentUser?.email?.split('@')[0] || 'Analyst'}</p>
            <p className="text-[10px] md:text-xs text-slate-500">Tier 3</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neon-blue/20 border border-neon-blue/50 flex items-center justify-center text-neon-blue">
            <User size={18} md:size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
