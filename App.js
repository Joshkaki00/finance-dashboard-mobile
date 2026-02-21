import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadPersistedTransactions } from './src/store/transactionsSlice';
import { loadPersistedBudgets } from './src/store/budgetSlice';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load persisted data on app launch
    dispatch(loadPersistedTransactions());
    dispatch(loadPersistedBudgets());
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}