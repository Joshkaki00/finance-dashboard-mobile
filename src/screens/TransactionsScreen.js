import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction, loadPersistedTransactions } from '../store/transactionsSlice';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function TransactionsScreen() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense';
  const [refreshing, setRefreshing] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(loadPersistedTransactions());
    setRefreshing(false);
  };

  if (loading && !refreshing) {
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
        <Text style={styles.errorSubtext}>Pull down to retry</Text>
      </View>
    );
  }

  const handleDelete = (id) => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteTransaction(id));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionInfo}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[styles.amount, item.type === 'income' ? styles.positive : styles.negative]}
        >
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({transactions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'income' && styles.filterButtonActive]}
          onPress={() => setFilter('income')}
        >
          <Text style={[styles.filterText, filter === 'income' && styles.filterTextActive]}>
            Income ({transactions.filter((t) => t.type === 'income').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'expense' && styles.filterButtonActive]}
          onPress={() => setFilter('expense')}
        >
          <Text style={[styles.filterText, filter === 'expense' && styles.filterTextActive]}>
            Expenses ({transactions.filter((t) => t.type === 'expense').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  filterContainer: {
    flexDirection: 'row',
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: 'Roboto-Black',
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
  listContainer: {
    padding: Spacing.base,
  },
  transactionCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  category: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    textTransform: 'capitalize',
    marginBottom: 4,
    fontFamily: 'Roboto-Black',
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    fontFamily: 'Roboto-Black',
  },
  positive: {
    color: Colors.success,
  },
  negative: {
    color: Colors.danger,
  },
  deleteButton: {
    marginTop: Spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
  },
  deleteText: {
    color: Colors.danger,
    fontSize: FontSize.xs,
    fontFamily: 'Roboto-Black',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textTertiary,
    fontFamily: 'Roboto-Black',
  },
});
