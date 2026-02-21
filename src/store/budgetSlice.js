import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveBudgets, loadBudgets } from '../utils/storage';

// Async thunk to load budgets from storage
export const loadPersistedBudgets = createAsyncThunk(
  'budget/loadPersisted',
  async () => {
    const budgets = await loadBudgets();
    return budgets;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budgets: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateBudget: (state, action) => {
      state.budgets[action.payload.category] = action.payload.amount;
      saveBudgets(state.budgets); // Auto-save
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPersistedBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPersistedBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(loadPersistedBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateBudget } = budgetSlice.actions;
export default budgetSlice.reducer;