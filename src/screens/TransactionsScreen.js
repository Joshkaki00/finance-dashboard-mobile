import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTransaction } from '../store/transactionsSlice';
import * as Haptics from 'expo-haptics';

export default function TransactionsScreen() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
