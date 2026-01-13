import React from 'react';
import { Link } from 'react-router-dom';

const LowStockAlert = ({ count }: { count: number }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg border-l-4 ${
        count > 0 ? 'bg-red-100 dark:bg-red-900/40 border-red-500' : 'bg-white dark:bg-slate-800 border-green-500'
    }`}>
      <p className="text-sm font-semibold uppercase text-gray-500 dark:text-slate-400">Low Stock Alerts</p>
      <p className={`text-4xl font-extrabold mt-2 ${count > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{count}</p>
      {count > 0 && (
        // ✅ FIXED: Changed path back to /dashboard/inventory
        <Link to="/dashboard/inventory?filter=low-stock" className="text-xs font-medium text-red-500 hover:text-red-700 mt-2 block">
          View Inventory to Restock
        </Link>
      )}
    </div>
  );
};
export default LowStockAlert;