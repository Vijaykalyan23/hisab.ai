import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Receipt,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Moon,
  Sun,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface UploadOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  gradient: string[];
  isDark: boolean;
}

const UploadOption: React.FC<UploadOptionProps> = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  gradient,
  isDark
}) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.uploadOption}>
    <TouchableOpacity
      style={[styles.uploadOptionContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.uploadIconContainer}>
        <LinearGradient
          colors={gradient}
          style={styles.uploadIconBackground}
        >
          {icon}
        </LinearGradient>
      </View>
      <View style={styles.uploadContent}>
        <Text style={[styles.uploadTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{title}</Text>
        <Text style={[styles.uploadDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{description}</Text>
      </View>
    </TouchableOpacity>
  </BlurView>
);

export default function UploadReceiptScreen() {
  const { isDark, toggleTheme } = useTheme();

  const handleGoBack = () => {
    router.back();
  };


  const handleTakePhoto = () => {
    Alert.alert('Camera', 'Opening camera to take a photo of your receipt...');
  };

  const handleUploadFromGallery = () => {
    Alert.alert('Gallery', 'Opening gallery to select a receipt image...');
  };

  const handleScanDocument = () => {
    Alert.alert('Document Scanner', 'Opening document scanner...');
  };

  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.backButtonContainer}>
            <ArrowLeft size={24} color="#2563EB" strokeWidth={2.5} />
          </BlurView>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#2563EB', '#3B82F6']}
            style={styles.logoBackground}
          >
            <Receipt size={24} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
          <Text style={[styles.logoText, { color: textColor }]}>hisab.ai</Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.themeToggleBlur}>
            {isDark ? <Sun size={20} color="#FCD34D" /> : <Moon size={20} color="#6366F1" />}
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: textColor }]}>Upload Receipt</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Choose how you'd like to capture your receipt
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <UploadOption
            icon={<Camera size={28} color="#FFFFFF" strokeWidth={2} />}
            title="Take Photo"
            description="Capture receipt with camera"
            onPress={handleTakePhoto}
            gradient={['#10B981', '#34D399']}
            isDark={isDark}
          />
          
          <UploadOption
            icon={<ImageIcon size={28} color="#FFFFFF" strokeWidth={2} />}
            title="Upload from Gallery"
            description="Select from your photos"
            onPress={handleUploadFromGallery}
            gradient={['#3B82F6', '#60A5FA']}
            isDark={isDark}
          />
          
          <UploadOption
            icon={<FileText size={28} color="#FFFFFF" strokeWidth={2} />}
            title="Scan Document"
            description="Use document scanner"
            onPress={handleScanDocument}
            gradient={['#8B5CF6', '#A78BFA']}
            isDark={isDark}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBackground: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  themeToggle: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  themeToggleBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 20,
  },
  uploadOption: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  uploadOptionContent: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIconContainer: {
    marginRight: 16,
  },
  uploadIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadContent: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  uploadDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});