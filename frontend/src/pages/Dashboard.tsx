import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import LowStockAlert from '../components/LowStockAlert';
import ExpiringSoonAlert from '../components/ExpiringSoonAlert';
import SalesChart from '../components/SalesChart';
import RecordSaleModal from '../components/RecordSaleModal';

// --- Types ---
interface Medicine { 
  _id: string; 
  name: string; 
  quantity: number; 
  stock?: number;
  expiryDate: string; 
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

// 🔮 Prediction Type
interface Prediction {
    name: string;
    daysLeft: number;
    dailyRate: string;
    currentStock: number;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // --- Fetch Data ---
  const { data: inventory = [], isLoading: loadingInv, mutate: mutateInventory } = useSWR<Medicine[]>('/medicines', fetcher);
  const { data: sales = [], isLoading: loadingSales, mutate: mutateSales } = useSWR<Sale[]>('/sales', fetcher);
  const { data: announcements = [] } = useSWR<Announcement[]>('/announcements', fetcher);
  // 🔮 Fetch Predictions
  const { data: predictions = [] } = useSWR<Prediction[]>('/sales/predict', fetcher);

  // --- Stats Logic ---
  const stats = useMemo(() => {
    const safeInventory = Array.isArray(inventory) ? inventory : [];
    const safeSales = Array.isArray(sales) ? sales : [];
    const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    const getQty = (item: Medicine) => item.quantity ?? item.stock ?? 0;

    const lowStock = safeInventory.filter(i => getQty(i) > 0 && getQty(i) <= 10);
    
    const expiring = safeInventory.filter(i => {
      const d = new Date(i.expiryDate);
      return d > today && d <= thirtyDays && getQty(i) > 0;
    });

    const revenue = safeSales.reduce((acc, s) => acc + (s?.totalAmount || 0), 0);
    
    // Top Selling Items Logic
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

    // Recently Added Stock
    const recentM = [...safeInventory]
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const notices = safeAnnouncements.filter(a => a.type === 'system');

    return { lowStock, expiring, revenue, topSelling, recentM, notices };
  }, [inventory, sales, announcements]);

  if (loadingInv || loadingSales) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="p-6 lg:p-8">
      {/* 1. HEADER */}
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-4 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {user?.pharmacyName || 'My Pharmacy'}
          </h1>
          <p className="text-gray-500 font-medium">Operator: {user?.username}</p>
        </div>
        
        <button 
          onClick={() => setIsSaleModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>🛒</span> New Sale
        </button>
      </header>
      
      {/* 2. NOTICES */}
      {stats.notices.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700">
          <h2 className="text-xs font-black text-blue-600 mb-3 tracking-widest uppercase">System Notices</h2>
          {stats.notices.map(ann => (
            <div key={ann._id} className="p-3 border-l-4 border-blue-500 bg-white dark:bg-slate-700 mb-2 rounded-r shadow-sm">
              <p className="text-sm font-bold dark:text-white">{ann.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <LowStockAlert count={stats.lowStock.length} />
        <ExpiringSoonAlert count={stats.expiring.length} />
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-b-4 border-emerald-500">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
            ${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-b-4 border-indigo-500">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Stock</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">{inventory.length}</p>
        </div>
      </div>

      {/* 4. CHARTS & PREDICTIONS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* CHART (Takes 2/3 width) */}
        <div className="lg:col-span-2">
            <SalesChart sales={Array.isArray(sales) ? sales : []} />
        </div>

        {/* 🔮 AI PREDICTIONS WIDGET (Takes 1/3 width) */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-4">
                <span className="text-2xl">🔮</span>
                <div>
                    <h3 className="font-bold text-lg leading-tight">Demand Forecast</h3>
                    <p className="text-xs text-purple-200">AI-Powered Stock Predictions</p>
                </div>
            </div>

            <div className="space-y-3">
                {predictions.length > 0 ? predictions.slice(0, 4).map((p, idx) => (
                    <div key={idx} className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm">{p.name}</span>
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                                {p.daysLeft === 0 ? 'Today' : `${p.daysLeft} Days`}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-purple-100">
                            <span>Selling {p.dailyRate}/day</span>
                            <span>Stock: {p.currentStock}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-purple-200 text-sm">
                        <p className="mb-2">✨ All good!</p>
                        <p className="text-xs opacity-70">No immediate stock-outs predicted based on sales trends.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 5. INTELLIGENT FEEDS (Top Selling & Recent) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6 border-b pb-2 dark:border-slate-700">
            <h3 className="font-black dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
              <span>🔥</span> Best Selling
            </h3>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold uppercase">Trending</span>
          </div>

          {stats.topSelling.length > 0 ? (
            stats.topSelling.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-gray-100 text-gray-600' : 
                    index === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <span className="text-sm font-bold dark:text-gray-200 capitalize">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="block font-black text-lg dark:text-white">{item.count}</span>
                  <span className="text-[10px] text-gray-400 uppercase">Units</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm italic">No sales data yet.</div>
          )}
        </div>
        
        {/* Recent Arrivals */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6 border-b pb-2 dark:border-slate-700">
            <h3 className="font-black dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
              <span>📥</span> Recent Stock
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold uppercase">Log</span>
          </div>

          {stats.recentM.length > 0 ? stats.recentM.map(m => (
            <div key={m._id} className="flex justify-between items-center py-3 border-b dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 px-2 rounded transition-colors">
              <span className="text-sm font-bold dark:text-gray-200">{m.name}</span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900">
                +{m.quantity ?? m.stock} UNITS
              </span>
            </div>
          )) : <p className="text-center py-8 text-gray-400 text-sm italic">No inventory added yet.</p>}
        </div>
      </div>

      {/* 6. RECORD SALE MODAL */}
      {isSaleModalOpen && (
        <RecordSaleModal 
          isOpen={isSaleModalOpen} 
          onClose={() => setIsSaleModalOpen(false)} 
          onSuccess={() => {
            mutateSales();     
            mutateInventory(); 
          }} 
        />
      )}
    </div>
  );
};

export default DashboardPage;