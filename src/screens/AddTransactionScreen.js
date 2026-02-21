import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../store/transactionsSlice';
import * as Haptics from 'expo-haptics';

export default function AddTransactionScreen({ navigation }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const transaction = {
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    };

    dispatch(addTransaction(transaction));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);

    Alert.alert('Success', 'Transaction added successfully!');
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <ScrollView style={styles.container}>
      {/* Transaction Type */}
      <View style={styles.section}>
        <Text style={styles.label}>Transaction Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.section}>
        <Text style={styles.label}>Amount *</Text>
        <View style={styles.amountInputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(quickAmount.toString())}
            >
              <Text style={styles.quickAmountText}>${quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[styles.categoryText, category === cat && styles.categoryTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="What was this for?"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, type === 'income' ? styles.submitIncome : styles.submitExpense]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Add {type === 'income' ? 'Income' : 'Expense'}</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#ef4444',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#10b981',
  },
  typeText: {
    fontSize: 16,
    color: '#666',
  },
  typeTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 24,
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    paddingVertical: 12,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickAmountButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  quickAmountText: {
    fontSize: 14,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#e0f2fe',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  categoryTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  submitExpense: {
    backgroundColor: '#ef4444',
  },
  submitIncome: {
    backgroundColor: '#10b981',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
