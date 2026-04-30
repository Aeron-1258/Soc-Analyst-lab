import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, Wifi } from 'lucide-react';

const StatCards = ({ alerts }) => {
  const stats = [
    {
      label: 'Active Threats',
      value: alerts.length,
      icon: <ShieldAlert className="text-neon-red" size={24} />,
      color: 'border-neon-red/30',
      bg: 'bg-neon-red/10',
      trend: '+12% from last hour'
    },
    {
      label: 'Systems Guarded',
      value: '1,248',
      icon: <ShieldCheck className="text-neon-green" size={24} />,
      color: 'border-neon-green/30',
      bg: 'bg-neon-green/10',
      trend: 'All systems operational'
    },
    {
      label: 'Uptime',
      value: '99.99%',
      icon: <Activity className="text-neon-blue" size={24} />,
      color: 'border-neon-blue/30',
      bg: 'bg-neon-blue/10',
      trend: 'Normal latency'
    },
    {
      label: 'Network Load',
      value: '2.4 GB/s',
      icon: <Wifi className="text-neon-yellow" size={24} />,
      color: 'border-neon-yellow/30',
      bg: 'bg-neon-yellow/10',
      trend: 'Optimal throughput'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className={`glass-panel p-6 border-b-2 ${stat.color} relative overflow-hidden group`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-white mt-1">{stat.value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
             <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{stat.trend}</span>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            {React.cloneElement(stat.icon, { size: 100 })}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
