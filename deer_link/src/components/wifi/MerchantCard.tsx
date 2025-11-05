// Merchant Info Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';
import type { MerchantInfo } from '@types';

interface MerchantCardProps {
  merchant: MerchantInfo;
  onPress?: () => void;
}

export default function MerchantCard({ merchant, onPress }: MerchantCardProps) {
  const { t } = useTranslation();

  const getCategoryIcon = () => {
    const categoryMap: Record<string, string> = {
      restaurant: '🍽️',
      cafe: '☕',
      shop: '🏪',
      entertainment: '🎮',
      service: '🛎️',
    };
    return categoryMap[merchant.category] || '🏢';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getCategoryIcon()}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{merchant.name}</Text>
        <Text style={styles.distance}>{merchant.distance}m</Text>
        {merchant.offer && (
          <View style={styles.offerContainer}>
            <Text style={styles.offerIcon}>💰</Text>
            <Text style={styles.offerText}>{merchant.offer}</Text>
          </View>
        )}
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  distance: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  offerIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },
  offerText: {
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontWeight: '600',
  },
  arrow: {
    marginLeft: spacing.sm,
  },
  arrowIcon: {
    fontSize: 24,
    color: colors.text.disabled,
  },
});
