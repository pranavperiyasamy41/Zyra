import React from 'react';
import { Link } from 'react-router-dom';

const ExpiringSoonAlert = ({ count }: { count: number }) => {
  return (
    <div className={`p-6 rounded-xl shadow-lg border-l-4 ${
        count > 0 ? 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-500' : 'bg-white dark:bg-slate-800 border-green-500'
    }`}>
      <p className="text-sm font-semibold uppercase text-gray-500 dark:text-slate-400">Expiring Soon Alerts</p>
      <p className={`text-4xl font-extrabold mt-2 ${count > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>{count}</p>
      {count > 0 && (
        // ✅ FIXED: Changed path back to /dashboard/inventory
        <Link to="/dashboard/inventory?filter=expiring" className="text-xs font-medium text-yellow-500 hover:text-yellow-700 mt-2 block">
          Review Expiry Dates
        </Link>
      )}
    </div>
  );
};
export default ExpiringSoonAlert;