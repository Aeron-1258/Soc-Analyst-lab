import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Sliders, Save, Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('Appearance');
  const [localName, setLocalName] = useState(settings.displayName);
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'Profile', icon: <User size={18} /> },
    { id: 'Notifications', icon: <Bell size={18} /> },
    { id: 'Security', icon: <Shield size={18} /> },
    { id: 'Appearance', icon: <Palette size={18} /> },
    { id: 'Preferences', icon: <Sliders size={18} /> },
  ];

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
    toast.success(`${key} setting updated`, {
       duration: 1500,
       style: { fontSize: '12px' }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ displayName: localName });
      setIsSaving(false);
      toast.success("Profile changes saved successfully!");
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-48 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.id}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'Appearance' && (
            <div className="glass-panel p-8 space-y-8 border border-slate-800/50">
              <h3 className="text-lg font-bold text-white mb-6">Appearance</h3>
              
              <div className="space-y-6">
                {[
                  { id: 'darkMode', label: 'Dark Mode', desc: 'Enable high-contrast dark theme for night shifts' },
                  { id: 'neonEffects', label: 'Neon Effects', desc: 'Enable glowing borders and neon accents' },
                  { id: 'gridBackground', label: 'Grid Background', desc: 'Show the animated cyber grid background' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        settings[item.id] ? 'bg-neon-blue' : 'bg-slate-800'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="glass-panel p-8 space-y-8 border border-slate-800/50">
              <h3 className="text-lg font-bold text-white mb-6">System Notifications</h3>
              <div className="space-y-6">
                {[
                  { id: 'emailNotifications', label: 'Critical Email Alerts', desc: 'Send high-severity incident reports to your work email' },
                  { id: 'desktopAlerts', label: 'Desktop Notifications', desc: 'Show browser-level alerts even when tab is inactive' },
                  { id: 'soundEffects', label: 'Audio Warnings', desc: 'Play audible siren for critical system breaches' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        settings[item.id] ? 'bg-neon-blue' : 'bg-slate-800'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="glass-panel p-8 space-y-8 border border-slate-800/50">
              <h3 className="text-lg font-bold text-white mb-6">Access Control</h3>
              <div className="space-y-6">
                {[
                  { id: 'mfaEnabled', label: 'Multi-Factor Auth (MFA)', desc: 'Require security token for analyst authentication' },
                  { id: 'sessionLock', label: 'Auto-Session Lock', desc: 'Lock terminal after 15 minutes of inactivity' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        settings[item.id] ? 'bg-neon-blue' : 'bg-slate-800'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-800/50">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-4">Recent Access Logs</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>4/30/2026, 8:45 PM</span>
                      <span>IP: 192.168.1.10 (SUCCESS)</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>4/29/2026, 11:12 AM</span>
                      <span>IP: 103.24.12.5 (DENIED)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="glass-panel p-8 space-y-6 border border-slate-800/50">
               <h3 className="text-lg font-bold text-white">Analyst Credentials</h3>
               <div className="space-y-2">
                 <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Display Name</label>
                 <input 
                   type="text" 
                   className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-blue transition-all"
                   value={localName}
                   onChange={(e) => setLocalName(e.target.value)}
                 />
               </div>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 px-6 py-3 bg-neon-blue hover:bg-neon-blue/90 text-white font-bold rounded-xl transition-all disabled:opacity-50"
               >
                 {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                 Save Changes
               </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
