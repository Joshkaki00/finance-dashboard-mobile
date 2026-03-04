import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinancialTips } from '../store/financialTipsSlice';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function FinancialTipsScreen() {
  const dispatch = useDispatch();
  const { tips, status, error } = useSelector((state) => state.financialTips);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFinancialTips());
    }
  }, [status, dispatch]);

  const handleRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

      {tips.map((tip) => (
        <View key={`${tip.author}-${tip.quote.substring(0, 20)}`} style={styles.tipCard}>
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
    backgroundColor: Colors.background,
    padding: Spacing.base,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    fontFamily: 'Roboto-Black',
  },
  refreshLink: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: 'Roboto-Black',
  },
  tipCard: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.base,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quote: {
    fontSize: FontSize.base,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  author: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
    fontFamily: 'Roboto-Black',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontFamily: 'Roboto-Black',
  },
  errorText: {
    fontSize: FontSize.base,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.base,
    fontFamily: 'Roboto-Black',
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
    fontFamily: 'Roboto-Black',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
  refreshButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.base,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
});