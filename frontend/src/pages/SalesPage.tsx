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
    limit: '10',
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
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-md">
        <div className="w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 sm:gap-3">
            <History className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Sales History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm mt-0.5 md:mt-1 font-medium">Analyze your past transactions</p>
        </div>
        
        <div className="relative w-full md:w-72 group">
             <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] flex items-center justify-center shadow-lg shadow-[#0B5E4A]/20 transition-all group-focus-within:scale-110 group-focus-within:shadow-[#1FAE63]/40 z-10">
                <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
             </div>
             <input 
                type="text" 
                placeholder="Search Customer..." 
                className="pl-12 md:pl-14 pr-4 py-2.5 md:py-3 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-xs md:text-sm font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[160px] md:h-[140px] w-full"></div>

      {/* CONTENT */}
      <div className="p-4 md:p-8 pt-2 md:pt-4">
        
        {/* 📈 ANALYTICS SUMMARY - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            
            <div className="relative group p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 md:w-4 md:h-4" /> Total Revenue
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : formatRupee(analytics?.totalRevenue || 0)}
                    </span>
                </div>
            </div>

            <div className="relative group p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-teal-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-teal-600 dark:text-teal-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> Total Orders
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : (analytics?.totalOrders || 0)}
                    </span>
                </div>
            </div>

            <div className="relative group p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-xl overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" /> Avg. Order Value
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
                        {analyticsLoading ? "..." : formatRupee(analytics?.averageOrder || 0)}
                    </span>
                </div>
            </div>
        </div>

        {/* 🛠️ FILTER BAR - Responsive */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            
            {/* All Time (Reset) */}
            <button 
                onClick={() => { setStartDate(null); setEndDate(null); }}
                className={`px-5 py-2.5 rounded-xl sm:rounded-full text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    !startDate && !endDate
                    ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white border-transparent shadow-lg' 
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}
            >
                <Filter className="w-3.5 h-3.5" /> 
                <span>All Time</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex flex-row items-center gap-2 flex-1 sm:flex-none">
                <div className="flex-1 sm:flex-none flex items-center gap-2">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">From</span>
                    <PremiumDatePicker 
                        selected={startDate} 
                        onChange={handleStartDateChange}
                        maxDate={endDate}
                        placeholder="Start Date"
                        className="w-full sm:w-auto"
                    />
                </div>

                <div className="flex-1 sm:flex-none flex items-center gap-2">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">To</span>
                    <PremiumDatePicker 
                        selected={endDate} 
                        onChange={handleEndDateChange}
                        minDate={startDate}
                        placeholder="End Date"
                        className="w-full sm:w-auto"
                    />
                </div>

                {/* Clear Button */}
                {(startDate || endDate) && (
                    <button 
                        onClick={() => { setStartDate(null); setEndDate(null); }}
                        className="p-2 rounded-full text-slate-400 hover:text-red-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>

        {/* DATA VIEW */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col min-h-[400px]">
          
          {/* DESKTOP TABLE (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto flex-grow">
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
                    <tr><td colSpan={5} className="p-12 text-center text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">Loading records...</td></tr>
                ) : sales.length > 0 ? sales.map((sale) => (
                  <tr key={sale._id} className="group hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors">
                    <td className="p-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{new Date(sale.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{sale.customerName || 'Guest'}</div>
                      {sale.customerMobile && <div className="text-[10px] text-teal-500 font-mono tracking-wide mt-0.5">{sale.customerMobile}</div>}
                    </td>
                    <td className="p-6"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700">{sale.items.length} Items</span></td>
                    <td className="p-6 text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                            {formatRupee(sale.totalAmount)}
                        </span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => setSelectedSale(sale)}
                        className="text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 justify-center mx-auto text-[10px] font-bold uppercase tracking-wider"
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

          {/* MOBILE LIST (Visible on Mobile) */}
          <div className="md:hidden flex-grow p-4 space-y-4">
            {salesLoading ? (
                <div className="p-12 text-center text-slate-400 animate-pulse font-bold text-xs">LOADING...</div>
            ) : sales.length > 0 ? sales.map((sale) => (
                <div key={sale._id} onClick={() => setSelectedSale(sale)} className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(sale.createdAt).toLocaleDateString()}</p>
                            <h3 className="font-black text-slate-900 dark:text-white text-base mt-0.5">{sale.customerName || 'Guest Sale'}</h3>
                        </div>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatRupee(sale.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-50 dark:border-slate-800 pt-3 mt-3 font-bold uppercase">
                        <span className="flex items-center gap-1.5"><ShoppingBag className="w-3 h-3" /> {sale.items.length} Items</span>
                        <span className="text-teal-500 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Tap to View</span>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 text-slate-400 font-medium">No sales found.</div>
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-md">
                <span className="text-[9px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">
                    Page {pagination.page} / {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
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