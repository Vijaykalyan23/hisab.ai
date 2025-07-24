@@ .. @@
 import React, { useState } from 'react';
 import {
   View,
-  Text,
   StyleSheet,
   TouchableOpacity,
   StatusBar,
   SafeAreaView,
-  Alert,
 } from 'react-native';
-import { LinearGradient } from 'expo-linear-gradient';
 import { BlurView } from 'expo-blur';
+import { LinearGradient } from 'expo-linear-gradient';
 import { router } from 'expo-router';
 import {
   ArrowLeft,
   Receipt,
-  Camera,
-  Upload,
-  Image as ImageIcon,
-  FileText,
   Moon,
   Sun,
 } from 'lucide-react-native';
 import { useTheme } from '@/contexts/ThemeContext';
-
-interface UploadOptionProps {
-  icon: React.ReactNode;
-  title: string;
-  description: string;
-  onPress: () => void;
-  gradient: string[];
-  isDark: boolean;
-}
-
-const UploadOption: React.FC<UploadOptionProps> = ({ 
-  icon, 
-  title, 
-  description, 
-  onPress, 
-  gradient,
-  isDark
-}) => (
-  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.uploadOption}>
-    <TouchableOpacity
-      style={[styles.uploadOptionContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}
-      onPress={onPress}
-      activeOpacity={0.8}
-    >
-      <View style={styles.uploadIconContainer}>
-        <LinearGradient
-          colors={gradient}
-          style={styles.uploadIconBackground}
-        >
-          {icon}
-        </LinearGradient>
-      </View>
-      <View style={styles.uploadContent}>
-        <Text style={[styles.uploadTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{title}</Text>
-        <Text style={[styles.uploadDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{description}</Text>
-      </View>
-    </TouchableOpacity>
-  </BlurView>
-);
+import { ReceiptProcessor } from '@/components/ReceiptProcessor';
 
 export default function UploadReceiptScreen() {
   const { isDark, toggleTheme } = useTheme();
@@ -46,26 +15,6 @@ export default function UploadReceiptScreen() {
     router.back();
   };
 
-
-  const handleTakePhoto = () => {
-    Alert.alert('Camera', 'Opening camera to take a photo of your receipt...');
-  };
-
-  const handleUploadFromGallery = () => {
-    Alert.alert('Gallery', 'Opening gallery to select a receipt image...');
-  };
-
-  const handleScanDocument = () => {
-    Alert.alert('Document Scanner', 'Opening document scanner...');
-  };
-
-  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';
-  const textColor = isDark ? '#FFFFFF' : '#1F2937';
-  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';
-
   return (
-    <SafeAreaView style={[styles.container, { backgroundColor }]}>
-      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />
+    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
+      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={isDark ? '#0F172A' : '#FFFFFF'} />
       
       {/* Header */}
@@ -85,7 +34,7 @@ export default function UploadReceiptScreen() {
             shadowRadius: 4,
             elevation: 3,
           }}
-          <Text style={[styles.logoText, { color: textColor }]}>hisab.ai</Text>
+          <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>hisab.ai</Text>
         </View>
 
         <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
@@ -96,44 +45,8 @@ export default function UploadReceiptScreen() {
       </View>
 
       {/* Main Content */}
-      <View style={styles.content}>
-        <View style={styles.titleSection}>
-          <Text style={[styles.mainTitle, { color: textColor }]}>Upload Receipt</Text>
-          <Text style={[styles.subtitle, { color: subtextColor }]}>
-            Choose how you'd like to capture your receipt
-          </Text>
-        </View>
-
-        <View style={styles.optionsContainer}>
-          <UploadOption
-            icon={<Camera size={28} color="#FFFFFF" strokeWidth={2} />}
-            title="Take Photo"
-            description="Capture receipt with camera"
-            onPress={handleTakePhoto}
-            gradient={['#10B981', '#34D399']}
-            isDark={isDark}
-          />
-          
-          <UploadOption
-            icon={<ImageIcon size={28} color="#FFFFFF" strokeWidth={2} />}
-            title="Upload from Gallery"
-            description="Select from your photos"
-            onPress={handleUploadFromGallery}
-            gradient={['#3B82F6', '#60A5FA']}
-            isDark={isDark}
-          />
-          
-          <UploadOption
-            icon={<FileText size={28} color="#FFFFFF" strokeWidth={2} />}
-            title="Scan Document"
-            description="Use document scanner"
-            onPress={handleScanDocument}
-            gradient={['#8B5CF6', '#A78BFA']}
-            isDark={isDark}
-          />
-        </View>
-      </View>
+      <ReceiptProcessor />
     </SafeAreaView>
   );
 }
@@ -175,50 +88,4 @@ const styles = StyleSheet.create({
     alignItems: 'center',
     backgroundColor: 'rgba(255,255,255,0.1)',
   },
-  content: {
-    flex: 1,
-    paddingHorizontal: 20,
-    paddingTop: 32,
-  },
-  titleSection: {
-    marginBottom: 40,
-    alignItems: 'center',
-  },
-  mainTitle: {
-    fontSize: 28,
-    fontWeight: '700',
-    marginBottom: 8,
-    textAlign: 'center',
-  },
-  subtitle: {
-    fontSize: 16,
-    textAlign: 'center',
-    lineHeight: 24,
-  },
-  optionsContainer: {
-    gap: 20,
-  },
-  uploadOption: {
-    borderRadius: 20,
-    overflow: 'hidden',
-    marginBottom: 16,
-  },
-  uploadOptionContent: {
-    borderRadius: 20,
-    padding: 20,
-    flexDirection: 'row',
-    alignItems: 'center',
-  },
-  uploadIconContainer: {
-    marginRight: 16,
-  },
-  uploadIconBackground: {
-    width: 56,
-    height: 56,
-    borderRadius: 14,
-    justifyContent: 'center',
-    alignItems: 'center',
-    shadowColor: '#000',
-    shadowOffset: { width: 0, height: 2 },
-    shadowOpacity: 0.1,
-    shadowRadius: 4,
-    elevation: 3,
-  },
-  uploadContent: {
-    flex: 1,
-  },
-  uploadTitle: {
-    fontSize: 18,
-    fontWeight: '700',
-    marginBottom: 4,
-  },
-  uploadDescription: {
-    fontSize: 14,
-    lineHeight: 20,
-  },
 });