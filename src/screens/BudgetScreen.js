import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateBudget } from '../store/budgetSlice';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function BudgetScreen() {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budget);
  const allCategories = useSelector((state) => state.categories);
  const transactions = useSelector((state) => state.transactions.transactions);
  
  // Memoize filtered categories to prevent unnecessary re-renders
  const categories = useMemo(
    () => allCategories.filter((c) => c !== 'income'),
    [allCategories]
  );

  const [budgetValues, setBudgetValues] = useState({ ...budget });

  const handleSave = () => {
    Object.entries(budgetValues).forEach(([category, amount]) => {
      if (category !== 'income') {
        dispatch(updateBudget({ category, amount: parseFloat(amount) || 0 }));
      }
    });
    Alert.alert('Success', 'Budget updated successfully!');
  };

  // Calculate spending per category
  const getSpending = (category) => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getPercentage = (category) => {
    const spent = getSpending(category);
    const budgeted = budgetValues[category] || 0;
    if (budgeted === 0) return 0;
    return Math.min((spent / budgeted) * 100, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set Monthly Budget</Text>

        {categories.map((category) => {
          const spent = getSpending(category);
          const budgeted = budgetValues[category] || 0;
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
                          backgroundColor:
                            percentage > 100 ? '#ef4444' : percentage > 75 ? '#f59e0b' : '#10b981',
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Budget</Text>
        </TouchableOpacity>
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
