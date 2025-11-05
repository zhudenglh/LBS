// Merchant Offer Card Component

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface MerchantOffer {
  id: string;
  name: string;
  category: string;
  distance: string;
  offer: string;
  imageUrl?: string;
}

interface MerchantOfferCardProps {
  offer: MerchantOffer;
  onPress: () => void;
}

export default function MerchantOfferCard({ offer, onPress }: MerchantOfferCardProps) {
  return (
    <TouchableOpacity className="bg-white rounded-lg overflow-hidden mb-md ios:shadow-md-rn android:elevation-3" onPress={onPress}>
      {offer.imageUrl ? (
        <Image source={{ uri: offer.imageUrl }} className="w-full h-[120px]" resizeMode="cover" />
      ) : (
        <View className="w-full h-[120px] bg-background items-center justify-center">
          <Text className="text-[40px]">🏪</Text>
        </View>
      )}
      <View className="p-md">
        <Text className="text-base font-semibold text-text-primary mb-xs" numberOfLines={1}>
          {offer.name}
        </Text>
        <Text className="text-sm text-text-secondary mb-sm" numberOfLines={1}>
          {offer.category}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-text-secondary">{offer.distance}</Text>
          <View className="bg-error px-sm py-xs rounded-sm">
            <Text className="text-xs text-white font-semibold" numberOfLines={1}>
              {offer.offer}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
