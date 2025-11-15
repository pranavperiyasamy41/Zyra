import DashboardCard from '../components/DashboardCard';
import { useExpiryAlerts, useLowStockAlerts, useOutOfStockAlerts, type Medicine } from '../hooks/useMedicines';

const DashboardPage = () => {
  const { alerts: expiryAlerts, isLoading: expiryLoading } = useExpiryAlerts();
  const { alerts: lowStockAlerts, isLoading: lowStockLoading } = useLowStockAlerts();
  const { alerts: outOfStockAlerts, isLoading: outOfStockLoading } = useOutOfStockAlerts();

  // Note: The Navbar and Logout button are now in App.tsx, so we remove them from here.
  
  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        
        {/* Main "Your Dashboard" Card */}
        <div className="mb-6 rounded-lg bg-white p-8 shadow dark:bg-slate-800 dark:border dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Dashboard
          </h2>
          <p className="mt-4 text-gray-600 dark:text-slate-300">
            Welcome to your Smart Pharmacy inventory system.
          </p>
        </div>

        {/* Grid for Widgets */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Out of Stock Alerts Widget */}
          <DashboardCard title="Out of Stock" alertType="expiry">
            {outOfStockLoading ? (
              <p className="dark:text-slate-300">Loading alerts...</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                {outOfStockAlerts && outOfStockAlerts.length > 0 ? (
                  outOfStockAlerts.map((med: Medicine) => (
                    <li key={med._id} className="py-3">
                      <p className="font-medium text-red-700 dark:text-red-400">{med.name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        (Batch: {med.batchId})
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">No items are out of stock.</p>
                )}
              </ul>
            )}
          </DashboardCard>

          {/* Low Stock Alerts Widget */}
          <DashboardCard title="Low Stock" alertType="lowStock">
            {lowStockLoading ? (
              <p className="dark:text-slate-300">Loading alerts...</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                {lowStockAlerts && lowStockAlerts.filter((med: Medicine) => med.quantity > 0).length > 0 ? (
                  lowStockAlerts.filter((med: Medicine) => med.quantity > 0).map((med: Medicine) => (
                    <li key={med._id} className="py-3">
                      <p className="font-medium text-yellow-700 dark:text-yellow-400">{med.name} (Batch: {med.batchId})</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        Only {med.quantity} left (Threshold: {med.lowStockThreshold})
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">No low stock items.</p>
                )}
              </ul>
            )}
          </DashboardCard>
          
          {/* Expiry Alerts Widget */}
          <DashboardCard title="Expiry Alerts" alertType="expiry">
            {expiryLoading ? (
              <p className="dark:text-slate-300">Loading alerts...</p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                {expiryAlerts && expiryAlerts.length > 0 ? (
                  expiryAlerts.map((med: Medicine) => (
                    <li key={med._id} className="py-3">
                      <p className="font-medium text-red-700 dark:text-red-400">{med.name} (Batch: {med.batchId})</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        Expires: {new Date(med.expiryDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-slate-400">No expiring items. All good!</p>
                )}
              </ul>
            )}
          </DashboardCard>

        </div>
      </div>
    </main>
  );
};

export default DashboardPage;