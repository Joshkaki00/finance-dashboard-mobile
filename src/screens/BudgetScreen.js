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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  budgetItem: {
    marginBottom: 24,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
