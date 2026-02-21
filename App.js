import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, Roboto_900Black } from '@expo-google-fonts/roboto';
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
  const [fontsLoaded] = useFonts({
    'Roboto-Black': Roboto_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}