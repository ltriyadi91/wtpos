import { productsApi } from '@/lib/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  sku?: string;
  barcode?: string;
  category?: string;
  isActive: boolean;
}

interface ProductState {
  products: Product[];
  searchTerm: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  searchTerm: '',
  status: 'idle',
  error: null,
};

export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.search(searchTerm);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to search products');
      }
      return rejectWithValue('An unexpected error occurred while searching products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productsApi.getById(productId);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
      }
      return rejectWithValue('An unexpected error occurred while fetching the product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        // Update or add the product to the list
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      });
  },
});

export const { setSearchTerm, clearSearch } = productSlice.actions;

export const selectAllProducts = (state: { products: ProductState }) => state.products.products;
export const selectProductSearchTerm = (state: { products: ProductState }) => state.products.searchTerm;
export const selectProductStatus = (state: { products: ProductState }) => state.products.status;
export const selectProductError = (state: { products: ProductState }) => state.products.error;

export default productSlice.reducer;
