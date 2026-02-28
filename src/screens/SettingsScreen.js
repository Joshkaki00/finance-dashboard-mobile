import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants';

export default function SettingsScreen() {
  const handleExportData = async () => {
    // TODO: Implement data export functionality
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all transactions and budgets? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <Text style={styles.settingText}>Export Data</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
          <Text style={[styles.settingText, styles.dangerText]}>Clear All Data</Text>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>

        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Created with</Text>
          <Text style={styles.aboutValue}>React Native & Expo</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.featureText}>✓ Transaction tracking</Text>
        <Text style={styles.featureText}>✓ Budget management</Text>
        <Text style={styles.featureText}>✓ Bottom tab navigation</Text>
        <Text style={styles.featureText}>✓ Stack navigation</Text>
        <Text style={styles.featureText}>✓ Redux Toolkit with async thunks</Text>
        <Text style={styles.featureText}>✓ AsyncStorage persistence</Text>
        <Text style={styles.featureText}>✓ Loading & error states</Text>
        <Text style={styles.featureText}>✓ Pull-to-refresh</Text>
        <Text style={styles.featureText}>✓ Haptic feedback</Text>
        <Text style={styles.featureText}>✓ Button press animations</Text>
        <Text style={styles.featureText}>✓ Custom theme system</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.card,
    marginTop: Spacing.base,
    padding: Spacing.base,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.md,
    fontFamily: 'Roboto-Black',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.input,
  },
  settingText: {
    fontSize: FontSize.base,
    fontFamily: 'Roboto-Black',
  },
  dangerText: {
    color: Colors.danger,
  },
  settingArrow: {
    fontSize: FontSize['2xl'],
    color: Colors.textTertiary,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  aboutLabel: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  aboutValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    fontFamily: 'Roboto-Black',
  },
  featureText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    paddingVertical: 4,
  },
});
