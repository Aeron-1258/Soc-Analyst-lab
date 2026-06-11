import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, Wifi } from 'lucide-react';

const StatCards = ({ alerts }) => {
  const stats = [
    {
      label: 'Active Threats',
      value: alerts.length,
      icon: <ShieldAlert className="text-neon-red font-bold" size={22} />,
      color: 'border-neon-red/20 group-hover:border-neon-red/40',
      bg: 'bg-neon-red/5',
      trend: '+12% from last hour',
      shadow: 'hover:shadow-[0_8px_30px_rgba(239,68,68,0.08)]'
    },
    {
      label: 'Systems Guarded',
      value: '1,248',
      icon: <ShieldCheck className="text-neon-green font-bold" size={22} />,
      color: 'border-neon-green/20 group-hover:border-neon-green/40',
      bg: 'bg-neon-green/5',
      trend: 'All systems operational',
      shadow: 'hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]'
    },
    {
      label: 'Uptime',
      value: '99.99%',
      icon: <Activity className="text-neon-purple font-bold" size={22} />,
      color: 'border-neon-purple/20 group-hover:border-neon-purple/40',
      bg: 'bg-neon-purple/5',
      trend: 'Normal latency',
      shadow: 'hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)]'
    },
    {
      label: 'Network Load',
      value: '2.4 GB/s',
      icon: <Wifi className="text-neon-cyan" size={22} />,
      color: 'border-neon-cyan/20 group-hover:border-neon-cyan/40',
      bg: 'bg-neon-cyan/5',
      trend: 'Optimal throughput',
      shadow: 'hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          whileHover={{ y: -5 }}
          className={`glass-panel p-6 border ${stat.color} ${stat.shadow} relative overflow-hidden group bg-[#0b0b0b]/60`}
        >
          {/* Subtle inside gradient sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.02] pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider font-mono">
                {stat.label}
              </p>
              <h4 className="text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">
                {stat.value}
              </h4>
            </div>
            
            <div className={`p-3 rounded-xl border border-white/5 ${stat.bg} shadow-[0_4px_12px_rgba(0,0,0,0.3)]`}>
              {stat.icon}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-500 font-mono">
              {stat.trend}
            </span>
          </div>

          {/* Large semi-transparent background icon for depth */}
          <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.04] group-hover:scale-105 transition-all duration-500 pointer-events-none">
            {React.cloneElement(stat.icon, { size: 110 })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
