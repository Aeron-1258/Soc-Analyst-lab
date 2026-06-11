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
    <div className="h-[240px] w-full font-sans text-[10px] text-[#A3A3A3]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A3A3A3" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#A3A3A3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            hide 
          />
          <YAxis 
            stroke="#64748B" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}Mb`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#171717', 
              borderColor: '#2A2A2A', 
              borderRadius: '8px',
              fontSize: '11px',
              color: '#FAFAFA',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#FAFAFA' }}
          />
          <Area 
            type="monotone" 
            dataKey="incoming" 
            stroke="#4F46E5" 
            fillOpacity={1} 
            fill="url(#colorIn)" 
            strokeWidth={1.5}
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="outgoing" 
            stroke="#A3A3A3" 
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
