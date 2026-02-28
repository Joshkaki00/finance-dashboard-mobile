import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing } from '../constants';

export default function SettingsScreen() {
  const [exporting, setExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      // Load all data from AsyncStorage
      const transactionsData = await AsyncStorage.getItem('transactions');
      const budgetsData = await AsyncStorage.getItem('budgets');
      
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        transactions: transactionsData ? JSON.parse(transactionsData) : [],
        budgets: budgetsData ? JSON.parse(budgetsData) : {},
      };
      
      // Create filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `finance-data-${timestamp}.json`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Write data to file
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2), {});
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Finance Data',
          UTI: 'public.json',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Alert.alert('Success', `Data exported to: ${filename}`);
      }
      
      setExporting(false);
    } catch (error) {
      setExporting(false);
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
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
          onPress: () => {
            AsyncStorage.clear()
              .then(() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert('Success', 'All data has been cleared. Restart the app to see changes.');
              })
              .catch((error) => {
                console.error('Error clearing data:', error);
                Alert.alert('Error', 'Failed to clear data. Please try again.');
              });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={handleExportData}
          disabled={exporting}
        >
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>Export Data</Text>
            {exporting && (
              <ActivityIndicator 
                size="small" 
                color={Colors.primary} 
                style={styles.loadingIndicator}
              />
            )}
          </View>
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
        <Text style={styles.featureText}>✓ Data export (JSON)</Text>
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
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: FontSize.base,
    fontFamily: 'Roboto-Black',
  },
  loadingIndicator: {
    marginLeft: Spacing.sm,
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
