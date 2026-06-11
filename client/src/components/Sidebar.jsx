import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Map as MapIcon, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck,
  X,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
    { icon: <ShieldAlert size={18} />, label: 'Alerts', path: '/alerts' },
    { icon: <MapIcon size={18} />, label: 'Threat Map', path: '/threat-map' },
    { icon: <FileText size={18} />, label: 'Logs', path: '/logs' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel m-4 mr-0 flex flex-col border border-white/5 transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:m-4 lg:mr-0
        ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}
        bg-[#0b0b0b]/60 shadow-[0_12px_40px_rgba(0,0,0,0.8)]
      `}>
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"></div>

        {/* Sidebar Header/Branding */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-white/[0.02] rounded-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group overflow-hidden">
              <div className="absolute inset-0 bg-neon-purple opacity-20 blur-sm group-hover:scale-110 transition-transform"></div>
              <ShieldCheck className="text-neon-purple relative z-10" size={20} />
            </div>
            <div>
              <h1 className="text-md font-extrabold tracking-tight text-white flex items-center gap-0.5">
                INTELLI<span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent font-black">SOC</span>
              </h1>
              <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest block -mt-0.5">
                CORE_ANALYST_V4
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-neon-purple/15 to-neon-blue/5 text-white border-l-2 border-neon-purple shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'}
              `}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-semibold text-xs uppercase tracking-wider relative z-10 font-mono">
                {item.label}
              </span>
              
              {/* Ripple hover animation background */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-transparent translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500 ease-out z-0"></div>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer - Logs & Profile */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-neon-red hover:bg-neon-red/10 border-l-2 border-transparent hover:border-neon-red/40 transition-all duration-300 cursor-pointer group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="font-semibold text-xs uppercase tracking-wider font-mono">
              Disconnect Terminal
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
