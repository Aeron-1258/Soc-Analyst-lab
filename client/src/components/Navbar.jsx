import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Clock, Menu } from 'lucide-react';
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
    <header className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-6 bg-[#111111] relative z-20 shrink-0 font-sans">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 text-[#A3A3A3] hover:text-[#FAFAFA] bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Menu size={16} />
        </button>
        
        {/* Search Bar Container */}
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]/60 group-focus-within:text-[#4F46E5] transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search security vectors, IPs, or logs..." 
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#FAFAFA] placeholder-[#A3A3A3]/40 focus:outline-none focus:border-[#4F46E5] transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Monospace Clock */}
        <div className="hidden sm:flex items-center gap-2 text-[#A3A3A3] font-sans text-xs border-r border-[#2A2A2A] pr-4">
          <Clock size={14} className="text-[#A3A3A3]/80" />
          <span className="font-medium tracking-tight">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </span>
        </div>

        {/* Alerts Notification Button */}
        <div className="relative">
          <button className="p-1.5 text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg transition-all relative cursor-pointer group">
            <Bell size={15} />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full border border-[#111111]" />
            )}
          </button>
        </div>

        {/* Analyst Profile Area */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#2A2A2A]">
          <div className="text-right hidden xs:block">
            <p className="text-xs font-semibold text-[#FAFAFA] leading-tight">
              {currentUser?.email?.split('@')[0]?.toUpperCase() || 'ANALYST'}
            </p>
            <p className="text-[10px] text-[#A3A3A3] font-medium leading-none mt-0.5">
              Tier 3 Operator
            </p>
          </div>
          
          <div className="w-8 h-8 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#FAFAFA] overflow-hidden group">
            <User size={14} className="text-[#A3A3A3] group-hover:text-[#FAFAFA] transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
