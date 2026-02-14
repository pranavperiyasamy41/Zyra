import useSWR from 'swr';
import apiClient from '../api';
// --- Add this new hook ---
export const useAllMedicines = (page = 1, search = '') => {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: '20',
    search
  });
  
  // We use '/medicines' as the SWR key, which maps to our API endpoint
  const { data, error, isLoading, mutate } = useSWR(`/medicines?${query.toString()}`, fetcher);

  return {
    medicines: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate, // We'll use 'mutate' to refresh the list after we add/delete
  };
};
// This 'fetcher' function is what SWR will use to get data
// It just uses our existing apiClient
const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

// --- Custom Hook for Expiry Alerts ---
export const useExpiryAlerts = () => {
  const { data, error, isLoading } = useSWR('/medicines/alerts/expiry', fetcher);

  return {
    alerts: data,
    isLoading,
    isError: error,
  };
};

// --- Custom Hook for Low Stock Alerts ---
export const useLowStockAlerts = () => {
  const { data, error, isLoading } = useSWR('/medicines/alerts/low-stock', fetcher);

  return {
    alerts: data,
    isLoading,
    isError: error,
  };
};

// --- Custom Hook for Out of Stock Alerts ---
export const useOutOfStockAlerts = () => {
  const { data, error, isLoading } = useSWR('/medicines/alerts/out-of-stock', fetcher);

  return {
    alerts: data,
    isLoading,
    isError: error,
  };
};

// --- Define the Medicine type ---
// We can add this here so our components know the shape of the data
export interface Medicine {
  _id: string;
  name: string;
  batchId: string;
  quantity: number;
  mrp: number;
  expiryDate: string;
  lowStockThreshold: number;
}