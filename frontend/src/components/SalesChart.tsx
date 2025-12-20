import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface Sale {
  _id: string;
  totalAmount: number;
  createdAt: string;
}

interface SalesChartProps {
  sales: Sale[];
}

const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
  const data = useMemo(() => {
    // 🛡️ Guard: Ensure sales is an array
    const safeSales = Array.isArray(sales) ? sales : [];
    
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Handle timezone offset to match database dates correctly
      const dateString = d.toISOString().split('T')[0];
      
      const dailyTotal = safeSales
        .filter((sale) => sale?.createdAt && sale.createdAt.startsWith(dateString))
        .reduce((sum, sale) => sum + (sale?.totalAmount || 0), 0);

      chartData.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dailyTotal,
      });
    }
    return chartData;
  }, [sales]);

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-x-auto">
      <h3 className="text-lg font-bold text-gray-700 dark:text-white mb-4">Weekly Revenue Trend</h3>
      
      {/* 🛡️ FIX: Removed ResponsiveContainer to stop the 'useContext' crash */}
      <div className="flex justify-center">
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            tickFormatter={(value: any) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#1F2937',
              color: '#F3F4F6'
            }}
            itemStyle={{ color: '#F3F4F6' }}
            formatter={(value: any) => [`$${value}`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]} 
            barSize={40}
          />
        </BarChart>
      </div>
    </div>
  );
};

export default SalesChart;