import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function DashboardScreen() {
  const transactions = useSelector((state) => state.transactions.transactions);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Balance</Text>
        <Text style={[styles.balance, balance >= 0 ? styles.positive : styles.negative]}>
          ${balance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.incomeCard]}>
          <Text style={styles.cardTitle}>Income</Text>
          <Text style={styles.amount}>${totalIncome.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardTitle}>Expenses</Text>
          <Text style={styles.amount}>${totalExpenses.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          transactions.slice(0, 5).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'income' ? styles.positive : styles.negative,
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incomeCard: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#e0f2fe',
  },
  expenseCard: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#fee2e2',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionCategory: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
