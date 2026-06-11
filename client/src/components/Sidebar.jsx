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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', path: '/' },
    { icon: <ShieldAlert size={16} />, label: 'Alerts', path: '/alerts' },
    { icon: <MapIcon size={16} />, label: 'Threat Map', path: '/threat-map' },
    { icon: <FileText size={16} />, label: 'Logs', path: '/logs' },
    { icon: <Settings size={16} />, label: 'Settings', path: '/settings' },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 flex flex-col border-r border-[#2A2A2A] bg-[#111111] transition-all duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header/Branding */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-[#2A2A2A] shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#4F46E5]" size={18} />
            <span className="text-sm font-bold tracking-tight text-[#FAFAFA] font-sans">
              INTELLI<span className="text-[#4F46E5] font-black">SOC</span>
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-text-muted hover:text-[#FAFAFA] hover:bg-[#1E1E1E] rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4.5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer font-sans text-[13px] font-medium
                ${isActive 
                  ? 'bg-[#1E1E1E] text-[#FAFAFA] border-l-2 border-[#4F46E5]' 
                  : 'text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717] border-l-2 border-transparent'}
              `}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer - Profile/Disconnect */}
        <div className="p-3 border-t border-[#2A2A2A]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#A3A3A3] hover:text-[#DC2626] hover:bg-[#DC2626]/5 border-l-2 border-transparent transition-all duration-150 cursor-pointer text-[13px] font-medium font-sans"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
