import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Receipt,
  Store,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';
import { ProcessReceiptResponse } from '@/services/api';

interface ExpenseCardProps {
  receipt: ProcessReceiptResponse;
  isDark: boolean;
  textColor: string;
  subtextColor: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ receipt, isDark, textColor, subtextColor }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'processing':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'success':
        return ['#10B981', '#34D399'];
      case 'error':
        return ['#EF4444', '#F87171'];
      case 'processing':
        return ['#F59E0B', '#FBBF24'];
      default:
        return ['#6B7280', '#9CA3AF'];
    }
  };

  return (
    <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.expenseCard}>
      <View style={[styles.expenseCardContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
        {/* Header */}
        <View style={styles.expenseHeader}>
          <View style={styles.expenseHeaderLeft}>
            <LinearGradient
              colors={getStatusGradient(receipt.status)}
              style={styles.expenseIcon}
            >
              <Receipt size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.expenseHeaderInfo}>
              <Text style={[styles.merchantName, { color: textColor }]}>
                {receipt.summary?.merchant_name || 'Unknown Merchant'}
              </Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(receipt.status) }]} />
                <Text style={[styles.statusText, { color: subtextColor }]}>
                  {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={[styles.totalAmount, { color: textColor }]}>
            {receipt.summary?.currency || '$'} {receipt.summary?.total_amount?.toFixed(2) || '0.00'}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.expenseDetails}>
          {receipt.summary?.date && (
            <View style={styles.detailRow}>
              <Calendar size={16} color={subtextColor} />
              <Text style={[styles.detailText, { color: subtextColor }]}>
                {receipt.summary.date}
              </Text>
            </View>
          )}
          
          {receipt.items && receipt.items.length > 0 && (
            <View style={styles.detailRow}>
              <Package size={16} color={subtextColor} />
              <Text style={[styles.detailText, { color: subtextColor }]}>
                {receipt.items.length} item{receipt.items.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {receipt.summary?.tax_amount && (
            <View style={styles.detailRow}>
              <DollarSign size={16} color={subtextColor} />
              <Text style={[styles.detailText, { color: subtextColor }]}>
                Tax: {receipt.summary.currency} {receipt.summary.tax_amount.toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Items Preview */}
        {receipt.items && receipt.items.length > 0 && (
          <View style={styles.itemsPreview}>
            <Text style={[styles.itemsTitle, { color: textColor }]}>Items:</Text>
            <View style={styles.itemsList}>
              {receipt.items.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.itemPreview}>
                  <Text style={[styles.itemName, { color: subtextColor }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: textColor }]}>
                    {receipt.summary?.currency || '$'}{item.price.toFixed(2)}
                  </Text>
                </View>
              ))}
              {receipt.items.length > 3 && (
                <Text style={[styles.moreItems, { color: subtextColor }]}>
                  +{receipt.items.length - 3} more items
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </BlurView>
  );
};

interface EmptyStateProps {
  isDark: boolean;
  textColor: string;
  subtextColor: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isDark, textColor, subtextColor }) => (
  <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.emptyState}>
    <View style={[styles.emptyStateContent, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}>
      <LinearGradient colors={['#6B7280', '#9CA3AF']} style={styles.emptyIcon}>
        <Receipt size={32} color="#FFFFFF" />
      </LinearGradient>
      <Text style={[styles.emptyTitle, { color: textColor }]}>No Receipts Yet</Text>
      <Text style={[styles.emptyDescription, { color: subtextColor }]}>
        Start by uploading your first receipt to track your expenses
      </Text>
    </View>
  </BlurView>
);

export const ExpensesList: React.FC = () => {
  const { isDark } = useTheme();
  const { receipts, isLoading } = useApp();

  const textColor = isDark ? '#FFFFFF' : '#1F2937';
  const subtextColor = isDark ? '#D1D5DB' : '#6B7280';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <BlurView intensity={isDark ? 20 : 80} tint={isDark ? 'dark' : 'light'} style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: textColor }]}>Loading expenses...</Text>
        </BlurView>
      </View>
    );
  }

  if (receipts.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState isDark={isDark} textColor={textColor} subtextColor={subtextColor} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Your Expenses</Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} processed
        </Text>
      </View>

      <View style={styles.expensesList}>
        {receipts.map((receipt, index) => (
          <ExpenseCard
            key={index}
            receipt={receipt}
            isDark={isDark}
            textColor={textColor}
            subtextColor={subtextColor}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  expensesList: {
    paddingBottom: 20,
  },
  expenseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  expenseCardContent: {
    borderRadius: 16,
    padding: 16,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseHeaderInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  expenseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  itemsPreview: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.3)',
    paddingTop: 12,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemsList: {
    gap: 4,
  },
  itemPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreItems: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 100,
  },
  emptyStateContent: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 100,
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});