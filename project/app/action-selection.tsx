import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Receipt,
  Wallet,
  MessageCircle,
  Moon,
  Sun,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  gradient: string[];
  isDark: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, onPress, gradient, isDark }) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.actionCard}>
    <TouchableOpacity
      style={[styles.actionCardContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.actionIconContainer}>
        <LinearGradient
          colors={gradient}
          style={styles.actionIconBackground}
        >
          {icon}
        </LinearGradient>
      </View>
      <Text style={[styles.actionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{title}</Text>
    </TouchableOpacity>
  </BlurView>
);

export default function ActionSelectionScreen() {
  const { isDark, toggleTheme } = useTheme();

  const handleGoBack = () => {
    router.back();
  };

  const handleUploadReceipt = () => {
    // Navigate to upload receipt screen
    router.push('/upload-receipt');
  };

  const handleGetInsights = () => {
    // Navigate to insights screen
    router.push('/insights');
  };

  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1F2937';

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
        <View style={styles.actionsContainer}>
          <ActionCard
            icon={<Wallet size={32} color="#FFFFFF" strokeWidth={2} />}
            title="Upload Receipt"
            onPress={handleUploadReceipt}
            gradient={['#10B981', '#34D399']}
            isDark={isDark}
          />
          
          <ActionCard
            icon={<MessageCircle size={32} color="#FFFFFF" strokeWidth={2} />}
            title="Get Insights From Us"
            onPress={handleGetInsights}
            gradient={['#3B82F6', '#60A5FA']}
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  actionsContainer: {
    gap: 24,
  },
  actionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  actionCardContent: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  actionIconContainer: {
    marginBottom: 20,
  },
  actionIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
});