import useSWR from 'swr';
import apiClient from '../api';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

// --- Define the Sale types ---
export interface SaleItem {
  _id: string;
  medicine: string;
  medicineName: string;
  quantitySold: number;
  pricePerUnit: number;
}

export interface Sale {
  _id: string;
  user: string;
  itemsSold: SaleItem[];
  totalAmount: number;
  saleDate: string;
  customerName: string;   // <--- This was missing
  customerPhone: string;  // <--- This was missing
  customerId: string;
}

// --- Custom Hook for Sales History ---
export const useSalesHistory = () => {
  const { data, error, isLoading, mutate } = useSWR<Sale[]>('/sales', fetcher);

  return {
    sales: data,
    isLoading,
    isError: error,
    mutate,
  };
};