import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast'; 
import { 
  ShoppingCart, 
  ScanBarcode, 
  Search, 
  User, 
  Phone, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  X,
  Zap,
  Ticket,
  Receipt,
  IndianRupee
} from 'lucide-react';

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

const formatRupee = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const RecordSaleModal: React.FC<RecordSaleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { data: inventoryData } = useSWR(isOpen ? '/medicines' : null, fetcher);
  const inventory = useMemo(() => inventoryData?.data || [], [inventoryData]);

  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qtyInput, setQtyInput] = useState(1);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredMeds = useMemo(() => {
    if (!searchTerm || !Array.isArray(inventory)) return [];
    return inventory
      .filter(m => 
        (m.stock > 0) &&
        (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         m.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (m.barcode && m.barcode === searchTerm)) 
      )
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [searchTerm, inventory]);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(filteredMeds.length > 0 ? 0 : -1);
  }, [searchTerm, filteredMeds.length]);

  const selectedMedicine = Array.isArray(inventory) ? inventory.find(m => m._id === selectedMedId) : null;

  const handleAddToCart = (overrideMed?: Medicine) => {
    const medToAdd = overrideMed || selectedMedicine;

    if (!medToAdd) return;
    if (qtyInput <= 0) return toast.error("Quantity must be at least 1");
    if (qtyInput > medToAdd.stock) return toast.error(`Only ${medToAdd.stock} units available in this batch!`);

    const existingItemIndex = cart.findIndex(item => item.medicineId === medToAdd._id);
    
    if (existingItemIndex > -1) {
      const newQty = cart[existingItemIndex].quantity + qtyInput;
      if (newQty > medToAdd.stock) {
        return toast.error(`Cannot add more. Total would exceed batch stock of ${medToAdd.stock}.`);
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
    
    // Reset State
    setSearchTerm('');
    setSelectedMedId('');
    setQtyInput(1);
    setHighlightedIndex(-1);
    
    // Return focus to search for rapid entry
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (filteredMeds.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredMeds.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredMeds.length) {
        const selected = filteredMeds[highlightedIndex];
        setSearchTerm(selected.name); // Show name in input
        setSelectedMedId(selected._id);
        setHighlightedIndex(-1); // Clear highlight
        // Move focus to quantity
        setTimeout(() => quantityInputRef.current?.focus(), 50);
      }
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedMedId) {
        handleAddToCart();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setQtyInput(prev => prev + 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setQtyInput(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeydown = (e: KeyboardEvent) => {
        // Prevent interactions if focus is inside inputs handled separately
        if (document.activeElement === searchInputRef.current || document.activeElement === quantityInputRef.current) {
            if (e.key === 'Escape') {
                 // Allow escape to close modal even from inputs
                 onClose();
            }
            return; 
        }

        if (e.key === 'F2') {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
        
        if (e.key === 'Escape') {
            onClose();
        }

        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [isOpen, cart, searchTerm, filteredMeds]); // Re-bind if dependencies change (though refs are stable)

  // ... (rest of logic like update/remove) ...

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;

    const item = cart[index];
    const stockItem = inventory.find(inv => inv._id === item.medicineId);
    const maxStock = stockItem ? stockItem.stock : item.quantity;

    if (newQty > maxStock) return; 

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

  const handleSubmit = async () => {
    if (cart.length === 0) return toast.error("Cart is empty!");
    
    if (customerMobile && !/^\d{10}$/.test(customerMobile)) {
        return toast.error("Please enter a valid 10-digit mobile number.");
    }

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
      toast.success("Sale Recorded Successfully!");
      setCart([]);
      setCustomerName('');
      setCustomerMobile('');
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to record sale.");
      setLoading(false);
    }
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen bg-slate-900/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-md transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-4xl flex flex-col h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Premium Header */}
        <div 
          style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
          className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 text-white flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
              <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" /> 
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Quick Sale Terminal</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-red-200 transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* LEFT PANEL: Inputs & Search (60%) */}
            <div className="w-full md:w-3/5 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50 flex flex-col h-full">
                
                {/* 1. Customer Section */}
                <div className="p-6 pb-0 shrink-0">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
                        <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-500" /> Customer Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    className="w-full pl-4 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="Mobile Number"
                                    value={customerMobile}
                                    onChange={e => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Add Items Section (Sticky within Left Panel) */}
                <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-transparent transition-all shrink-0">
                    <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ScanBarcode className="w-4 h-4 text-teal-500" /> Add Items to Cart
                    </h3>
                    
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1 group">
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-colors" />
                            <input 
                                ref={searchInputRef}
                                type="text" 
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 dark:text-white shadow-sm"
                                placeholder="Scan or Search Item..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setSelectedMedId(''); }}
                                onKeyDown={handleSearchKeyDown}
                                autoFocus
                            />
                            
                            {/* PREDICTIVE DROPDOWN */}
                            {searchTerm && !selectedMedId && filteredMeds.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl border border-white/20 dark:border-slate-800 max-h-80 overflow-y-auto z-50 custom-scrollbar p-2">
                                    {filteredMeds.map((m, index) => (
                                        <div 
                                            key={m._id} 
                                            onClick={() => { setSearchTerm(`${m.name}`); setSelectedMedId(m._id); setTimeout(() => quantityInputRef.current?.focus(), 50); }}
                                            className={`p-4 rounded-xl cursor-pointer transition-all group/item border-b border-dashed border-slate-100 dark:border-slate-800 last:border-0 mb-1 ${
                                                index === highlightedIndex 
                                                ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg scale-[1.01]' 
                                                : 'hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-black text-sm ${index === highlightedIndex ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{m.name}</span>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${index === highlightedIndex ? 'bg-white/20 text-white' : 'bg-[#CDEB8B] text-[#064E48]'}`}>
                                                    {formatRupee(m.price || m.mrp || 0)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center opacity-80">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${index === highlightedIndex ? 'text-emerald-100' : 'text-slate-400'}`}>Batch: {m.batchId}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${index === highlightedIndex ? 'text-emerald-100' : 'text-slate-500'}`}>In Stock: {m.stock}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input 
                            ref={quantityInputRef}
                            type="number" 
                            min="1"
                            className="w-20 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-center font-black text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white shadow-sm"
                            value={qtyInput}
                            onChange={e => setQtyInput(parseInt(e.target.value) || 1)}
                            onKeyDown={handleQuantityKeyDown}
                        />
                    </div>

                    <button 
                        onClick={() => handleAddToCart()}
                        disabled={!selectedMedId && filteredMeds.length === 0}
                        className="w-full py-4 bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white rounded-xl font-black shadow-lg shadow-brand-btn-start/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-xs"
                    >
                        <Plus className="w-5 h-5" /> Add Item to Cart
                    </button>
                </div>

                {/* Quick Tips */}
                <div className="p-6 pt-0 mt-auto flex gap-4 justify-center text-[10px] font-bold text-black dark:text-white uppercase tracking-wider opacity-60 shrink-0">
                    <span className="flex items-center gap-1"><span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">F2</span> Search</span>
                    <span className="flex items-center gap-1"><span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">Enter</span> Add</span>
                </div>
            </div>

            {/* RIGHT PANEL: Cart & Total (40%) */}
            <div className="w-full md:w-2/5 bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-800 flex flex-col h-full relative z-0">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0">
                    <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-teal-500" /> Current Order
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/20">
                    {cart.length > 0 ? cart.map((item, index) => (
                        <div key={index} className="relative group bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:border-teal-100 dark:hover:border-teal-900">
                            <div className="absolute left-0 top-1/2 -mt-2 -ml-1.5 w-3 h-3 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                            <div className="absolute right-0 top-1/2 -mt-2 -mr-1.5 w-3 h-3 bg-slate-50 dark:bg-slate-900 rounded-full"></div>
                            
                            <div className="flex justify-between items-start mb-3 px-1">
                                <div>
                                    <h4 className="font-black text-slate-800 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 font-mono">{item.batchId}</p>
                                </div>
                                <p className="font-black text-teal-600 dark:text-teal-400 text-sm">{formatRupee(item.total)}</p>
                            </div>

                            <div className="flex justify-between items-center border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 mt-3 px-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                    <span>{formatRupee(item.price)}</span>
                                    <span className="text-slate-300">× {item.quantity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                                        <button onClick={() => handleUpdateQuantity(index, item.quantity - 1)} className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 transition-all shadow-sm"><Minus className="w-3 h-3"/></button>
                                        <span className="w-6 text-center font-black text-xs text-slate-700 dark:text-slate-200">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(index, item.quantity + 1)} className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 transition-all shadow-sm"><Plus className="w-3 h-3"/></button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(index)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <IndianRupee className="w-8 h-8" />
                            </div>
                            <p className="text-slate-400 font-bold">Your cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Total & Checkout (Fixed at bottom) */}
                <div className="p-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-20 shrink-0">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-black text-black dark:text-white uppercase tracking-widest">Total Amount</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                            {formatRupee(grandTotal)}
                        </span>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group relative w-full overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white py-4 rounded-xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {loading ? 'Processing Sale...' : (
                            <>
                                <CreditCard className="w-5 h-5" /> Confirm Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default RecordSaleModal;