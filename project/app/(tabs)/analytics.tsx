import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartPie as PieChart } from 'lucide-react-native';

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PieChart size={32} color="#2563EB" />
        <Text style={styles.title}>Analytics</Text>
      </View>
      <Text style={styles.subtitle}>View your financial insights</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});