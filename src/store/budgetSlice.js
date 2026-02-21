import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  income: 0.0,
  groceries: 0.0,
  utilities: 0.0,
  entertainment: 0.0,
  other: 0.0,
};

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateBudget: (state, action) => {
      const { category, amount } = action.payload;
      state[category] = parseFloat(amount);
    },
  },
});

export const { updateBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
