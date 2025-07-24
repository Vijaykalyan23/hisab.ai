@@ .. @@
 import React from 'react';
-import { View, Text, StyleSheet } from 'react-native';
-import { CreditCard } from 'lucide-react-native';
+import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
+import { useTheme } from '@/contexts/ThemeContext';
+import { ExpensesList } from '@/components/ExpensesList';
 
 export default function ExpensesScreen() {
+  const { isDark } = useTheme();
+  
+  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';
+
   return (
-    <View style={styles.container}>
-      <View style={styles.header}>
-        <CreditCard size={32} color="#2563EB" />
-        <Text style={styles.title}>Expenses</Text>
-      </View>
-      <Text style={styles.subtitle}>Track your spending</Text>
-    </View>
+    <SafeAreaView style={[styles.container, { backgroundColor }]}>
+      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />
+      <ExpensesList />
+    </SafeAreaView>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
-    justifyContent: 'center',
-    alignItems: 'center',
-    backgroundColor: '#FFFFFF',
-    padding: 20,
-  },
-  header: {
-    flexDirection: 'row',
-    alignItems: 'center',
-    marginBottom: 16,
-  },
-  title: {
-    fontSize: 28,
-    fontWeight: '700',
-    color: '#1F2937',
-    marginLeft: 12,
-  },
-  subtitle: {
-    fontSize: 16,
-    color: '#6B7280',
-    textAlign: 'center',
   },
 });