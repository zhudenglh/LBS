// Merchant Info Card Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
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
      className="flex-row items-center bg-white p-4 mb-3 rounded-md shadow-md"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="w-[48px] h-[48px] rounded-md bg-[#F5F5F5] items-center justify-center mr-3">
        <Text className="text-2xl">{getCategoryIcon()}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-text-primary mb-1">{merchant.name}</Text>
        <Text className="text-sm text-text-secondary mb-1">{merchant.distance}m</Text>
        {merchant.offer && (
          <View className="flex-row items-center mt-1">
            <Text className="text-xs mr-1">💰</Text>
            <Text className="text-sm text-secondary font-semibold">{merchant.offer}</Text>
          </View>
        )}
      </View>

      <View className="ml-2">
        <Text className="text-2xl text-text-disabled">›</Text>
      </View>
    </TouchableOpacity>
  );
}
