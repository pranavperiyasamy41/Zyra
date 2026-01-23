import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  count: number;
}

const LowStockAlert: React.FC<Props> = ({ count }) => {
  return (
    <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Low Stock Alerts</p>
          <p className="text-4xl font-black text-gray-800 dark:text-white">{count}</p>
        </div>
        <span className="text-2xl">🚨</span>
      </div>
      
      {/* ✅ FIXED LINK: Added '/' at the start */}
      <Link 
        to="/inventory?filter=low-stock" 
        className="text-xs font-bold text-red-500 hover:text-red-700 mt-4 block underline decoration-red-500/30"
      >
        View Inventory to Restock →
      </Link>
    </div>
  );
};

export default LowStockAlert;