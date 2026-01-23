import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import ViewDetailsModal from '../components/ViewDetailsModal';
// 🆕 Icons
import { Search, Filter, Eye, IndianRupee, ShoppingBag, TrendingUp } from 'lucide-react';

interface Sale {
  _id: string;
  customerName?: string;
  customerMobile?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SalesPage: React.FC = () => {
  const { data: sales = [], isLoading } = useSWR<Sale[]>('/sales', fetcher);
  
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // 🧠 Smart Filter Logic
  const filteredSales = useMemo(() => {
    if (!Array.isArray(sales)) return [];
    let result = sales;

    if (filterType === 'DATE' && selectedDate) {
        const targetDate = new Date(selectedDate).toDateString();
        result = result.filter(s => new Date(s.createdAt).toDateString() === targetDate);
    } 
    else if (filterType === 'MONTH' && selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        result = result.filter(s => {
            const d = new Date(s.createdAt);
            return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
        });
    }

    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(s => 
            (s.customerName?.toLowerCase().includes(lowerTerm)) ||
            (s.customerMobile?.includes(lowerTerm))
        );
    }
    return result;
  }, [sales, filterType, selectedDate, selectedMonth, searchTerm]);

  // 📊 CALCULATE ANALYTICS
  const analytics = useMemo(() => {
      const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
      const totalOrders = filteredSales.length;
      const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      return { totalRevenue, totalOrders, averageOrder };
  }, [filteredSales]);

  // 💰 Indian Rupee Formatter
  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) return <div className="p-8 dark:text-white animate-pulse">Loading Sales History...</div>;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Sales History</h1>
          <p className="text-gray-500 text-sm">Analyze your past transactions</p>
        </div>
        
        <div className="relative w-full md:w-72">
             <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search Customer or Mobile..." 
                className="pl-10 p-3 rounded-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 md:p-8 pt-4">
        
        {/* 🛠️ FILTER BAR */}
        <div className="mb-6 flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3 h-3" /> Analysis Mode:
            </span>
            
            <div className="flex gap-2">
                <button onClick={() => setFilterType('ALL')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border ${filterType === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700'}`}>All Time</button>
                <button onClick={() => setFilterType('DATE')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border ${filterType === 'DATE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700'}`}>Specific Date</button>
                <button onClick={() => setFilterType('MONTH')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border ${filterType === 'MONTH' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700'}`}>Monthly Report</button>
            </div>

            {filterType === 'DATE' && <input type="date" className="ml-2 p-2 rounded-lg border dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm outline-none focus:border-blue-500" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />}
            {filterType === 'MONTH' && <input type="month" className="ml-2 p-2 rounded-lg border dark:bg-slate-900 dark:border-slate-600 dark:text-white text-sm outline-none focus:border-blue-500" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />}
        </div>

        {/* 📈 ANALYTICS SUMMARY */}
        {filterType !== 'ALL' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Total Revenue
                    </span>
                    <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
                        {formatRupee(analytics.totalRevenue)}
                    </span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> Total Orders
                    </span>
                    <span className="text-3xl font-black text-blue-700 dark:text-blue-300">
                        {analytics.totalOrders}
                    </span>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 p-4 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Avg. Order Value
                    </span>
                    <span className="text-3xl font-black text-purple-700 dark:text-purple-300">
                        {formatRupee(analytics.averageOrder)}
                    </span>
                </div>
            </div>
        )}

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b dark:border-slate-700">
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold text-right">Total</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredSales.length > 0 ? filteredSales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-800 dark:text-white text-sm">{new Date(sale.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-gray-200 text-sm">{sale.customerName || 'Guest'}</div>
                      {sale.customerMobile && <div className="text-xs text-blue-500 font-mono tracking-wide">{sale.customerMobile}</div>}
                    </td>
                    <td className="p-4"><span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold">{sale.items.length} Items</span></td>
                    <td className="p-4 text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                            {formatRupee(sale.totalAmount)}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedSale(sale)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded transition-all flex items-center gap-1 justify-center mx-auto"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 italic">No sales found for this period.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <ViewDetailsModal 
          isOpen={!!selectedSale} 
          onClose={() => setSelectedSale(null)} 
          data={selectedSale} 
        />
      </div>
    </div>
  );
};

export default SalesPage;