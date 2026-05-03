import React from 'react';
import { useSocket } from '../context/SocketContext';
import ThreatMapComponent from '../components/ThreatMapComponent';
import { Globe, Activity, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ThreatMapPage = () => {
  const { threats, isMitigating, searchTerm } = useSocket();

  const filteredThreats = threats.filter(t => 
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.from.ip.includes(searchTerm) ||
    t.from.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-neon-cyan" /> Global Threat Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">Real-time visualization of incoming cyber attacks</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Activity size={16} className="text-neon-blue" />
            <span className="text-xs text-slate-300 font-mono">Nodes: {filteredThreats.length}</span>
          </div>
          {isMitigating && (
            <div className="glass-panel px-4 py-2 border-neon-green/30 bg-neon-green/10 flex items-center gap-2">
              <Shield size={16} className="text-neon-green" />
              <span className="text-xs text-neon-green font-bold">DEFENSE ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 glass-panel p-2 min-h-[500px] relative overflow-hidden">
        <ThreatMapComponent threats={filteredThreats} isMitigating={isMitigating} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
            <div className="w-2 h-2 bg-neon-red rounded-full shadow-[0_0_8px_#ef4444]"></div> Top Attack Sources
          </h4>
          <div className="space-y-3">
             {['Russia', 'China', 'Brazil'].map((country, i) => (
               <div key={country} className="flex justify-between items-center">
                 <span className="text-sm text-slate-400">{i+1}. {country}</span>
                 <span className="text-xs font-mono text-white">{(85 - i*15)}%</span>
               </div>
             ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
            <div className="w-2 h-2 bg-neon-blue rounded-full shadow-[0_0_8px_#0ea5e9]"></div> Target Infrastructure
          </h4>
          <div className="space-y-3">
             {['Primary DC', 'Edge Gateway', 'Auth Cluster'].map((target, i) => (
               <div key={target} className="flex justify-between items-center">
                 <span className="text-sm text-slate-400">{target}</span>
                 <span className="text-xs font-mono text-neon-blue">Active</span>
               </div>
             ))}
          </div>
        </div>
        <div className="glass-panel p-6">
          <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
             AI Prediction
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Neural patterns suggest a 15% increase in brute-force activity from Eastern Europe over the next 4 hours.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatMapPage;
