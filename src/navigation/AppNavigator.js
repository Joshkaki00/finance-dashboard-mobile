import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import BudgetScreen from '../screens/BudgetScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Transactions
function TransactionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsScreen}
        options={{ title: 'Transactions' }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionsScreen}
        options={{ title: 'Transaction Details' }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Budget') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsStack} />
      <Tab.Screen name="Add" component={AddTransactionScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
