import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Analyze user data and generate personalized tips
const generatePersonalizedTips = (transactions, budgets) => {
  const tips = [];
  
  // Calculate spending by category
  const expensesByCategory = {};
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expensesTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

  // Tip 1: Overall financial health
  const balance = incomeTotal - expensesTotal;
  if (balance > 0) {
    const savingsRate = ((balance / incomeTotal) * 100).toFixed(0);
    tips.push({
      icon: '💰',
      title: 'Great Savings Rate!',
      description: `You're saving ${savingsRate}% of your income. Keep it up! Financial experts recommend saving at least 20% of your income.`,
      type: 'positive'
    });
  } else if (balance < 0) {
    tips.push({
      icon: '⚠️',
      title: 'Spending Alert',
      description: `You're spending $${Math.abs(balance).toFixed(2)} more than you earn. Try cutting back on non-essential expenses to get back on track.`,
      type: 'warning'
    });
  }

  // Tip 2: Budget analysis
  const budgetCategories = Object.keys(budgets);
  budgetCategories.forEach(category => {
    const spent = expensesByCategory[category] || 0;
    const budgeted = budgets[category];
    if (budgeted > 0) {
      const percentage = (spent / budgeted) * 100;
      
      if (percentage > 100) {
        tips.push({
          icon: '🚨',
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Over Budget`,
          description: `You've spent $${spent.toFixed(2)} out of $${budgeted.toFixed(2)} (${percentage.toFixed(0)}%). Consider reducing expenses in this category.`,
          type: 'warning'
        });
      } else if (percentage > 80) {
        tips.push({
          icon: '⚡',
          title: `Watch Your ${category.charAt(0).toUpperCase() + category.slice(1)} Spending`,
          description: `You're at ${percentage.toFixed(0)}% of your budget ($${spent.toFixed(2)}/$${budgeted.toFixed(2)}). Be mindful of remaining expenses this month.`,
          type: 'caution'
        });
      }
    }
  });

  // Tip 3: Highest spending category
  if (Object.keys(expensesByCategory).length > 0) {
    const highestCategory = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (highestCategory) {
      const [category, amount] = highestCategory;
      const percentage = ((amount / expensesTotal) * 100).toFixed(0);
      tips.push({
        icon: '📊',
        title: 'Top Spending Category',
        description: `${category.charAt(0).toUpperCase() + category.slice(1)} is your highest expense at $${amount.toFixed(2)} (${percentage}% of total spending). Look for ways to optimize here for maximum impact.`,
        type: 'info'
      });
    }
  }

  // Tip 4: Transaction count analysis
  if (transactions.length === 0) {
    tips.push({
      icon: '🎯',
      title: 'Get Started!',
      description: 'Start tracking your transactions to get personalized financial insights and recommendations. Tap the + button to add your first transaction.',
      type: 'info'
    });
  } else if (transactions.length < 5) {
    tips.push({
      icon: '📈',
      title: 'Keep Tracking',
      description: `You have ${transactions.length} transaction${transactions.length === 1 ? '' : 's'}. Add more to get better insights into your spending patterns and personalized recommendations.`,
      type: 'info'
    });
  }

  // Tip 5: Budget recommendations
  const unbungetedCategories = Object.keys(expensesByCategory).filter(
    cat => !budgets[cat] || budgets[cat] === 0
  );
  
  if (unbungetedCategories.length > 0 && transactions.length > 0) {
    tips.push({
      icon: '🎯',
      title: 'Set Up Budgets',
      description: `You have spending in ${unbungetedCategories.join(', ')} but no budget set. Visit the Budget tab to set spending limits and track your progress.`,
      type: 'info'
    });
  }

  // Tip 6: Income vs Expenses ratio
  if (incomeTotal > 0 && expensesTotal > 0) {
    const ratio = (expensesTotal / incomeTotal * 100).toFixed(0);
    if (ratio < 50) {
      tips.push({
        icon: '🌟',
        title: 'Excellent Financial Discipline',
        description: `You're only spending ${ratio}% of your income. This leaves plenty of room for savings and investments. Consider putting extra funds into an emergency fund or retirement account.`,
        type: 'positive'
      });
    } else if (ratio > 90) {
      tips.push({
        icon: '💡',
        title: 'High Expense Ratio',
        description: `You're spending ${ratio}% of your income. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.`,
        type: 'caution'
      });
    }
  }

  // If no tips generated, add generic helpful ones
  if (tips.length === 0) {
    tips.push({
      icon: '💡',
      title: 'Start Your Financial Journey',
      description: 'Begin by adding your income and expenses. The more data you track, the better insights you\'ll receive!',
      type: 'info'
    });
  }

  return tips;
};

export const fetchFinancialTips = createAsyncThunk(
  'financialTips/fetchTips',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Simulate API delay for realistic loading state
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const state = getState();
      const transactions = state.transactions.transactions;
      const budgets = state.budget.budgets;
      
      // Generate personalized tips based on user data
      const tips = generatePersonalizedTips(transactions, budgets);
      
      return tips;
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