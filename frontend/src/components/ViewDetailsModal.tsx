import React from 'react';

// Define the structure of a Sale specifically for this modal
interface SaleItem {
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  _id: string;
  customerName?: string;
  customerMobile?: string;
  items: SaleItem[];
  totalAmount: number;
  createdAt: string;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // We make this generic or specific. Here we expect a Sale object.
  data: Sale | null; 
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gray-100 dark:bg-slate-900 p-6 border-b dark:border-slate-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-wider">
              🧾 Sale Receipt
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">ID: {data._id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl transition-colors">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Customer & Date Info (NO ID shown here) */}
          <div className="flex justify-between mb-6 text-sm bg-blue-50 dark:bg-slate-700/30 p-4 rounded-lg border border-blue-100 dark:border-slate-700">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Customer</p>
              <p className="font-bold dark:text-white text-lg">{data.customerName || 'Guest'}</p>
              {data.customerMobile && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-1">📞 {data.customerMobile}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Date</p>
              <p className="font-bold dark:text-white">{new Date(data.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">{new Date(data.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="border rounded-xl overflow-hidden dark:border-slate-700 mb-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">
                <tr>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">${item.price}</td>
                    <td className="p-3 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase text-xs tracking-wider">Total Amount</span>
            <span className="font-black text-2xl text-emerald-600 dark:text-white">${data.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-slate-900 p-4 border-t dark:border-slate-700 flex justify-end gap-2">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 text-sm font-bold"
          >
            🖨️ Print
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;