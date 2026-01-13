import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import ViewDetailsModal from '../components/ViewDetailsModal'; // ✅ Reusing your existing component

interface Sale {
  _id: string;
  customerName?: string;   // ✅ No ID, just Name
  customerMobile?: string; // ✅ No ID, just Mobile
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SalesPage: React.FC = () => {
  const { data: sales = [], isLoading } = useSWR<Sale[]>('/sales', fetcher);
  
  // State for the View Modal
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Search by Name or Mobile
  const filteredSales = Array.isArray(sales) ? sales.filter(s => 
    (s.customerName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.customerMobile?.includes(searchTerm))
  ) : [];

  if (isLoading) return <div className="p-8 dark:text-white">Loading Sales History...</div>;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Sales History</h1>
          <p className="text-gray-500">View past transactions</p>
        </div>
        
        <input 
          type="text" 
          placeholder="Search Customer or Mobile..." 
          className="w-full md:w-80 p-3 rounded-xl border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                  
                  {/* 📅 Date */}
                  <td className="p-4">
                    <div className="font-bold text-gray-800 dark:text-white text-sm">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                  </td>

                  {/* 👤 Customer (Name + Mobile) */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900 dark:text-gray-200 text-sm">
                      {sale.customerName || 'Guest'}
                    </div>
                    {sale.customerMobile && (
                      <div className="text-xs text-blue-500 font-mono tracking-wide">{sale.customerMobile}</div>
                    )}
                  </td>

                  {/* 📦 Items Summary */}
                  <td className="p-4">
                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs font-bold">
                      {sale.items.length} Items
                    </span>
                  </td>

                  {/* 💰 Amount */}
                  <td className="p-4 text-right">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ${sale.totalAmount.toFixed(2)}
                    </span>
                  </td>

                  {/* 👁️ View Button */}
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedSale(sale)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 italic">No sales found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ USING EXISTING COMPONENT */}
      <ViewDetailsModal 
        isOpen={!!selectedSale} 
        onClose={() => setSelectedSale(null)} 
        data={selectedSale} 
      />
    </div>
  );
};

export default SalesPage;