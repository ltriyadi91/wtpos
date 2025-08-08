import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "@/features/invoice/invoiceSlice";
import productReducer from "@/features/products/productSlice";

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your/action/type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
