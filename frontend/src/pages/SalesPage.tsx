import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import ViewDetailsModal from '../components/ViewDetailsModal';
import PremiumDatePicker from '../components/PremiumDatePicker';
import { toast } from 'react-hot-toast';
import { Search, Filter, Eye, IndianRupee, ShoppingBag, TrendingUp, ChevronLeft, ChevronRight, History, Calendar, X } from 'lucide-react';

interface Sale {
  _id: string;
  customerName?: string;
  customerMobile?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SalesResponse {
  data: Sale[];
  pagination: PaginationData;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrder: number;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SalesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, startDate, endDate]);

  // Date Change Handlers with Validation
  const handleStartDateChange = (date: Date | null) => {
    if (date && endDate && date > endDate) {
        toast.error('Start date cannot be after End date');
        setEndDate(null); // Reset end date as it's now invalid
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date && startDate && date < startDate) {
        toast.error('End date cannot be before Start date');
        // Do not set the date, or set it and warn. 
        // Better UX: Don't set it if it's invalid, but DatePicker with minDate usually prevents this.
        // If they manually type it or bypass:
        return; 
    }
    setEndDate(date);
  };

  // Construct Query Params
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '20',
  });

  if (searchTerm) queryParams.append('search', searchTerm);
  if (startDate) queryParams.append('startDate', startDate.toISOString());
  if (endDate) queryParams.append('endDate', endDate.toISOString());

  const queryString = queryParams.toString();

  // Fetch Sales (Paginated)
  const { data: salesData, isLoading: salesLoading } = useSWR<SalesResponse>(
    `/sales?${queryString}`, 
    fetcher,
    { keepPreviousData: true }
  );

  // Fetch Analytics (Summary)
  const { data: analytics, isLoading: analyticsLoading } = useSWR<AnalyticsData>(
    `/sales/analytics?${queryString}`,
    fetcher
  );

  const sales = salesData?.data || [];
  const pagination = salesData?.pagination;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-blue-600" /> Sales History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Analyze your past transactions</p>
        </div>
        
        <div className="relative w-full md:w-72 group">
             <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <input 
                type="text" 
                placeholder="Search Customer..." 
                className="pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium shadow-sm group-hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 md:p-8 pt-4">
        
        {/* 📈 ANALYTICS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            
            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" /> Total Revenue
                    </span>
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : formatRupee(analytics?.totalRevenue || 0)}
                    </span>
                </div>
            </div>

            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Total Orders
                    </span>
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : (analytics?.totalOrders || 0)}
                    </span>
                </div>
            </div>

            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Avg. Order Value
                    </span>
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : formatRupee(analytics?.averageOrder || 0)}
                    </span>
                </div>
            </div>
        </div>

        {/* 🛠️ FILTER BAR (Premium Date Range) */}
        <div className="mb-8 flex flex-wrap justify-center md:justify-start items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            
            {/* All Time (Reset) */}
            <button 
                onClick={() => { setStartDate(null); setEndDate(null); }}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                    !startDate && !endDate
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
                <Filter className="w-3.5 h-3.5" /> All Time
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            {/* Start Date */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">From</span>
                <PremiumDatePicker 
                    selected={startDate} 
                    onChange={handleStartDateChange}
                    maxDate={endDate} // Cannot select start date after end date
                    placeholder="Start Date"
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                        startDate
                        ? 'bg-white/80 dark:bg-slate-900/80 text-blue-600 border-blue-200 dark:border-blue-900 shadow-sm backdrop-blur-md' 
                        : 'bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-md'
                    }`}
                />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">To</span>
                <PremiumDatePicker 
                    selected={endDate} 
                    onChange={handleEndDateChange}
                    minDate={startDate} // Cannot select end date before start date
                    placeholder="End Date"
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                        endDate
                        ? 'bg-white/80 dark:bg-slate-900/80 text-blue-600 border-blue-200 dark:border-blue-900 shadow-sm backdrop-blur-md' 
                        : 'bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-md'
                    }`}
                />
            </div>

            {/* Clear Button (only if dates selected) */}
            {(startDate || endDate) && (
                <button 
                    onClick={() => { setStartDate(null); setEndDate(null); }}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Clear Dates"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

        </div>

        {/* TABLE */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col min-h-[400px]">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 backdrop-blur-md">
                  <th className="p-6">Date</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Items</th>
                  <th className="p-6 text-right">Total</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {salesLoading ? (
                    <tr><td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse">Loading data...</td></tr>
                ) : sales.length > 0 ? sales.map((sale) => (
                  <tr key={sale._id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{new Date(sale.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{sale.customerName || 'Guest'}</div>
                      {sale.customerMobile && <div className="text-xs text-blue-500 font-mono tracking-wide mt-0.5">{sale.customerMobile}</div>}
                    </td>
                    <td className="p-6"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">{sale.items.length} Items</span></td>
                    <td className="p-6 text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                            {formatRupee(sale.totalAmount)}
                        </span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => setSelectedSale(sale)}
                        className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 justify-center mx-auto text-xs font-bold uppercase tracking-wider"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic">No sales found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-md">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-2">
                    Page {pagination.page} / {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          )}
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