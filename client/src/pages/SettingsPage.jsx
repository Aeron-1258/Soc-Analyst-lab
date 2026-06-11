import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Sliders, Save } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('Appearance');
  const [localName, setLocalName] = useState(settings.displayName);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'Profile', icon: <User size={16} /> },
    { id: 'Notifications', icon: <Bell size={16} /> },
    { id: 'Security', icon: <Shield size={16} /> },
    { id: 'Appearance', icon: <Palette size={16} /> },
    { id: 'Preferences', icon: <Sliders size={16} /> },
  ];

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
    toast.success(`${key} setting updated`, {
       duration: 1500,
       style: { fontSize: '11px', background: '#0b0b0b', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ displayName: localName });
      setIsSaving(false);
      toast.success("Profile changes saved successfully!", {
        style: { background: '#0b0b0b', color: '#fff', border: '1px solid #10b981' }
      });
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight font-sans">
          SETTINGS
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Tabs (macOS preference style) */}
        <div className="w-full md:w-52 space-y-1.5 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider font-mono text-[10px] ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-neon-purple/15 to-neon-blue/5 text-white border-l-2 border-neon-purple shadow-[0_0_15px_rgba(124,58,237,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.id}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {activeTab === 'Appearance' && (
            <div className="glass-panel p-6 md:p-8 space-y-8 border border-white/5 bg-[#0b0b0b]/60 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>
              
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono mb-1">Appearance Settings</h3>
                <p className="text-xs text-slate-500 font-sans">Manage colors, backgrounds, and display details</p>
              </div>
              
              <div className="space-y-6 divide-y divide-white/5">
                {[
                  { id: 'darkMode', label: 'Dark luxury theme', desc: 'Enable black-graphite UI overlay for night analysis operations' },
                  { id: 'neonEffects', label: 'Neon borders', desc: 'Activate purple/blue glowing highlights across system panels' },
                  { id: 'gridBackground', label: 'Network grid matrix', desc: 'Show interactive background mesh and particle animations' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-6' : ''}`}>
                    <div>
                      <p className="text-white text-xs font-bold font-mono uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1 font-sans">{item.desc}</p>
                    </div>
                    
                    {/* iOS style toggle slider */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        settings[item.id] ? 'bg-neon-purple shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'bg-white/10'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 22 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="glass-panel p-6 md:p-8 space-y-8 border border-white/5 bg-[#0b0b0b]/60 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>
              
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono mb-1">Incident Alerts</h3>
                <p className="text-xs text-slate-500 font-sans">Configure dispatch rules for high-priority breaches</p>
              </div>
              
              <div className="space-y-6 divide-y divide-white/5">
                {[
                  { id: 'emailNotifications', label: 'Critical Email Alerts', desc: 'Send high-severity incident reports to your work email' },
                  { id: 'desktopAlerts', label: 'Desktop Notifications', desc: 'Show browser-level alerts even when tab is inactive' },
                  { id: 'soundEffects', label: 'Audio Warnings', desc: 'Play audible siren for critical system breaches' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-6' : ''}`}>
                    <div>
                      <p className="text-white text-xs font-bold font-mono uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1 font-sans">{item.desc}</p>
                    </div>
                    
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        settings[item.id] ? 'bg-neon-purple shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'bg-white/10'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 22 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="glass-panel p-6 md:p-8 space-y-8 border border-white/5 bg-[#0b0b0b]/60 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>
              
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono mb-1">Access Control</h3>
                <p className="text-xs text-slate-500 font-sans">Manage authentication layers and terminal sessions</p>
              </div>
              
              <div className="space-y-6 divide-y divide-white/5">
                {[
                  { id: 'mfaEnabled', label: 'Multi-Factor Auth (MFA)', desc: 'Require security token for analyst authentication' },
                  { id: 'sessionLock', label: 'Auto-Session Lock', desc: 'Lock terminal after 15 minutes of inactivity' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-6' : ''}`}>
                    <div>
                      <p className="text-white text-xs font-bold font-mono uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1 font-sans">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${
                        settings[item.id] ? 'bg-neon-purple shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'bg-white/10'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 22 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-6">
                  <p className="text-[9px] text-slate-500 uppercase font-extrabold mb-4 font-mono tracking-widest">Gateway Access Log</p>
                  <div className="space-y-2.5 font-mono text-[10px] text-slate-400">
                    <div className="flex justify-between p-2.5 bg-[#050505]/40 rounded-xl border border-white/5">
                      <span className="text-slate-500">4/30/2026, 8:45 PM</span>
                      <span className="text-neon-green font-bold">IP: 192.168.1.10 (GRANTED)</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-[#050505]/40 rounded-xl border border-white/5">
                      <span className="text-slate-500">4/29/2026, 11:12 AM</span>
                      <span className="text-neon-red font-bold">IP: 103.24.12.5 (REJECTED)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="glass-panel p-6 md:p-8 space-y-6 border border-white/5 bg-[#0b0b0b]/60 relative">
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent"></div>
               
               <div>
                 <h3 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono mb-1">Analyst Credentials</h3>
                 <p className="text-xs text-slate-500 font-sans">Configure details visible on system audits</p>
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] text-slate-500 uppercase font-extrabold ml-1 font-mono tracking-wider">Display Name</label>
                 <input 
                   type="text" 
                   className="w-full bg-[#050505]/40 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/10 transition-all font-mono"
                   value={localName}
                   onChange={(e) => setLocalName(e.target.value)}
                 />
               </div>
               
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple hover:to-[#5B21B6] text-white font-bold rounded-xl text-xs uppercase tracking-widest font-mono shadow-[0_0_12px_rgba(124,58,237,0.2)] transition-all cursor-pointer disabled:opacity-50"
               >
                 {isSaving ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <Save size={14} />
                 )}
                 SAVE_CHANGES
               </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
