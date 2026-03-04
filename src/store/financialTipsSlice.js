import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Hardcoded financial tips for demo purposes
const FINANCIAL_TIPS = [
  {
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "Warren Buffett"
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    quote: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.",
    author: "T.T. Munger"
  },
  {
    quote: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make, so you can give money back and have money to invest.",
    author: "Dave Ramsey"
  },
  {
    quote: "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: "Robert Kiyosaki"
  },
  {
    quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher"
  },
  {
    quote: "Never spend your money before you have earned it.",
    author: "Thomas Jefferson"
  },
  {
    quote: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey"
  },
  {
    quote: "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    author: "Ayn Rand"
  },
  {
    quote: "The goal isn't more money. The goal is living life on your terms.",
    author: "Chris Brogan"
  }
];

export const fetchFinancialTips = createAsyncThunk(
  'financialTips/fetchTips',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Shuffle tips for variety
      const shuffled = [...FINANCIAL_TIPS].sort(() => Math.random() - 0.5);
      
      // Return 5 random tips
      return shuffled.slice(0, 5);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const financialTipsSlice = createSlice({
  name: 'financialTips',
  initialState: {
    tips: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialTips.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFinancialTips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tips = action.payload;
      })
      .addCase(fetchFinancialTips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default financialTipsSlice.reducer;