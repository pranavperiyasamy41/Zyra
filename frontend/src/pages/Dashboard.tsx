import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import SalesChart from '../components/SalesChart';
import RecordSaleModal from '../components/RecordSaleModal';
// 🆕 Premium Icons
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
  Flame
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

// 💰 Currency Formatter Helper
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

  // --- Fetch Data ---
  const { data: serverStats, mutate: mutateStats } = useSWR<DashboardStats>('/dashboard/stats', fetcher);
  const { data: inventory = [], mutate: mutateInventory } = useSWR<Medicine[]>('/medicines', fetcher);
  const { data: salesData, mutate: mutateSales } = useSWR('/sales', fetcher);
  const { data: announcements = [] } = useSWR<Announcement[]>('/announcements', fetcher);

  // Extract sales array from paginated response
  const sales = useMemo(() => salesData?.data || [], [salesData]);

  // --- Stats Logic ---
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
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 lg:p-8 flex flex-col md:flex-row justify-between md:items-end gap-4 shadow-sm transition-all">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {user?.pharmacyName || 'My Pharmacy'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <p className="text-slate-500 font-bold text-sm tracking-wide">OPERATOR: <span className="text-blue-600 dark:text-blue-400">{user?.username}</span></p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSaleModalOpen(true)}
          className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="flex items-center gap-2">
            <Plus className="w-6 h-6" /> NEW SALE
          </span>
        </button>
      </header>
      
      <div className="p-6 lg:p-8 pt-6 space-y-8">
        
        {/* NOTICES */}
        {lists.notices.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-6">
             {lists.notices.map(ann => (
              <div key={ann._id} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-start gap-3">
                <Megaphone className="w-5 h-5 mt-0.5" />
                <div>
                   <p className="font-bold text-sm uppercase tracking-wide">{ann.title}</p>
                   <p className="text-sm opacity-90">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FINANCIAL TRIAD (With Icons & Rupee) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-2xl dark:shadow-none overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">Today</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{formatRupee(stats.revenueToday)}</h3>
                    <p className="text-slate-400 text-xs font-medium">Daily Performance</p>
                </div>
            </div>

            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-2xl dark:shadow-none overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">Month</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{formatRupee(stats.revenueMonth)}</h3>
                    <p className="text-slate-400 text-xs font-medium">Monthly Target</p>
                </div>
            </div>

            <div className="relative group p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-2xl dark:shadow-none overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black text-purple-500 bg-purple-500/10 px-2 py-1 rounded-lg uppercase tracking-wider">Lifetime</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1">{formatRupee(stats.revenue)}</h3>
                    <p className="text-slate-400 text-xs font-medium">Total Business Value</p>
                </div>
            </div>
        </div>

        {/* ALERTS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* LOW STOCK CARD */}
            <div className="h-full">
               <div 
                 onClick={() => navigate('/inventory?filter=low-stock')}
                 className="relative h-full overflow-hidden rounded-[2rem] p-6 cursor-pointer group border border-pink-500/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl hover:scale-[1.02] transition-all flex flex-col justify-between"
               >
                  <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-1">Low Stock</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.lowStock}</span>
                            <span className="text-sm text-slate-400 font-bold uppercase">Items</span>
                        </div>
                      </div>
                      <div className="bg-pink-500/20 p-2 rounded-xl text-pink-500 animate-pulse">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-pink-500/20 flex justify-between items-end">
                      <p className="text-xs text-pink-400 italic">Action needed</p>
                      <span className="text-xs font-bold text-pink-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          View Inventory <ArrowRight className="w-3 h-3" />
                      </span>
                  </div>
               </div>
            </div>

            {/* EXPIRY RISK CARD */}
            <div className="h-full">
              <div 
                onClick={() => navigate('/inventory?filter=expiring')}
                className="relative h-full overflow-hidden rounded-[2rem] p-6 cursor-pointer group border border-orange-500/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl hover:scale-[1.02] transition-all flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">Expiry Risk</p>
                      <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.expiring}</span>
                          <span className="text-sm text-slate-400 font-bold uppercase">Items</span>
                      </div>
                    </div>
                    <div className="bg-orange-500/20 p-2 rounded-xl text-orange-500 animate-pulse">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-orange-500/20 flex justify-between items-end">
                    {stats.expiringValue && stats.expiringValue > 0 ? (
                      <div>
                          <p className="text-[10px] uppercase font-bold text-orange-400">Potential Loss</p>
                          <p className="text-xl font-black text-red-500">-{formatRupee(stats.expiringValue)}</p>
                      </div>
                    ) : (
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">✅ No Risk</p>
                    )}
                    
                    <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Review List <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
              </div>
            </div>

            {/* Active Stock */}
            <div className="h-full p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-2xl dark:shadow-none flex flex-col justify-between">
                <div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Inventory</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.totalStock}</span>
                      <span className="text-sm text-slate-400 font-bold uppercase">Medicines</span>
                   </div>
                </div>
                <div className="flex justify-end mt-4">
                    <div className="bg-blue-500/20 p-2 rounded-xl text-blue-500">
                        <Package className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* MAIN CHART */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-[2rem] p-6 shadow-2xl dark:shadow-none overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" /> Revenue Trends
                </h3>
                <select 
                  className="bg-slate-100 dark:bg-slate-900 border-none text-xs font-bold rounded-lg px-3 py-1 text-slate-500 outline-none"
                  value={chartDays}
                  onChange={(e) => setChartDays(Number(e.target.value))}
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                </select>
            </div>
            <div className="w-full h-[300px]">
               <SalesChart sales={Array.isArray(sales) ? sales : []} days={chartDays} />
            </div>
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Selling */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-[2rem] p-6 shadow-2xl dark:shadow-none h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" /> Top Movers
              </h3>
            </div>
            {lists.topSelling.length > 0 ? (
              <div className="space-y-4">
                {lists.topSelling.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110 ${index === 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-orange-400 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      #{index + 1}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{item.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Best Seller</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-lg text-slate-900 dark:text-white">{item.count}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Units Sold</span>
                  </div>
                </div>
              ))}
              </div>
            ) : <div className="text-center py-10 text-slate-400 text-sm italic">No sales data yet.</div>}
          </div>
          
          {/* Recent Arrivals */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-[2rem] p-6 shadow-2xl dark:shadow-none h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-500" /> Recent Log
              </h3>
            </div>
            {lists.recentM.length > 0 ? (
                <div className="space-y-3">
                    {lists.recentM.map(m => (
                    <div key={m._id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{m.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{new Date(m.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-1">
                          <Package className="w-3 h-3" /> +{m.quantity ?? m.stock}
                        </span>
                    </div>
                    ))}
                </div>
            ) : <p className="text-center py-10 text-slate-400 text-sm italic">No inventory added yet.</p>}
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