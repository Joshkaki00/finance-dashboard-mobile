import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <Text style={styles.featureText}>✓ Redux state management</Text>
        <Text style={styles.featureText}>✓ Haptic feedback</Text>
        <Text style={styles.featureText}>✓ AsyncStorage persistence (coming soon)</Text>
        <Text style={styles.featureText}>✓ Data export (coming soon)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
  },
  dangerText: {
    color: '#ef4444',
  },
  settingArrow: {
    fontSize: 24,
    color: '#999',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#666',
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 4,
  },
});
