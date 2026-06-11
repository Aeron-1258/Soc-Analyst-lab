import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const TrafficChart = ({ data }) => {
  return (
    <div className="h-[250px] w-full font-mono text-[10px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            hide 
          />
          <YAxis 
            stroke="#475569" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}Mb`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0b0b0b', 
              borderColor: 'rgba(255,255,255,0.05)', 
              borderRadius: '12px',
              fontSize: '11px',
              color: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
            }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="incoming" 
            stroke="#7C3AED" 
            fillOpacity={1} 
            fill="url(#colorIn)" 
            strokeWidth={1.5}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="outgoing" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorOut)" 
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
