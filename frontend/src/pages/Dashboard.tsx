import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import SalesChart from '../components/SalesChart';
import RecordSaleModal from '../components/RecordSaleModal';
import { 
  IndianRupee, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  Plus, 
  Megaphone,
  AlertCircle,
  ArrowRight,
  History,
  BarChart3,
  Flame,
  ChevronDown
} from 'lucide-react';

// --- Types ---
interface Medicine { 
  _id: string; 
  name: string; 
  quantity: number; 
  stock?: number; 
  createdAt: string; 
}

interface Sale { 
  _id: string; 
  items: Array<{ name: string; quantity: number }>; 
  totalAmount: number; 
  createdAt: string; 
}

interface Announcement { 
  _id: string; 
  title: string; 
  content: string; 
  type: string; 
  createdAt: string; 
}

interface DashboardStats {
  revenue: number;
  revenueToday: number;
  revenueMonth: number;
  totalStock: number;
  lowStock: number;
  expiring: number;
  expiringValue?: number;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const formatRupee = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [chartDays, setChartDays] = useState<number>(7);
  const [isChartDropdownOpen, setIsChartDropdownOpen] = useState(false);

  const { data: serverStats, mutate: mutateStats } = useSWR<DashboardStats>('/dashboard/stats', fetcher);
  const { data: inventoryData, mutate: mutateInventory } = useSWR('/medicines?limit=50', fetcher);
  const { data: salesData, mutate: mutateSales } = useSWR('/sales', fetcher);
  const { data: announcements = [] } = useSWR<Announcement[]>('/announcements', fetcher);

  const inventory = useMemo(() => inventoryData?.data || [], [inventoryData]);
  const sales = useMemo(() => salesData?.data || [], [salesData]);

  const lists = useMemo(() => {
    const safeInventory = Array.isArray(inventory) ? inventory : [];
    const safeSales = Array.isArray(sales) ? sales : [];
    const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

    const productPerformance: Record<string, number> = {};
    safeSales.forEach(sale => {
      sale.items?.forEach(item => {
        if (item.name) {
          productPerformance[item.name] = (productPerformance[item.name] || 0) + item.quantity;
        }
      });
    });

    const topSelling = Object.entries(productPerformance)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentM = [...safeInventory]
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const notices = safeAnnouncements.filter(a => a.type === 'system');

    return { topSelling, recentM, notices };
  }, [inventory, sales, announcements]);

