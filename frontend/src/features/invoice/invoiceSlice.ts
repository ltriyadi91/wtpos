import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface InvoiceItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoiceState {
  items: InvoiceItem[];
  customer: string;
  salesPerson: string;
  notes: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: InvoiceState = {
  items: [],
  customer: '',
  salesPerson: '',
  notes: '',
  status: 'idle',
  error: null,
};

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: Omit<InvoiceState, 'status' | 'error'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/invoices', invoiceData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.items.push({
          productId: product.id,
          product,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
        });
      }
    },
    updateItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    setCustomer: (state, action: PayloadAction<string>) => {
      state.customer = action.payload;
    },
    setSalesPerson: (state, action: PayloadAction<string>) => {
      state.salesPerson = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    clearInvoice: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInvoice.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.status = 'succeeded';
        return initialState; // Reset to initial state on success
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  setCustomer,
  setSalesPerson,
  setNotes,
  clearInvoice,
} = invoiceSlice.actions;

export const selectInvoiceItems = (state: { invoice: InvoiceState }) => state.invoice.items;
export const selectInvoiceTotal = (state: { invoice: InvoiceState }) =>
  state.invoice.items.reduce((total, item) => total + item.totalPrice, 0);

export default invoiceSlice.reducer;
