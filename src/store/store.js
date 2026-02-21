import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './transactionsSlice';
import budgetReducer from './budgetSlice';
import categoriesReducer from './categoriesSlice';
import financialTipsReducer from './financialTipsSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budget: budgetReducer,
    categories: categoriesReducer,
    financialTips: financialTipsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['transactions/loadPersisted/fulfilled', 'budget/loadPersisted/fulfilled'],
      },
    }),
});