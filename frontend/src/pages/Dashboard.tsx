import React, { useMemo } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import LowStockAlert from '../components/LowStockAlert';
import ExpiringSoonAlert from '../components/ExpiringSoonAlert';
import SalesChart from '../components/SalesChart';

interface Medicine { _id: string; name: string; quantity: number; expiryDate: string; createdAt: string; }
interface Sale { _id: string; items: Array<{ name: string; quantity: number }>; totalAmount: number; createdAt: string; }
interface Announcement { _id: string; title: string; content: string; type: string; createdAt: string; }

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: inventory = [], isLoading: loadingInv } = useSWR<Medicine[]>('/medicines', fetcher);
  const { data: sales = [], isLoading: loadingSales } = useSWR<Sale[]>('/sales', fetcher);
  const { data: announcements = [] } = useSWR<Announcement[]>('/announcements', fetcher);

  const stats = useMemo(() => {
    const safeInventory = Array.isArray(inventory) ? inventory : [];
    const safeSales = Array.isArray(sales) ? sales : [];
    const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    const lowStock = safeInventory.filter(i => i.quantity > 0 && i.quantity <= 10);
    const expiring = safeInventory.filter(i => {
      const d = new Date(i.expiryDate);
      return d > today && d <= thirtyDays && i.quantity > 0;
    });

    const revenue = safeSales.reduce((acc, s) => acc + (s?.totalAmount || 0), 0);
    
    // --- 🧠 SMART LOGIC: Calculate Top Selling Items ---
    const productPerformance: Record<string, number> = {};
    safeSales.forEach(sale => {
      sale.items?.forEach(item => {
        if (item.name) {
          productPerformance[item.name] = (productPerformance[item.name] || 0) + item.quantity;
        }
      });
    });

    // Convert to array and sort by quantity sold (Highest first)
    const topSelling = Object.entries(productPerformance)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 only

    // Keep the "Recently Added Stock" as an audit trail
    const recentM = [...safeInventory]
      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const notices = safeAnnouncements.filter(a => a.type === 'system');

    return { lowStock, expiring, revenue, topSelling, recentM, notices };
  }, [inventory, sales, announcements]);

  if (loadingInv || loadingSales) return <div className="p-8 dark:text-slate-300">Loading Dashboard...</div>;

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            {user?.pharmacyName || 'My Pharmacy'}
          </h1>
          <p className="text-gray-500 font-medium">Operator: {user?.username}</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-gray-400 uppercase">Today's Date</p>
          <p className="text-xl font-bold dark:text-white">{new Date().toLocaleDateString()}</p>
        </div>
      </header>
      
      {stats.notices.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xs font-black text-blue-600 mb-3 tracking-widest uppercase">System Notices</h2>
          {stats.notices.map(ann => (
            <div key={ann._id} className="p-3 border-l-4 border-blue-500 bg-white dark:bg-slate-700 mb-2 shadow-sm rounded-r">
              <p className="text-sm font-bold dark:text-white">{ann.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      {/* Sales Chart */}
      <div className="mb-8">
        <SalesChart sales={Array.isArray(sales) ? sales : []} />
      </div>

      {/* INTELLIGENT FEEDS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 🔥 NEW: Top Selling Products Analysis */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border dark:border-slate-700">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h3 className="font-black dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
              <span>🔥</span> Best Selling Products
            </h3>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold uppercase">Trending</span>
          </div>

          {stats.topSelling.length > 0 ? (
            stats.topSelling.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-gray-100 text-gray-600' : 
                      index === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500'}
                  `}>
                    #{index + 1}
                  </div>
                  <span className="text-sm font-bold dark:text-gray-200 capitalize">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-black text-lg dark:text-white">{item.count}</span>
                  <span className="text-[10px] text-gray-400 uppercase">Units Sold</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm italic">Not enough data to calculate trends yet.</p>
            </div>
          )}
        </div>
        
        {/* Recent Stock (Audit Log) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border dark:border-slate-700">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h3 className="font-black dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
              <span>📥</span> Recent Arrivals
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold uppercase">Stock Log</span>
          </div>

          {stats.recentM.length > 0 ? stats.recentM.map(m => (
            <div key={m._id} className="flex justify-between items-center py-3 border-b dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-700/50 px-2 transition-colors rounded">
              <span className="text-sm font-bold dark:text-gray-200">{m.name}</span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-900">
                +{m.quantity} UNITS
              </span>
            </div>
          )) : <p className="text-gray-400 text-xs italic">No inventory added recently.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;