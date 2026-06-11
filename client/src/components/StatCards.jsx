import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, Wifi } from 'lucide-react';

const StatCards = ({ alerts }) => {
  const stats = [
    {
      label: 'Active Threat Vectors',
      value: alerts.length,
      icon: <ShieldAlert className="text-[#DC2626]" size={18} />,
      badgeBg: 'bg-[#DC2626]/5 border-[#DC2626]/10',
      trend: '+12% increase / hr'
    },
    {
      label: 'Systems Safeguarded',
      value: '1,248',
      icon: <ShieldCheck className="text-[#16A34A]" size={18} />,
      badgeBg: 'bg-[#16A34A]/5 border-[#16A34A]/10',
      trend: 'Operational status: OK'
    },
    {
      label: 'Infrastructure Uptime',
      value: '99.99%',
      icon: <Activity className="text-[#4F46E5]" size={18} />,
      badgeBg: 'bg-[#4F46E5]/5 border-[#4F46E5]/10',
      trend: 'Latency: 11ms'
    },
    {
      label: 'Network Ingress/Egress',
      value: '2.4 GB/s',
      icon: <Wifi className="text-[#0EA5E9]" size={18} />,
      badgeBg: 'bg-[#0EA5E9]/5 border-[#0EA5E9]/10',
      trend: 'Ingress bandwidth nominal'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-[#A3A3A3] tracking-tight">
                {stat.label}
              </p>
              <h4 className="text-2.5xl font-semibold text-[#FAFAFA] mt-2 tracking-tight">
                {stat.value}
              </h4>
            </div>
            
            <div className={`p-2.5 rounded-lg border flex items-center justify-center ${stat.badgeBg}`}>
              {stat.icon}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] text-[#A3A3A3] font-medium">
              {stat.trend}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
