import { useState, useMemo } from 'react';
import { useSalesHistory, type Sale } from '../hooks/useSales';
import ViewDetailsModal from '../components/ViewDetailsModal'; // Assuming this is imported/created

const SalesPage = () => {
  const { sales, isLoading, isError } = useSalesHistory();
  
  // --- New State for Search and Sort ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Date sort
  
  // State for the View Details Modal
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // --- 1. Filter and Sort Logic (Correctly placed inside the component) ---
  const sortedAndFilteredSales = useMemo(() => {
    if (!sales) return [];

    // Create a fresh copy of the array for filtering
    let result = sales.slice(); 

    // Filter by Customer Name or ID
    if (searchTerm) {
      result = result.filter(sale => 
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by Date
    // Note: Result is already a copy, so we sort it directly
    result.sort((a, b) => {
      const dateA = new Date(a.saleDate).getTime();
      const dateB = new Date(b.saleDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [sales, searchTerm, sortOrder]);
  
  // --- Loading/Error States ---
  if (isLoading) return <div className="p-8 dark:text-slate-300">Loading sales history...</div>;
  if (isError) return <div className="p-8 text-red-500">Failed to load sales</div>;
  
  // --- JSX Render ---
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sales History</h1>

      {/* --- Search, Filter, and Sort Controls --- */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Customer Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />

        {/* Sort by Date Button */}
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300"
        >
          Sort by Date: {sortOrder === 'desc' ? 'Newest ↓' : 'Oldest ↑'}
        </button>
      </div>

      {/* --- Sales Table --- */}
      <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">S.No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {sortedAndFilteredSales.length > 0 ? (
              sortedAndFilteredSales.map((sale: Sale, index: number) => (
                <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {sale.customerName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{sale.customerId}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${sale.totalAmount.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <button 
                          onClick={() => { setSelectedSale(sale); setIsDetailsModalOpen(true); }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                      >
                          View Details
                      </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">
                    {searchTerm ? 'No sales found matching your search.' : 'No sales recorded yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- Render Modal --- */}
      {isDetailsModalOpen && (
          <ViewDetailsModal 
              isOpen={isDetailsModalOpen} 
              onClose={() => setIsDetailsModalOpen(false)}
              sale={selectedSale}
          />
      )}
    </div>
  );
};

export default SalesPage;