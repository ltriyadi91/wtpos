export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  subtotal: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  customerName: string;
  salespersonName: string;
  notes?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInvoiceDto {
  customerName: string;
  salespersonName: string;
  notes?: string;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
