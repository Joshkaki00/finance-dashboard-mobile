import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../store/transactionsSlice';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function AddTransactionScreen({ navigation }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Add animation setup here:
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

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
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.submitButton, type === 'income' ? styles.submitIncome : styles.submitExpense]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Add {type === 'income' ? 'Income' : 'Expense'}</Text>
        </TouchableOpacity>
      </Animated.View>
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
    marginBottom: Spacing.base,
  },
  label: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.input,
    alignItems: 'center',
  },
  typeButtonActiveExpense: {
    backgroundColor: Colors.danger,
  },
  typeButtonActiveIncome: {
    backgroundColor: Colors.success,
  },
  typeText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  typeTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.md,
  },
  currencySymbol: {
    fontSize: FontSize['2xl'],
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
    fontFamily: 'Roboto-Black',
  },
  amountInput: {
    flex: 1,
    fontSize: FontSize['2xl'],
    paddingVertical: Spacing.md,
    fontFamily: 'Roboto-Black',
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickAmountButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.input,
  },
  quickAmountText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontFamily: 'Roboto-Black',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.input,
    borderWidth: 2,
    borderColor: Colors.input,
  },
  categoryButtonActive: {
    backgroundColor: Colors.inputActive,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  categoryTextActive: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.base,
    padding: Spacing.md,
    fontSize: FontSize.base,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  submitExpense: {
    backgroundColor: Colors.danger,
  },
  submitIncome: {
    backgroundColor: Colors.success,
  },
  submitText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: 'Roboto-Black',
  },
});
