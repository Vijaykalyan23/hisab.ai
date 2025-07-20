import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, Receipt, MessageCircle, TrendingUp, ChartPie as PieChart, Target, Lightbulb, DollarSign, Moon, Sun, Bot } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatBot } from '@/components/ChatBot';

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string[];
  isDark: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ icon, title, description, gradient, isDark }) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.insightCard}>
    <View
      style={[styles.insightCardContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}
    >
      <View style={styles.insightIconContainer}>
        <LinearGradient
          colors={gradient}
          style={styles.insightIconBackground}
        >
          {icon}
        </LinearGradient>
      </View>
      <View style={styles.insightContent}>
        <Text style={[styles.insightTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>{title}</Text>
        <Text style={[styles.insightDescription, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{description}</Text>
      </View>
    </View>
  </BlurView>
);

export default function InsightsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [showChatBot, setShowChatBot] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  if (showChatBot) {
    return <ChatBot onClose={() => setShowChatBot(false)} />;
  }

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <View style={styles.titleIconContainer}>
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              style={styles.titleIconBackground}
            >
              <MessageCircle size={32} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
          </View>
          <Text style={[styles.mainTitle, { color: textColor }]}>Get Insights From Us</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Discover personalized financial insights and recommendations
          </Text>
        </View>

        <View style={styles.insightsContainer}>
          <InsightCard
            icon={<TrendingUp size={24} color="#FFFFFF" strokeWidth={2} />}
            title="Spending Trends"
            description="Analyze your spending patterns and identify areas for improvement"
            gradient={['#10B981', '#34D399']}
            isDark={isDark}
          />
          
          <InsightCard
            icon={<PieChart size={24} color="#FFFFFF" strokeWidth={2} />}
            title="Category Breakdown"
            description="See how your money is distributed across different categories"
            gradient={['#3B82F6', '#60A5FA']}
            isDark={isDark}
          />
          
          <InsightCard
            icon={<Target size={24} color="#FFFFFF" strokeWidth={2} />}
            title="Budget Goals"
            description="Set and track your financial goals with smart recommendations"
            gradient={['#8B5CF6', '#A78BFA']}
            isDark={isDark}
          />
          
          <InsightCard
            icon={<Lightbulb size={24} color="#FFFFFF" strokeWidth={2} />}
            title="Smart Tips"
            description="Get personalized tips to optimize your spending and save more"
            gradient={['#F59E0B', '#FBBF24']}
            isDark={isDark}
          />
          
          <InsightCard
            icon={<DollarSign size={24} color="#FFFFFF" strokeWidth={2} />}
            title="Savings Opportunities"
            description="Discover potential savings based on your spending habits"
            gradient={['#EF4444', '#F87171']}
            isDark={isDark}
          />
        </View>

        <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.comingSoonSection}>
          <View style={[styles.comingSoonContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
            <Text style={[styles.comingSoonTitle, { color: isDark ? '#60A5FA' : '#2563EB' }]}>Coming Soon!</Text>
            <Text style={[styles.comingSoonDescription, { color: subtextColor }]}>
            We're working on bringing you AI-powered insights that will help you make smarter financial decisions. Stay tuned for updates!
          </Text>
          </View>
        </BlurView>
        
        {/* Chatbot Button */}
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => setShowChatBot(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.chatbotGradient}
          >
            <Bot size={24} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.chatbotText}>Ask AI Assistant</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  titleIconContainer: {
    marginBottom: 16,
  },
  titleIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
    paddingHorizontal: 20,
  },
  insightsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  insightCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  insightCardContent: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIconContainer: {
    marginRight: 16,
  },
  insightIconBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoonSection: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
  comingSoonContent: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  chatbotButton: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chatbotGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  chatbotText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});