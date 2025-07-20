import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  onClose?: () => void;
}

interface MessageBubbleProps {
  message: Message;
  isDark: boolean;
  textColor: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isDark, textColor }) => (
  <View style={[styles.messageContainer, message.isUser ? styles.userMessage : styles.botMessage]}>
    <View style={styles.messageHeader}>
      <View style={[styles.avatarContainer, { backgroundColor: message.isUser ? '#2563EB' : '#10B981' }]}>
        {message.isUser ? (
          <User size={16} color="#FFFFFF" />
        ) : (
          <Bot size={16} color="#FFFFFF" />
        )}
      </View>
    </View>
    <BlurView 
      intensity={isDark ? 20 : 80} 
      tint={isDark ? 'dark' : 'light'} 
      style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={[styles.messageText, { color: textColor }]}>
        {message.text}
      </Text>
    </BlurView>
  </View>
);

export const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI financial assistant. How can I help you with your expenses and financial insights today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';
  const backgroundColor = isDark ? '#0F172A' : '#FFFFFF';

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call to Gemini
    try {
      // Check if API key is available
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        // Fallback to mock responses if API key not configured
        setTimeout(() => {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: generateMockResponse(userMessage.text),
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
        }, 1500);
        return;
      }

      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful financial assistant for Hisab.ai, an expense tracking app. Please provide helpful advice about: ${userMessage.text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback to mock response on error
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateMockResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('expense') || input.includes('spending')) {
      return 'I can help you track and categorize your expenses. Upload a receipt and I\'ll extract all the details automatically using AI. Would you like to know more about expense categories or budgeting tips? (Note: Add your Gemini API key for enhanced responses)';
    } else if (input.includes('budget') || input.includes('save')) {
      return 'Great question about budgeting! Based on your spending patterns, I can suggest personalized savings strategies. I recommend the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Would you like me to analyze your current spending? (Note: Add your Gemini API key for enhanced responses)';
    } else if (input.includes('receipt') || input.includes('scan')) {
      return 'I can instantly extract data from receipts using advanced AI. Just take a photo or upload an image, and I\'ll capture merchant details, amounts, dates, and categorize items automatically. Try uploading a receipt! (Note: Add your Gemini API key for enhanced responses)';
    } else if (input.includes('insight') || input.includes('analysis')) {
      return 'I provide personalized financial insights including spending trends, category breakdowns, and smart recommendations. I can identify unusual spending patterns and suggest optimization opportunities. What specific insights interest you? (Note: Add your Gemini API key for enhanced responses)';
    } else {
      return 'I\'m here to help with all your financial questions! I can assist with expense tracking, budgeting, receipt scanning, and providing personalized insights. What would you like to explore? (Note: Add your Gemini API key for enhanced responses)';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#10B981', '#34D399']} style={styles.botAvatar}>
              <Sparkles size={20} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.headerTitle, { color: textColor }]}>AI Assistant</Text>
              <Text style={[styles.headerSubtitle, { color: subtextColor }]}>Financial Advisor</Text>
            </View>
          </View>
        </View>
      </BlurView>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isDark={isDark} textColor={textColor} />
        ))}
        
        {isLoading && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={styles.messageHeader}>
              <View style={[styles.avatarContainer, { backgroundColor: '#10B981' }]}>
                <Bot size={16} color="#FFFFFF" />
              </View>
            </View>
            <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={[styles.messageBubble, styles.botBubble]}>
              <Text style={[styles.messageText, { color: subtextColor }]}>
                Thinking...
              </Text>
            </BlurView>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
              color: textColor 
            }]}
            placeholder="Ask me about your finances..."
            placeholderTextColor={subtextColor}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient colors={['#2563EB', '#3B82F6']} style={styles.sendGradient}>
              <Send size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    marginBottom: 8,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.3)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});