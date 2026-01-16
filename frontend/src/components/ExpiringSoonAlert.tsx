import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  count: number;
}

const ExpiringSoonAlert: React.FC<Props> = ({ count }) => {
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-l-4 border-amber-500 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Expiring Soon Alerts</p>
          <p className="text-4xl font-black text-gray-800 dark:text-white">{count}</p>
        </div>
        <span className="text-2xl">⚠️</span>
      </div>

      {/* ✅ THE FIX: Added '/' before inventory */}
      <Link 
        to="/inventory?filter=expiring" 
        className="text-xs font-bold text-amber-600 hover:text-amber-800 mt-4 block underline decoration-amber-500/30"
      >
        Review Expiry Dates →
      </Link>
    </div>
  );
};

export default ExpiringSoonAlert;