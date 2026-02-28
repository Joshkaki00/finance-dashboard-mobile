import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateBudget, loadPersistedBudgets } from '../store/budgetSlice';
import { loadPersistedTransactions } from '../store/transactionsSlice';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function BudgetScreen() {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget.budgets);
  const loading = useSelector((state) => state.budget.loading);
  const error = useSelector((state) => state.budget.error);
  const allCategories = useSelector((state) => state.categories);
  const transactions = useSelector((state) => state.transactions.transactions);
  
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Memoize filtered categories to prevent unnecessary re-renders
  const categories = useMemo(
    () => allCategories.filter((c) => c !== 'income'),
    [allCategories]
  );

  const [budgetValues, setBudgetValues] = useState({ ...budget });

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadPersistedBudgets());
    await dispatch(loadPersistedTransactions());
    setRefreshing(false);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSave = () => {
    Object.entries(budgetValues).forEach(([category, amount]) => {
      if (category !== 'income') {
        dispatch(updateBudget({ category, amount: parseFloat(amount) || 0 }));
      }
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Budget updated successfully!');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading budgets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.errorSubtext}>Please try restarting the app</Text>
      </View>
    );
  }

  // Calculate spending per category
  const getSpending = (category) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getPercentage = (category) => {
    const spent = getSpending(category);
    const budgeted = parseFloat(budgetValues[category]) || 0;
    if (budgeted === 0) return 0;
    return Math.min((spent / budgeted) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage > 100) return '#ef4444'; // Red - over budget
    if (percentage > 75) return '#f59e0b'; // Orange - warning
    return '#10b981'; // Green - good
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Monthly Budget</Text>

        {categories.map((category) => {
          const spent = getSpending(category);
          const budgeted = parseFloat(budgetValues[category]) || 0;
          const percentage = getPercentage(category);

          return (
            <View key={category} style={styles.budgetItem}>
              <Text style={styles.categoryLabel}>{category}</Text>

              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={budgetValues[category]?.toString() || ''}
                onChangeText={(text) =>
                  setBudgetValues({ ...budgetValues, [category]: text })
                }
              />

              {budgeted > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getProgressColor(percentage),
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    ${spent.toFixed(2)} / ${budgeted.toFixed(2)} ({percentage.toFixed(0)}%)
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.saveButtonText}>Save Budget</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.base,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: 'Roboto-Black',
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.danger,
    fontFamily: 'Roboto-Black',
    marginBottom: Spacing.sm,
  },
  errorSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.lg,
    fontFamily: 'Roboto-Black',
  },
  budgetItem: {
    marginBottom: Spacing.xl,
  },
  categoryLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Black',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    fontSize: FontSize.base,
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  progressText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 4,
    fontFamily: 'Roboto-Black',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.base,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    fontFamily: 'Roboto-Black',
  },
});
