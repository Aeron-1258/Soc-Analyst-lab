import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Map as MapIcon, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <ShieldAlert size={20} />, label: 'Alerts', path: '/alerts' },
    { icon: <MapIcon size={20} />, label: 'Threat Map', path: '/threat-map' },
    { icon: <FileText size={20} />, label: 'Logs', path: '/logs' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 glass-panel m-4 mr-0 flex flex-col border-r border-slate-800/50">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-neon-blue/20 rounded-lg border border-neon-blue/50">
          <ShieldCheck className="text-neon-blue" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          SOC<span className="text-neon-blue">AI</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30 shadow-neon-blue' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-neon-red hover:bg-neon-red/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
