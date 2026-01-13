import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import apiClient from '../api';

// --- Interfaces ---
interface Medicine {
  _id: string;
  name: string;
  quantity: number;
  mrp?: number;
  price?: number;
}

interface CartItem {
  medicineId: string;
  name: string;
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

  // 3. Search Filtering
  const filteredMeds = useMemo(() => {
    if (!searchTerm) return [];
    return inventory.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.quantity > 0
    );
  }, [searchTerm, inventory]);

  const selectedMedicine = inventory.find(m => m._id === selectedMedId);

  // 4. Add Item to Cart
  const handleAddToCart = () => {
    if (!selectedMedicine) return;
    if (qtyInput <= 0) return alert("Quantity must be at least 1");
    if (qtyInput > selectedMedicine.quantity) return alert(`Only ${selectedMedicine.quantity} units available!`);

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.medicineId === selectedMedicine._id);
    
    if (existingItemIndex > -1) {
      // If exists, just update quantity (checking limits)
      const newQty = cart[existingItemIndex].quantity + qtyInput;
      if (newQty > selectedMedicine.quantity) {
        return alert(`Cannot add more. Total would exceed stock of ${selectedMedicine.quantity}.`);
      }
      handleUpdateQuantity(existingItemIndex, newQty);
    } else {
      // Add new item
      const finalPrice = selectedMedicine.mrp || selectedMedicine.price || 0;
      const newItem: CartItem = {
        medicineId: selectedMedicine._id,
        name: selectedMedicine.name,
        quantity: qtyInput,
        price: finalPrice,
        total: finalPrice * qtyInput
      };
      setCart([...cart, newItem]);
    }
    
    // Reset Selection
    setSearchTerm('');
    setSelectedMedId('');
    setQtyInput(1);
  };

  // 🔥 NEW: Handle Quantity Edit
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return; // Prevent going below 1

    const item = cart[index];
    
    // Find live stock limit for this item
    const stockItem = inventory.find(inv => inv._id === item.medicineId);
    const maxStock = stockItem ? stockItem.quantity : item.quantity;

    if (newQty > maxStock) {
      alert(`Max stock reached! Only ${maxStock} units available.`);
      return;
    }

    // Update Cart
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

  // ⚡ Rapid Refill Logic
  const handleRapidRefill = async () => {
    if (!customerMobile || customerMobile.length < 10) {
      alert("Please enter a valid mobile number first.");
      return;
    }
    try {
      const res = await apiClient.get(`/sales/last-order/${customerMobile}`);
      const lastOrder = res.data;
      if (!lastOrder || !lastOrder.items) return;

      const confirmRefill = window.confirm(
        `Found previous order from ${new Date(lastOrder.createdAt).toLocaleDateString()}!\n` +
        `Load items into cart?`
      );
      if (!confirmRefill) return;

      const newCartItems: CartItem[] = [];
      lastOrder.items.forEach((prevItem: any) => {
        const currentStockItem = inventory.find(inv => inv._id === prevItem.medicineId || inv.name === prevItem.name);
        if (currentStockItem) {
          const qtyToAdd = prevItem.quantity <= currentStockItem.quantity ? prevItem.quantity : currentStockItem.quantity;
          if (qtyToAdd > 0) {
            newCartItems.push({
              medicineId: currentStockItem._id,
              name: currentStockItem.name,
              quantity: qtyToAdd,
              price: currentStockItem.price || currentStockItem.mrp || 0,
              total: (currentStockItem.price || currentStockItem.mrp || 0) * qtyToAdd
            });
          }
        }
      });

      if (newCartItems.length > 0) {
        setCart(newCartItems);
        setCustomerName(lastOrder.customerName || '');
      } else {
        alert("Previous items are currently out of stock. 😔");
      }
    } catch (err) {
      alert("No previous order history found.");
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
          <button onClick={onClose} className="text-white hover:text-red-200 font-bold text-xl px-2">&times;</button>
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
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="w-full p-2 rounded border dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 9876543210"
                  value={customerMobile}
                  onChange={e => setCustomerMobile(e.target.value)}
                />
                <button 
                  onClick={handleRapidRefill}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded font-bold shadow-md text-xs flex items-center gap-1 whitespace-nowrap"
                >
                  ⚡ Refill
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative z-10">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-1">Search Inventory</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  className="w-full p-3 rounded-l-lg border border-r-0 border-gray-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none"
                  placeholder="Type medicine name..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setSelectedMedId(''); }}
                />
                {searchTerm && !selectedMedId && filteredMeds.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white dark:bg-slate-700 border shadow-xl max-h-48 overflow-auto rounded-b-lg mt-1 dark:border-slate-600">
                    {filteredMeds.map(m => (
                      <li 
                        key={m._id} 
                        className="p-3 hover:bg-emerald-50 dark:hover:bg-slate-600 cursor-pointer border-b dark:border-slate-600 last:border-0 flex justify-between"
                        onClick={() => { setSearchTerm(m.name); setSelectedMedId(m._id); }}
                      >
                        <span className="font-bold dark:text-white">{m.name}</span>
                        <div className="text-right">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded block">Stock: {m.quantity}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-300">${m.mrp || m.price || 0}</span>
                        </div>
                      </li>
                    ))}
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
                onClick={handleAddToCart}
                disabled={!selectedMedId}
                className="bg-emerald-600 text-white px-6 rounded-r-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ADD
              </button>
            </div>
          </div>

          {/* Cart Table with Editing */}
          <div className="bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden border dark:border-slate-700 min-h-[150px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-300">
                {cart.length > 0 ? cart.map((item, index) => (
                  <tr key={index} className="border-b dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                    <td className="p-3 font-medium">{item.name}</td>
                    
                    {/* 🔥 EDITABLE QUANTITY */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold text-gray-600 dark:text-white flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 font-bold text-gray-600 dark:text-white flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-right">${item.price}</td>
                    <td className="p-3 text-right font-bold text-gray-900 dark:text-white">${item.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 font-bold px-2 hover:bg-red-50 rounded">✕</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 italic">Cart is empty.</td>
                  </tr>
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
              {loading ? 'Processing...' : '✅ Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordSaleModal;