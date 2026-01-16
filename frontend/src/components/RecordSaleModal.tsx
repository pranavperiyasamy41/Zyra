import React, { useState, useMemo, useEffect, useRef } from 'react';
import useSWR from 'swr';
import apiClient from '../api';

// --- Interfaces ---
interface Medicine {
  _id: string;
  name: string;
  barcode?: string;
  batchId: string;
  stock: number;
  mrp?: number;
  price?: number;
  expiryDate: string;
}

interface CartItem {
  medicineId: string;
  name: string;
  batchId: string;
  quantity: number;
  price: number;
  total: number;
}

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

const RecordSaleModal: React.FC<RecordSaleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // 1. Fetch Inventory
  const { data: inventory = [] } = useSWR<Medicine[]>(isOpen ? '/medicines' : null, fetcher);

  // 2. Form State
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Selection State
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qtyInput, setQtyInput] = useState(1);
  const [loading, setLoading] = useState(false);

  // ⚡ REF FOR KEYBOARD FOCUS
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 3. Search Filtering
  const filteredMeds = useMemo(() => {
    if (!searchTerm) return [];
    return inventory
      .filter(m => 
        (m.stock > 0) &&
        (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         m.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (m.barcode && m.barcode === searchTerm)) 
      )
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [searchTerm, inventory]);

  const selectedMedicine = inventory.find(m => m._id === selectedMedId);

  // 4. Add Item to Cart
  const handleAddToCart = (overrideMed?: Medicine) => {
    const medToAdd = overrideMed || selectedMedicine;

    if (!medToAdd) return;
    if (qtyInput <= 0) return alert("Quantity must be at least 1");
    if (qtyInput > medToAdd.stock) return alert(`Only ${medToAdd.stock} units available in this batch!`);

    const existingItemIndex = cart.findIndex(item => item.medicineId === medToAdd._id);
    
    if (existingItemIndex > -1) {
      const newQty = cart[existingItemIndex].quantity + qtyInput;
      if (newQty > medToAdd.stock) {
        return alert(`Cannot add more. Total would exceed batch stock of ${medToAdd.stock}.`);
      }
      handleUpdateQuantity(existingItemIndex, newQty);
    } else {
      const finalPrice = medToAdd.price || medToAdd.mrp || 0;
      const newItem: CartItem = {
        medicineId: medToAdd._id,
        name: medToAdd.name,
        batchId: medToAdd.batchId,
        quantity: qtyInput,
        price: finalPrice,
        total: finalPrice * qtyInput
      };
      setCart([...cart, newItem]);
    }
    
    setSearchTerm('');
    setSelectedMedId('');
    setQtyInput(1);
    // Keep focus on search after adding for rapid scanning
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // 🔫 HANDLE BARCODE SCAN (Enter Key on Input)
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        const scannedMed = inventory.find(m => m.barcode === searchTerm && m.stock > 0);
        const topResult = filteredMeds.length > 0 ? filteredMeds[0] : null;
        const target = scannedMed || topResult;

        if (target) {
            handleAddToCart(target);
        }
    }
  };

  // 🎹 GLOBAL KEYBOARD SHORTCUTS
  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeydown = (e: KeyboardEvent) => {
        // F2: Focus Search
        if (e.key === 'F2') {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
        
        // Escape: Close
        if (e.key === 'Escape') {
            onClose();
        }

        // Ctrl + Enter: Checkout
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }

        // SHORTCUTS FOR LAST ITEM (Shift + Arrows)
        if (cart.length > 0) {
            const lastIdx = cart.length - 1;
            const lastItem = cart[lastIdx];

            // Shift + Up: Increase Qty
            if (e.shiftKey && e.key === 'ArrowUp') {
                e.preventDefault();
                handleUpdateQuantity(lastIdx, lastItem.quantity + 1);
            }

            // Shift + Down: Decrease Qty
            if (e.shiftKey && e.key === 'ArrowDown') {
                e.preventDefault();
                handleUpdateQuantity(lastIdx, lastItem.quantity - 1);
            }

            // Delete: Remove Last Item (Only if search is empty to prevent accidental deletes while typing)
            if (e.key === 'Delete' && searchTerm === '') {
                handleRemoveItem(lastIdx);
            }
        }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [isOpen, cart, searchTerm, filteredMeds]); // Dependencies important for state access

  // Handle Quantity Edit
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;

    const item = cart[index];
    const stockItem = inventory.find(inv => inv._id === item.medicineId);
    const maxStock = stockItem ? stockItem.stock : item.quantity;

    if (newQty > maxStock) {
      // Don't alert on keyboard shortcut to keep flow smooth, just stop.
      return; 
    }

    const updatedCart = [...cart];
    updatedCart[index] = {
      ...item,
      quantity: newQty,
      total: item.price * newQty
    };
    setCart(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // 5. Submit Sale
  const handleSubmit = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setLoading(true);

    try {
      const payload = {
        customerName: customerName || 'Guest',
        customerMobile: customerMobile || '',
        items: cart.map(item => ({
          medicineId: item.medicineId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.total, 0)
      };

      await apiClient.post('/sales', payload);
      alert("✅ Sale Recorded Successfully!");
      setCart([]);
      setCustomerName('');
      setCustomerMobile('');
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to record sale.");
      setLoading(false);
    }
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-white font-black text-lg uppercase tracking-wider flex items-center gap-2">
            <span>🛒</span> New Quick Sale
          </h2>
          <div className='flex gap-4 items-center'>
            <div className="hidden md:flex gap-2 text-[10px] text-emerald-100 font-mono">
                <span>[F2] Search</span>
                <span>[Shift+↑] +Qty</span>
                <span>[Ctrl+Ent] Pay</span>
            </div>
            <button onClick={onClose} className="text-white hover:text-red-200 font-bold text-xl px-2">&times;</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Customer Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-emerald-50 dark:bg-slate-700/50 p-4 rounded-xl border border-emerald-100 dark:border-slate-600">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1">Customer Name</label>
              <input 
                type="text" 
                className="w-full p-2 rounded border dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Optional"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1">Mobile</label>
              <input 
                type="text" 
                className="w-full p-2 rounded border dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 9876543210"
                value={customerMobile}
                onChange={e => setCustomerMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Search Bar (SCANNER READY) */}
          <div className="mb-6 relative z-10">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1">
                Scan Barcode 🔫 or Search Name (F2)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  ref={searchInputRef} // 👈 REF ATTACHED HERE
                  type="text" 
                  className="w-full p-3 rounded-l-lg border border-r-0 border-gray-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none"
                  placeholder="Focus here & Scan Barcode..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setSelectedMedId(''); }}
                  onKeyDown={handleInputKeyDown}
                  autoFocus
                />
                
                {/* SEARCH RESULTS DROPDOWN */}
                {searchTerm && !selectedMedId && filteredMeds.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white dark:bg-slate-700 border shadow-xl max-h-60 overflow-auto rounded-b-lg mt-1 dark:border-slate-600 z-50">
                    {filteredMeds.map((m, index) => {
                      const daysToExpiry = Math.ceil((new Date(m.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isExpiring = daysToExpiry < 30;

                      return (
                        <li 
                          key={m._id} 
                          className="p-3 hover:bg-emerald-50 dark:hover:bg-slate-600 cursor-pointer border-b dark:border-slate-600 last:border-0 flex justify-between items-center group"
                          onClick={() => { setSearchTerm(`${m.name} (${m.batchId})`); setSelectedMedId(m._id); }}
                        >
                          <div>
                            <div className="font-bold dark:text-white text-sm">
                                {m.name} <span className="text-xs text-gray-500 font-mono ml-1">[{m.batchId}]</span>
                            </div>
                            <div className={`text-xs ${isExpiring ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                Exp: {new Date(m.expiryDate).toLocaleDateString()} {index === 0 && <span className="bg-blue-100 text-blue-600 px-1 rounded ml-1 text-[10px]">FIFO</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            {m.barcode && <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded mr-1">🔫 {m.barcode}</span>}
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">Stock: {m.stock}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-300 block mt-1">${m.price || m.mrp || 0}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <input 
                type="number" 
                min="1"
                className="w-20 p-3 border-y border-gray-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 text-center font-bold"
                value={qtyInput}
                onChange={e => setQtyInput(parseInt(e.target.value) || 1)}
              />
              <button 
                onClick={() => handleAddToCart()}
                disabled={!selectedMedId && filteredMeds.length === 0}
                className="bg-emerald-600 text-white px-6 rounded-r-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD
              </button>
            </div>
          </div>

          {/* Cart Table */}
          <div className="bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden border dark:border-slate-700 min-h-[150px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Batch</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-300">
                {cart.length > 0 ? cart.map((item, index) => (
                  <tr key={index} className={`border-b dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors ${index === cart.length - 1 ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}`}>
                    <td className="p-3 font-medium">
                        {item.name}
                        {index === cart.length - 1 && <span className="ml-2 text-[10px] text-emerald-600 font-bold animate-pulse">● LAST</span>}
                    </td>
                    <td className="p-3 text-center text-xs font-mono text-gray-500">{item.batchId}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleUpdateQuantity(index, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 font-bold">-</button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(index, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 font-bold">+</button>
                      </div>
                    </td>
                    <td className="p-3 text-right">${item.price}</td>
                    <td className="p-3 text-right font-bold text-gray-900 dark:text-white">${item.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Cart is empty. Scan items to begin.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 dark:bg-slate-900 p-4 border-t dark:border-slate-700 flex justify-between items-center rounded-b-2xl">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Total Payable</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${grandTotal.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-bold hover:bg-gray-200 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700">Cancel</button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : '✅ Checkout (Ctrl+Enter)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordSaleModal;