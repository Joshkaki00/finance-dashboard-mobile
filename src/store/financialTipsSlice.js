import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFinancialTips = createAsyncThunk(
  'financialTips/fetchTips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=money', {
        headers: {
          'X-Api-Key': 'YOUR_API_KEY_HERE' // Get free key from api-ninjas.com
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch financial tips');
      }
      
      const data = await response.json();
      return data;
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