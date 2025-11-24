import React, { useState, useEffect } from 'react';
import { type Medicine, useAllMedicines } from '../hooks/useMedicines';
import { useSalesHistory } from '../hooks/useSales';
import apiClient from '../api';

// Define the structure of an item IN THE CART
interface CartItem extends Medicine {
  quantityToSell: number; // The actual quantity the customer wants
}

interface ShoppingCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCart: Medicine[]; // The list of items selected from the table
  setInitialCart: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ isOpen, onClose, initialCart, setInitialCart }) => {
  
  // --- State for Modal Flow ---
  const [step, setStep] = useState(1); // 1: Cart, 2: Customer Details
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    customerId: '',
  });
  

  // --- State for UI ---
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mutate hooks to refresh tables
  const { mutate: mutateInventory } = useAllMedicines();
  const { mutate: mutateSales } = useSalesHistory();

  // --- Effect to set initial cart items ---
  useEffect(() => {
    if (isOpen && initialCart.length > 0) {
      // Map initial selection to the CartItem structure, setting initial quantity to 1
      setCartItems(initialCart.map(med => ({ ...med, quantityToSell: 1 } as CartItem)));
      setStep(1);
    }
    if (!isOpen) {
        setCustomerDetails({ name: '', phone: '', customerId: '' }); // Reset customer info
        // We also need to reset the cart in InventoryPage, which is done by setInitialCart([]) in handleFinalSell
    }
  }, [isOpen, initialCart]);

  // --- Cart Manipulation ---
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(currentItems => 
      currentItems.map(item => {
        if (item._id === id) {
          const newQty = item.quantityToSell + delta;
          // Ensure quantity is >= 1 and <= available stock
          if (newQty < 1 || newQty > item.quantity) {
              return item; 
          }
          return { ...item, quantityToSell: newQty };
        }
        return item;
      })
    );
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantityToSell * item.mrp), 0);
  };

  // --- Step 1 Handler: Confirm Cart ---
  const handleConfirmCart = () => {
    if (cartItems.length === 0) {
      setError("Please add at least one item to the cart.");
      return;
    }
    setStep(2);
  };

  // --- Step 2 Handler: Final Sell ---
  const handleFinalSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Generate Customer ID if not provided (between 100 and 200)
   const finalCustomerId = customerDetails.customerId || 
      (Math.floor(Math.random() * (10000 - 100 + 1)) + 100).toString(); // Range: 100-10000

    try {
      // 1. Format data for the backend
      const saleData = {
        itemsSold: cartItems.map(item => ({
          medicine: item._id,
          medicineName: item.name,
          quantitySold: item.quantityToSell,
          pricePerUnit: item.mrp,
        })),
        totalAmount: calculateTotal(),
        customerName: customerDetails.name,
        customerPhone: customerDetails.phone,
        customerId: finalCustomerId,
      };

      // 2. Call the backend API
      await apiClient.post('/sales', saleData);

      // 3. Refresh BOTH tables and close
      mutateInventory(); 
      mutateSales();
      
      setLoading(false);
      setInitialCart([]); // Clear the cart selection in the parent page
      onClose();
      
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.error || err.response?.data?.message || 'Sale failed. Check stock levels.');
    }
  };

  if (!isOpen) return null;
  
  // Helper to determine the content of the modal body
  const modalContent = () => {
    if (step === 1) {
      return (
        // --- Step 1: Cart Review ---
        <>
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Review Cart ({cartItems.length} Items)</h3>
          <ul className="divide-y divide-gray-200 dark:divide-slate-700 max-h-60 overflow-y-auto mb-4">
            {cartItems.map(item => (
              <li key={item._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">${item.mrp.toFixed(2)} ea. (Stock: {item.quantity})</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(item._id, -1)}
                    className="h-7 w-7 rounded-full border border-red-400 text-red-500 hover:bg-red-50 text-xl leading-none dark:hover:bg-red-900/50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold dark:text-white">
                    {item.quantityToSell}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => updateQuantity(item._id, 1)}
                    className="h-7 w-7 rounded-full border border-green-400 text-green-500 hover:bg-green-50 text-xl leading-none dark:hover:bg-green-900/50"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-slate-700 dark:text-white">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="button" 
              onClick={handleConfirmCart}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              disabled={cartItems.length === 0}
            >
              Confirm & Add Customer Details
            </button>
          </div>
        </>
      );
    }
    
    if (step === 2) {
      return (
        // --- Step 2: Customer Details ---
        <form onSubmit={handleFinalSell}>
          <h3 className="text-xl font-semibold mb-4 dark:text-white">Customer Details</h3>
          
          {/* Customer Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Customer Name</label>
            <input type="text" name="name" required value={customerDetails.name} 
              onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          
          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Phone Number</label>
            <input type="text" name="phone" value={customerDetails.phone} 
              onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          
          {/* Existing Customer ID (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Existing Customer ID (Optional)</label>
            <input type="text" name="customerId" value={customerDetails.customerId} 
              onChange={(e) => setCustomerDetails({...customerDetails, customerId: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">If left blank, a random ID (100-200) will be generated.</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t dark:border-slate-700">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  ← Back to Cart
              </button>
              <button type="submit" disabled={loading} className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-green-400">
                  {loading ? 'Finalizing...' : `Final Sell ($${calculateTotal().toFixed(2)})`}
              </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:border dark:border-slate-700">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white">Record New Sale</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 text-2xl leading-none">
                &times;
            </button>
        </div>
        <p className="mt-2 mb-6 text-sm text-gray-500 dark:text-slate-400">
            Step {step} of 2: {step === 1 ? 'Select Quantities' : 'Finalize Customer'}
        </p>
        
        {error && <p className="mb-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900/30 dark:text-red-300">{error}</p>}
        
        {modalContent()}
      </div>
    </div>
  );
};

export default ShoppingCartModal;