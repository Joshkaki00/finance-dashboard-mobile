import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinancialTips } from '../store/financialTipsSlice';

export default function FinancialTipsScreen() {
  const dispatch = useDispatch();
  const { tips, status, error } = useSelector((state) => state.financialTips);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFinancialTips());
    }
  }, [status, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchFinancialTips());
  };

  // Loading State
  if (status === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading financial wisdom...</Text>
      </View>
    );
  }

  // Error State
  if (status === 'failed') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty State
  if (tips.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No tips available</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Success State
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💡 Financial Wisdom</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text style={styles.refreshLink}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {tips.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <Text style={styles.quote}>"{tip.quote}"</Text>
          <Text style={styles.author}>— {tip.author}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  refreshLink: {
    color: '#3b82f6',
    fontSize: 16,
  },
  tipCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    marginBottom: 12,
    lineHeight: 24,
  },
  author: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});