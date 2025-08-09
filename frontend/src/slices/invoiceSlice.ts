import { invoicesApi } from "@/lib/api";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export interface InvoiceItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface InvoiceState {
  items: InvoiceItem[];
  customer: string;
  salesPerson: string;
  notes: string;
  paymentType: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface InvoiceData {
  items: InvoiceItem[];
  customer: string;
  salesPerson: string;
  notes: string;
  paymentType: string;
}

const initialState: InvoiceState = {
  items: [],
  customer: "",
  salesPerson: "",
  notes: "",
  paymentType: "CASH",
  status: "idle",
  error: null,
};

export const createInvoice = createAsyncThunk(
  "invoices/createInvoice",
  async (invoiceData: InvoiceData, { rejectWithValue }) => {
    try {
      const response = await invoicesApi.create(invoiceData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create invoice"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice =
          existingItem.quantity * existingItem.unitPrice;
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
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
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
        state.status = "loading";
      })
      .addCase(createInvoice.fulfilled, () => {
        return initialState; // Reset to initial state on success
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.status = "failed";
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

export const selectInvoiceItems = (state: { invoice: InvoiceState }) =>
  state.invoice.items;
export const selectInvoiceTotal = (state: { invoice: InvoiceState }) =>
  state.invoice.items.reduce((total, item) => total + item.totalPrice, 0);

export default invoiceSlice.reducer;