  const stats = {
    revenue: serverStats?.revenue || 0,
    revenueToday: serverStats?.revenueToday || 0,
    revenueMonth: serverStats?.revenueMonth || 0,
    lowStock: serverStats?.lowStock || 0,
    expiring: serverStats?.expiring || 0,
    expiringValue: serverStats?.expiringValue || 0,
    totalStock: serverStats?.totalStock || 0
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors duration-300">
      
      {/* ==================== 📌 I MEDICALS SECTION (FIXED POSITION) ==================== */}
      <header className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:p-6 lg:px-8 lg:py-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            {user?.pharmacyName || 'I MEDICALS'}
          </h1>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
          <div className="flex items-center justify-center md:justify-start gap-2">
             <div className="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-highlight animate-pulse"></div>
             <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                OPERATOR: <span className="text-brand-primary dark:text-brand-highlight">{user?.username}</span>
             </p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSaleModalOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white w-full md:w-auto px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wider"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Plus className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-white" /> 
          <span className="relative z-10 text-white">New Sale</span>
        </button>
      </header>

      {/* Spacer to prevent content overlap with fixed header */}
      <div className="h-[180px] sm:h-[160px] md:h-[100px] w-full"></div>
      
      {/* ==================== DASHBOARD CONTENT AREA ==================== */}
      <div className="p-4 md:p-6 lg:px-10 py-6 md:py-10 space-y-6 md:space-y-10 max-w-7xl mx-auto animate-fade-in-up">
        
        {/* NOTICES */}
        {lists.notices.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
             {lists.notices.map(ann => (
              <div key={ann._id} className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary dark:text-brand-highlight flex items-start gap-3 shadow-sm">
                <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="font-black text-[10px] sm:text-xs uppercase tracking-widest mb-1">{ann.title}</p>
                   <p className="text-xs sm:text-sm font-medium opacity-90 line-clamp-2 md:line-clamp-none">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FINANCIAL TRIAD - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="relative group p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand-primary/10 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-3 md:p-4 bg-brand-primary/10 dark:bg-brand-primary/30 rounded-xl md:rounded-2xl text-brand-primary dark:text-brand-highlight shadow-sm dark:shadow-brand-primary/20">
                            <Activity className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-brand-primary dark:text-brand-highlight bg-brand-primary/5 dark:bg-brand-primary/20 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest border border-brand-primary/10 dark:border-brand-primary/30">Today</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">{formatRupee(stats.revenueToday)}</h3>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">Daily Revenue</p>
                </div>
            </div>

            <div className="relative group p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand-primary/10 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-3 md:p-4 bg-brand-primary/10 dark:bg-brand-primary/30 rounded-xl md:rounded-2xl text-brand-primary dark:text-brand-highlight shadow-sm dark:shadow-brand-primary/20">
                            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-brand-primary dark:text-brand-highlight bg-brand-primary/5 dark:bg-brand-primary/20 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest border border-brand-primary/10 dark:border-brand-primary/30">Month</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">{formatRupee(stats.revenueMonth)}</h3>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">Monthly Performance</p>
                </div>
            </div>

            <div className="relative group p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-primary/50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-brand-primary/10 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="p-3 md:p-4 bg-brand-primary/10 dark:bg-brand-primary/30 rounded-xl md:rounded-2xl text-brand-primary dark:text-brand-highlight shadow-sm dark:shadow-brand-primary/20">
                            <IndianRupee className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black text-brand-primary dark:text-brand-highlight bg-brand-primary/5 dark:bg-brand-primary/20 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest border border-brand-primary/10 dark:border-brand-primary/30">Lifetime</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">{formatRupee(stats.revenue)}</h3>
                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wide">Total Sales Volume</p>
                </div>
            </div>
        </div>

        {/* ALERTS ROW - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch">
            
            {/* LOW STOCK CARD */}
            <div className="h-full">
               <div 
                 onClick={() => navigate('/inventory?filter=low-stock')}
                 className="relative h-full overflow-hidden rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 cursor-pointer group border border-red-500/20 bg-white dark:bg-slate-900 shadow-xl hover:shadow-red-500/10 hover:scale-[1.02] transition-all flex flex-col justify-between"
               >
                  <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] md:text-xs font-black text-red-500 dark:text-red-400 uppercase tracking-widest mb-1 md:mb-2">Inventory Alert</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{stats.lowStock}</span>
                            <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase">Low Items</span>
                        </div>
                      </div>
                      <div className="bg-red-500/10 dark:bg-red-500/30 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-red-500 dark:text-red-400 animate-pulse shadow-sm dark:shadow-red-500/20">
                        <AlertTriangle className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                  </div>
                  <div className="mt-6 md:mt-8 flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-red-500 dark:text-red-400">
                      <span>Refill Required</span>
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
               </div>
            </div>

            {/* EXPIRY RISK CARD */}
            <div className="h-full">
              <div 
                onClick={() => navigate('/inventory?filter=expiring')}
                className="relative h-full overflow-hidden rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 cursor-pointer group border border-orange-500/20 bg-white dark:bg-slate-900 shadow-xl hover:shadow-orange-500/10 hover:scale-[1.02] transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] md:text-xs font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-1 md:mb-2">Expiry Risk</p>
                      <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{stats.expiring}</span>
                          <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase">Batches</span>
                      </div>
                    </div>
                    <div className="bg-orange-500/10 dark:bg-orange-500/30 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-orange-500 dark:text-orange-400 shadow-sm dark:shadow-orange-500/20">
                      <AlertCircle className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                </div>
                <div className="mt-6 md:mt-8 flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-orange-500 dark:text-orange-400">
                    <span>Review Expiry</span>
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>

            {/* TOTAL INVENTORY */}
            <div className="h-full p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                <div>
                   <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Total Management</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">{stats.totalStock}</span>
                      <span className="text-[10px] md:text-xs text-slate-400 font-black uppercase">Active SKUs</span>
                   </div>
                </div>
                <div className="flex justify-end mt-4 md:mt-6">
                    <div className="bg-brand-primary/10 dark:bg-brand-primary/30 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-brand-primary dark:text-brand-highlight shadow-sm dark:shadow-brand-primary/20">
                        <Package className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                </div>
            </div>
        </div>

        {/* MAIN CHART */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] shadow-xl relative z-20">
            <div 
                style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                className="px-6 py-4 md:px-8 md:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative rounded-t-2xl md:rounded-t-[2.5rem]"
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-2xl md:rounded-t-[2.5rem]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                </div>
                <h3 className="font-black text-white uppercase text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-2 relative z-10">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-brand-highlight" /> Sales Analytics
                </h3>
                
                {/* Premium Custom Dropdown */}
                <div className="relative z-50 w-full sm:w-auto">
                    <button 
                        onClick={() => setIsChartDropdownOpen(!isChartDropdownOpen)}
                        className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all backdrop-blur-md group"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-brand-highlight" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                Last {chartDays} Days
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-300 ${isChartDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isChartDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsChartDropdownOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-full sm:w-44 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                {[7, 14, 30].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => { setChartDays(days); setIsChartDropdownOpen(false); }}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            chartDays === days 
                                            ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg' 
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {days} Days Report
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="p-6 md:p-8 relative z-10">
                <div className="w-full h-[250px] md:h-[350px]">
                   <SalesChart sales={Array.isArray(sales) ? sales : []} days={chartDays} />
                </div>
            </div>
        </div>

        {/* TABLES / LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Top Selling */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden">
            <div 
                style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                className="px-6 py-4 md:px-8 md:py-5 flex justify-between items-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <h3 className="font-black text-white uppercase text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-2 relative z-10">
                    <Flame className="w-4 h-4 md:w-5 md:h-5 text-brand-highlight" /> Best Sellers
                </h3>
            </div>
            <div className="p-6 md:p-8">
                {lists.topSelling.length > 0 ? (
                <div className="space-y-4 md:space-y-6">
                    {lists.topSelling.map((item, index) => (
                    <div key={index} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3 md:gap-5">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm transition-all group-hover:scale-110 ${index === 0 ? 'bg-brand-highlight text-brand-primary shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        {index + 1}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white capitalize truncate max-w-[120px] sm:max-w-none">{item.name}</p>
                            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">Primary Product</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="block font-black text-lg md:text-xl text-slate-900 dark:text-white">{item.count}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest">Units Sold</span>
                    </div>
                    </div>
                ))}
                </div>
                ) : <div className="text-center py-10 text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest opacity-50">No Data</div>}
            </div>
          </div>
          
          {/* Recent Arrivals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden">
            <div 
                style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                className="px-6 py-4 md:px-8 md:py-5 flex justify-between items-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                <h3 className="font-black text-white uppercase text-[10px] md:text-xs tracking-[0.2em] flex items-center gap-2 relative z-10">
                    <History className="w-4 h-4 md:w-5 md:h-5 text-brand-highlight" /> Inventory Log
                </h3>
            </div>
            <div className="p-6 md:p-8">
                {lists.recentM.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                        {lists.recentM.map(m => (
                        <div key={m._id} className="flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                            <div className="overflow-hidden">
                                <p className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-200 truncate">{m.name}</p>
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{new Date(m.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-brand-primary/10 flex items-center gap-1.5 flex-shrink-0">
                            <Package className="w-3 h-3 md:w-3.5 md:h-3.5" /> +{m.quantity ?? m.stock}
                            </span>
                        </div>
                        ))}
                    </div>
                ) : <div className="text-center py-10 text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest opacity-50">Empty Log</div>}
            </div>
          </div>
        </div>

        {/* MODAL */}
        {isSaleModalOpen && (
          <RecordSaleModal 
            isOpen={isSaleModalOpen} 
            onClose={() => setIsSaleModalOpen(false)} 
            onSuccess={() => { mutateSales(); mutateInventory(); mutateStats(); }} 
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;