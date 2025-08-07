import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Handle unauthorized error
      console.error('Unauthorized access - please login again');
    }
    return Promise.reject(error);
  }
);

export const productsApi = {
  search: (query: string) => api.get(`/products?q=${encodeURIComponent(query)}`),
  getById: (id: number) => api.get(`/products/${id}`),
};

export const invoicesApi = {
  create: (data: any) => api.post('/invoices', data),
  getById: (id: number) => api.get(`/invoices/${id}`),
};

export default api;
