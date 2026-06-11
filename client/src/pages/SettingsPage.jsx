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
    { id: 'Profile', icon: <User size={14} /> },
    { id: 'Notifications', icon: <Bell size={14} /> },
    { id: 'Security', icon: <Shield size={14} /> },
    { id: 'Appearance', icon: <Palette size={14} /> },
    { id: 'Preferences', icon: <Sliders size={14} /> },
  ];

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
    toast.success(`Setting changed successfully`, {
       duration: 1500,
       style: { fontSize: '12px', background: '#171717', color: '#FAFAFA', border: '1px solid #2A2A2A' }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({ displayName: localName });
      setIsSaving(false);
      toast.success("Profile saved successfully!", {
        style: { background: '#171717', color: '#FAFAFA', border: '1px solid #16A34A' }
      });
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 font-sans text-[#A3A3A3]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#FAFAFA] tracking-tight font-display">
          System Settings
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-48 space-y-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all cursor-pointer text-xs font-semibold ${
                activeTab === tab.id 
                  ? 'bg-[#1E1E1E] text-[#FAFAFA] border border-[#2A2A2A] shadow-sm' 
                  : 'text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-[#171717]'
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
            <div className="glass-panel p-6 md:p-8 space-y-6 border border-[#2A2A2A] bg-[#171717] relative">
              <div>
                <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">Appearance Settings</h3>
                <p className="text-xs text-[#A3A3A3]">Manage application themes, backgrounds, and display parameters</p>
              </div>
              
              <div className="space-y-5 divide-y divide-[#2A2A2A]">
                {[
                  { id: 'darkMode', label: 'Dark slate console mode', desc: 'Maintain clean contrast ratios for low-light environments' },
                  { id: 'neonEffects', label: 'Dashboard color indicators', desc: 'Render security telemetry categories in functional colors' },
                  { id: 'gridBackground', label: 'Telemetry backgrounds', desc: 'Enable subtle background grids on visual panels' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-5' : ''}`}>
                    <div>
                      <p className="text-[#FAFAFA] text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-[#A3A3A3] mt-1">{item.desc}</p>
                    </div>
                    
                    {/* Toggle slider */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-10 h-5.5 rounded-full relative transition-all duration-200 cursor-pointer ${
                        settings[item.id] ? 'bg-[#4F46E5]' : 'bg-[#2A2A2A]'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 20 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="glass-panel p-6 md:p-8 space-y-6 border border-[#2A2A2A] bg-[#171717] relative">
              <div>
                <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">Incident Dispatching</h3>
                <p className="text-xs text-[#A3A3A3]">Configure routing triggers for high-severity alerts</p>
              </div>
              
              <div className="space-y-5 divide-y divide-[#2A2A2A]">
                {[
                  { id: 'emailNotifications', label: 'Email dispatcher triggers', desc: 'Send summaries for high-priority security breaches' },
                  { id: 'desktopAlerts', label: 'Desktop banner flags', desc: 'Trigger banner warnings for local alerts' },
                  { id: 'soundEffects', label: 'Operational sirens', desc: 'Play brief audio indicators for incoming events' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-5' : ''}`}>
                    <div>
                      <p className="text-[#FAFAFA] text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-[#A3A3A3] mt-1">{item.desc}</p>
                    </div>
                    
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-10 h-5.5 rounded-full relative transition-all duration-200 cursor-pointer ${
                        settings[item.id] ? 'bg-[#4F46E5]' : 'bg-[#2A2A2A]'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 20 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="glass-panel p-6 md:p-8 space-y-6 border border-[#2A2A2A] bg-[#171717] relative">
              <div>
                <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">Identity & Authentication</h3>
                <p className="text-xs text-[#A3A3A3]">Manage authorization constraints and active analyst keys</p>
              </div>
              
              <div className="space-y-5 divide-y divide-[#2A2A2A]">
                {[
                  { id: 'mfaEnabled', label: 'Multi-Factor Validation (MFA)', desc: 'Enforce MFA authentication validation on credentials connection' },
                  { id: 'sessionLock', label: 'Terminal inactivity locking', desc: 'Secure operational views after 15 minutes of inactivity' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between group ${idx > 0 ? 'pt-5' : ''}`}>
                    <div>
                      <p className="text-[#FAFAFA] text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-[#A3A3A3] mt-1">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`w-10 h-5.5 rounded-full relative transition-all duration-200 cursor-pointer ${
                        settings[item.id] ? 'bg-[#4F46E5]' : 'bg-[#2A2A2A]'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: settings[item.id] ? 20 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-5">
                  <p className="text-[10px] text-[#A3A3A3] uppercase font-bold mb-3 font-mono tracking-wider">Access Authorization Log</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 bg-[#111111] rounded-lg border border-[#2A2A2A]">
                      <span className="text-[#A3A3A3] font-mono">2026-06-11 08:45:12</span>
                      <span className="text-[#16A34A] font-semibold">IP: 192.168.1.10 (VERIFIED)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#111111] rounded-lg border border-[#2A2A2A]">
                      <span className="text-[#A3A3A3] font-mono">2026-06-10 11:12:04</span>
                      <span className="text-[#DC2626] font-semibold">IP: 103.24.12.5 (DENIED)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="glass-panel p-6 md:p-8 space-y-5 border border-[#2A2A2A] bg-[#171717] relative">
               <div>
                 <h3 className="text-sm font-bold text-[#FAFAFA] mb-1">Analyst Profile</h3>
                 <p className="text-xs text-[#A3A3A3]">Manage display identities associated with active logs</p>
               </div>

               <div className="space-y-1.5">
                 <label className="text-[10px] text-[#A3A3A3] font-semibold uppercase tracking-wider ml-0.5">Analyst Display Name</label>
                 <input 
                   type="text" 
                   className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg py-2.5 px-4 text-[#FAFAFA] text-xs focus:outline-none focus:border-[#4F46E5] transition-all"
                   value={localName}
                   onChange={(e) => setLocalName(e.target.value)}
                 />
               </div>
               
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#3730A3] text-white font-semibold rounded-lg text-xs uppercase transition-all cursor-pointer disabled:opacity-50 shadow-sm"
               >
                 {isSaving ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <Save size={14} />
                 )}
                 <span>Save Profile</span>
               </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
