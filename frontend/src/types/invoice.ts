export interface ProductItem {
  id: number;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customer: string;
  salesPerson: string;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  items?: ProductItem[];
}
