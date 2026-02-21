import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveTransactions, loadTransactions } from '../utils/storage';

// Async thunk to load transactions from storage
export const loadPersistedTransactions = createAsyncThunk(
  'transactions/loadPersisted',
  async () => {
    const transactions = await loadTransactions();
    return transactions;
  }
);

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.push({
        id: Date.now(),
        ...action.payload,
      });
      saveTransactions(state.transactions); // Auto-save
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload
      );
      saveTransactions(state.transactions); // Auto-save
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
        saveTransactions(state.transactions); // Auto-save
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPersistedTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPersistedTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(loadPersistedTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
