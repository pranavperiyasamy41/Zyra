import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Sale {
  _id: string;
  totalAmount: number;
  createdAt: string;
}

interface SalesChartProps {
  sales: Sale[];
  days?: number; 
}

const SalesChart: React.FC<SalesChartProps> = ({ sales, days = 7 }) => {
  const data = useMemo(() => {
    const lastNDays = [...Array(days)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i)); 
      return d;
    });

    return lastNDays.map((date) => {
      const dateStr = date.toDateString();
      const dailyTotal = sales
        .filter((s) => new Date(s.createdAt).toDateString() === dateStr)
        .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

      return {
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        value: dailyTotal,
      };
    });
  }, [sales, days]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.1} />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} 
          dy={10}
          interval={days > 14 ? 2 : 0} 
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          tickFormatter={(value) => `$${value}`}
        />
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }}
          itemStyle={{ color: '#60A5FA' }}
          // ✅ FIXED: Changed 'value: number' to 'value: any' to satisfy Recharts types
          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
          cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        
        <Area
          type="monotone"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorValue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;