import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AggregatedSale {
  _id: string; // "YYYY-MM-DD"
  totalRevenue: number;
  totalOrders: number;
}

interface AdminSalesChartProps {
  data: AggregatedSale[];
}

const AdminSalesChart: React.FC<AdminSalesChartProps> = ({ data }) => {
  // Format data for Recharts
  const chartData = data.map(item => ({
    name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: item.totalRevenue,
    orders: item.totalOrders
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.1} />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} 
          dy={10}
        />
        
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          tickFormatter={(value) => `$${value}`}
        />
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            border: 'none',
            borderRadius: '16px',
            color: '#fff',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}
          labelStyle={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}
          itemStyle={{ color: '#34D399', fontSize: '14px', fontWeight: 'bold' }}
          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Total Revenue']}
          cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#10B981"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AdminSalesChart;