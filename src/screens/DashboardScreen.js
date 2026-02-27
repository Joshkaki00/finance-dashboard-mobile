import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';
import { loadPersistedTransactions } from '../store/transactionsSlice';

export default function DashboardScreen() {
  const transactions = useSelector((state) => state.transactions.transactions);
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadPersistedTransactions());
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading transactions...</Text>
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

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
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
    marginRight: Spacing.sm,
    backgroundColor: Colors.inputActive,
  },
  expenseCard: {
    flex: 1,
    marginLeft: Spacing.sm,
    backgroundColor: '#fee2e2',
  },
  cardTitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: 'Roboto-Black',
  },
  balance: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    fontFamily: 'Roboto-Black',
  },
  amount: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    fontFamily: 'Roboto-Black',
  },
  positive: {
    color: Colors.success,
  },
  negative: {
    color: Colors.danger,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    fontFamily: 'Roboto-Black',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.input,
  },
  transactionCategory: {
    fontSize: FontSize.base,
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Black',
  },
  transactionAmount: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
});
