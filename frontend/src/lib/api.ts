import { InvoiceData } from '@/features/invoice/invoiceSlice';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  search: (query: string) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getById: (id: number) => api.get(`/products/${id}`),
};

export const invoicesApi = {
  create: (data: InvoiceData) => api.post('/invoices', data),
  getById: (id: number) => api.get(`/invoices/${id}`),
  getRevenue: (range: string) => api.get(`/invoices/revenue?range=${range}`),
};

export default api;
