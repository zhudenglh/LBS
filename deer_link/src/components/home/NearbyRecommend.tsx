// Nearby Recommendations Component

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

type RecommendType = 'recommend' | 'food' | 'fun' | 'scenic';

interface Place {
  name: string;
  description: string;
  distance: string;
  emoji: string;
  offer?: string;
}

// Keys for translations
const PLACE_KEYS: Record<RecommendType, Array<{ key: string; emoji: string; distance: string; offerKey?: string }>> = {
  recommend: [
    { key: 'deji_plaza', emoji: '🏢', distance: '200m', offerKey: 'discount_200_30' },
    { key: 'laomendong', emoji: '🏛️', distance: '1.2km', offerKey: 'student_20_off' },
  ],
  food: [
    { key: 'xiaolongbao', emoji: '🥟', distance: '150m', offerKey: 'new_store_20_off' },
    { key: 'duck_restaurant', emoji: '🦆', distance: '300m' },
  ],
  fun: [
    { key: 'cinema', emoji: '🎬', distance: '400m', offerKey: 'member_20_off' },
    { key: 'ktv', emoji: '🎤', distance: '600m', offerKey: 'afternoon_50_off' },
  ],
  scenic: [
    { key: 'xuanwu_lake', emoji: '🌊', distance: '2km', offerKey: 'free_admission' },
    { key: 'zhongshan_mausoleum', emoji: '⛰️', distance: '8km', offerKey: 'free_admission' },
  ],
};

export default function NearbyRecommend() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<RecommendType>('recommend');

  const tabs: RecommendType[] = ['recommend', 'food', 'fun', 'scenic'];

  // Generate places from translation keys
  const getPlaces = (type: RecommendType): Place[] => {
    return PLACE_KEYS[type].map((item) => ({
      name: t(`home.nearby.places.${item.key}`),
      description: t(`home.nearby.places.${item.key}_desc`),
      distance: item.distance,
      emoji: item.emoji,
      offer: item.offerKey ? t(`home.nearby.offers.${item.offerKey}`) : undefined,
    }));
  };

  return (
    <View className="mb-xl">
      <Text className="text-lg font-bold text-text-primary mb-md">{t('home.nearby.title')}</Text>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-md">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`px-lg py-sm mr-md rounded-md ${activeTab === tab ? 'bg-primary' : 'bg-white'}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-base ${activeTab === tab ? 'text-white font-semibold' : 'text-text-primary'}`}>
              {t(`home.nearby.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View className="gap-md">
        {getPlaces(activeTab).map((place, index) => (
          <View key={index} className="bg-white rounded-md p-lg ios:shadow-md-rn android:elevation-3">
            <View className="flex-row items-center">
              <Text className="text-3xl mr-md">{place.emoji}</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-text-primary mb-xs">{place.name}</Text>
                <Text className="text-sm text-text-secondary">{place.description}</Text>
              </View>
              <Text className="text-sm text-text-disabled">{place.distance}</Text>
            </View>
            {place.offer && (
              <View className="flex-row items-center mt-md pt-md border-t border-border">
                <Text className="text-base mr-xs">💰</Text>
                <Text className="text-sm text-secondary font-semibold">{place.offer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
