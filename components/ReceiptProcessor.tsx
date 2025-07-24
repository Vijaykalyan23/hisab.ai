import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Camera,
  ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Receipt,
  DollarSign,
  Calendar,
  Store,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import { pickImageFromCamera, pickImageFromGallery, ProcessReceiptResponse } from '@/services/api';

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

interface ProcessingStateProps {
  isDark: boolean;
  textColor: string;
  subtextColor: string;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ isDark, textColor, subtextColor }) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.processingContainer}>
    <View style={[styles.processingContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
      <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.processingIcon}>
        <Receipt size={32} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.processingTitle, { color: textColor }]}>Processing Receipt</Text>
      <Text style={[styles.processingDescription, { color: subtextColor }]}>
        Our AI is analyzing your receipt and extracting all the details...
      </Text>
    </View>
  </BlurView>
);

interface ResultsDisplayProps {
  result: ProcessReceiptResponse;
  isDark: boolean;
  textColor: string;
  subtextColor: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isDark, textColor, subtextColor }) => {
  const handleWalletPass = async () => {
    if (result.wallet_pass_link) {
      try {
        const supported = await Linking.canOpenURL(result.wallet_pass_link);
        if (supported) {
          await Linking.openURL(result.wallet_pass_link);
        } else {
          Alert.alert('Error', 'Cannot open wallet pass link');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open wallet pass');
      }
    }
  };

  return (
    <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
      {/* Status */}
      <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.statusCard}>
        <View style={[styles.statusContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
          <View style={styles.statusHeader}>
            {result.status === 'success' ? (
              <CheckCircle size={24} color="#10B981" />
            ) : (
              <AlertCircle size={24} color="#EF4444" />
            )}
            <Text style={[styles.statusTitle, { color: textColor }]}>
              {result.status === 'success' ? 'Receipt Processed Successfully' : 'Processing Error'}
            </Text>
          </View>
          {result.message && (
            <Text style={[styles.statusMessage, { color: subtextColor }]}>{result.message}</Text>
          )}
        </View>
      </BlurView>

      {/* Summary */}
      {result.summary && (
        <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.summaryCard}>
          <View style={[styles.summaryContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Receipt Summary</Text>
            
            <View style={styles.summaryRow}>
              <Store size={20} color="#3B82F6" />
              <Text style={[styles.summaryLabel, { color: subtextColor }]}>Merchant:</Text>
              <Text style={[styles.summaryValue, { color: textColor }]}>{result.summary.merchant_name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <DollarSign size={20} color="#10B981" />
              <Text style={[styles.summaryLabel, { color: subtextColor }]}>Total:</Text>
              <Text style={[styles.summaryValue, { color: textColor }]}>
                {result.summary.currency} {result.summary.total_amount.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Calendar size={20} color="#F59E0B" />
              <Text style={[styles.summaryLabel, { color: subtextColor }]}>Date:</Text>
              <Text style={[styles.summaryValue, { color: textColor }]}>{result.summary.date}</Text>
            </View>
            
            {result.summary.tax_amount && (
              <View style={styles.summaryRow}>
                <Receipt size={20} color="#8B5CF6" />
                <Text style={[styles.summaryLabel, { color: subtextColor }]}>Tax:</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {result.summary.currency} {result.summary.tax_amount.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </BlurView>
      )}

      {/* Items */}
      {result.items && result.items.length > 0 && (
        <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.itemsCard}>
          <View style={[styles.itemsContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Items ({result.items.length})</Text>
            
            {result.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: textColor }]}>{item.name}</Text>
                  {item.category && (
                    <Text style={[styles.itemCategory, { color: subtextColor }]}>{item.category}</Text>
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemQuantity, { color: subtextColor }]}>Qty: {item.quantity}</Text>
                  <Text style={[styles.itemPrice, { color: textColor }]}>
                    {result.summary?.currency || '$'} {item.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </BlurView>
      )}

      {/* Wallet Pass */}
      {result.wallet_pass_link && (
        <TouchableOpacity style={styles.walletButton} onPress={handleWalletPass}>
          <LinearGradient colors={['#10B981', '#34D399']} style={styles.walletGradient}>
            <ExternalLink size={20} color="#FFFFFF" />
            <Text style={styles.walletText}>Add to Wallet</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export const ReceiptProcessor: React.FC = () => {
  const { isDark } = useTheme();
  const { processReceiptImage, isLoading, error, clearError } = useApp();
  const [result, setResult] = useState<ProcessReceiptResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';

  const handleImageSelected = async (imageUri: string) => {
    try {
      setSelectedImage(imageUri);
      setResult(null);
      clearError();
      
      const processedResult = await processReceiptImage(imageUri);
      setResult(processedResult);
    } catch (error) {
      console.error('Error processing receipt:', error);
      Alert.alert(
        'Processing Error',
        error instanceof Error ? error.message : 'Failed to process receipt. Please try again.',
        [{ text: 'OK', onPress: clearError }]
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      const imageUri = await pickImageFromCamera();
      if (imageUri) {
        await handleImageSelected(imageUri);
      }
    } catch (error) {
      Alert.alert('Camera Error', error instanceof Error ? error.message : 'Failed to take photo');
    }
  };

  const handleUploadFromGallery = async () => {
    try {
      const imageUri = await pickImageFromGallery();
      if (imageUri) {
        await handleImageSelected(imageUri);
      }
    } catch (error) {
      Alert.alert('Gallery Error', error instanceof Error ? error.message : 'Failed to select image');
    }
  };

  const handleScanDocument = () => {
    Alert.alert('Document Scanner', 'Document scanner feature coming soon!');
  };

  const handleReset = () => {
    setResult(null);
    setSelectedImage(null);
    clearError();
  };

  // Show results if we have them
  if (result) {
    return (
      <View style={styles.container}>
        <ResultsDisplay 
          result={result} 
          isDark={isDark} 
          textColor={textColor} 
          subtextColor={subtextColor} 
        />
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <LinearGradient colors={['#3B82F6', '#60A5FA']} style={styles.resetGradient}>
            <Text style={styles.resetText}>Process Another Receipt</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // Show processing state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ProcessingState isDark={isDark} textColor={textColor} subtextColor={subtextColor} />
      </View>
    );
  }

  // Show upload options
  return (
    <View style={styles.container}>
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

      {error && (
        <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.errorContainer}>
          <View style={[styles.errorContent, { backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.1)' }]}>
            <AlertCircle size={20} color="#EF4444" />
            <Text style={[styles.errorText, { color: '#EF4444' }]}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorDismiss}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  processingContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 100,
  },
  processingContent: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  processingIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  processingDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  statusCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statusContent: {
    borderRadius: 16,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  statusMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summaryContent: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 60,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  itemsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  itemsContent: {
    borderRadius: 16,
    padding: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  itemDetails: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  walletButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  walletGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  walletText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  resetButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  resetGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  errorContent: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  errorDismiss: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
});