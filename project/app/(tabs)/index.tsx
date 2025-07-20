import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Camera,
  TrendingUp,
  Brain,
  ArrowRight,
  Receipt,
  Moon,
  Sun,
  LogIn,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LoginModal } from '@/components/LoginModal';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string[];
  isDark: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, isDark }) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.featureCard}>
    <View style={[styles.featureCardContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
      <LinearGradient colors={gradient} style={styles.featureIconContainer}>
        {icon}
      </LinearGradient>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{description}</Text>
      </View>
    </View>
  </BlurView>
);

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGetStarted = () => {
    router.push('/action-selection');
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={backgroundColor} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={isDark ? ['#1E293B', '#334155', '#475569'] : ['#F8FAFC', '#E2E8F0', '#CBD5E1']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.themeToggleBlur}>
                {isDark ? <Sun size={20} color="#FCD34D" /> : <Moon size={20} color="#6366F1" />}
              </BlurView>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.loginBlur}>
                <LogIn size={18} color={isDark ? '#FFFFFF' : '#1F2937'} />
                <Text style={[styles.loginText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Login</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.logoBackground}>
                <Receipt size={28} color="#2563EB" strokeWidth={2.5} />
              </BlurView>
              <Text style={[styles.logoText, { color: textColor }]}>hisab.ai</Text>
            </View>
            <Text style={[styles.tagline, { color: subtextColor }]}>Smart Financial Intelligence</Text>
            
            <View style={styles.statsContainer}>
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.statItem}>
                <Sparkles size={16} color="#10B981" />
                <Text style={[styles.statText, { color: textColor }]}>AI-Powered</Text>
              </BlurView>
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.statItem}>
                <Shield size={16} color="#3B82F6" />
                <Text style={[styles.statText, { color: textColor }]}>Secure</Text>
              </BlurView>
              <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={styles.statItem}>
                <Zap size={16} color="#F59E0B" />
                <Text style={[styles.statText, { color: textColor }]}>Real-time</Text>
              </BlurView>
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Core Features</Text>
          
          <FeatureCard
            icon={<Camera size={22} color="#FFFFFF" strokeWidth={2} />}
            title="Smart Receipt Parsing"
            description="AI-powered data extraction from receipts"
            gradient={['#F97316', '#FB923C']}
            isDark={isDark}
          />
          
          <FeatureCard
            icon={<TrendingUp size={22} color="#FFFFFF" strokeWidth={2} />}
            title="Expense Tracking"
            description="Real-time categorization and insights"
            gradient={['#06B6D4', '#22D3EE']}
            isDark={isDark}
          />
          
          <FeatureCard
            icon={<Brain size={22} color="#FFFFFF" strokeWidth={2} />}
            title="Financial Intelligence"
            description="Personalized savings recommendations"
            gradient={['#8B5CF6', '#A78BFA']}
            isDark={isDark}
          />
        </View>

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={styles.ctaContainer}>
            <Text style={[styles.ctaMainText, { color: textColor }]}>Transform Your Finances</Text>
            <Text style={[styles.ctaSubText, { color: subtextColor }]}>
              Start your journey to smarter spending today
            </Text>
            
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#2563EB', '#3B82F6']}
                style={styles.getStartedGradient}
              >
                <Text style={styles.getStartedText}>GET STARTED</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </View>
      </ScrollView>
      
      <LoginModal 
        visible={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  loginBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBackground: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featureCardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ctaContainer: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ctaMainText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 26,
  },
  ctaSubText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  getStartedButton: {
    width: width * 0.7,
    height: 50,
    borderRadius: 25,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});