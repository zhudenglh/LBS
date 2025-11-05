// Nearby Recommendations Component

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

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
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.nearby.title')}</Text>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {t(`home.nearby.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>
        {getPlaces(activeTab).map((place, index) => (
          <View key={index} style={styles.placeCard}>
            <View style={styles.placeHeader}>
              <Text style={styles.placeEmoji}>{place.emoji}</Text>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeDescription}>{place.description}</Text>
              </View>
              <Text style={styles.placeDistance}>{place.distance}</Text>
            </View>
            {place.offer && (
              <View style={styles.offerContainer}>
                <Text style={styles.offerIcon}>💰</Text>
                <Text style={styles.offerText}>{place.offer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tabs: {
    marginBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    gap: spacing.md,
  },
  placeCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.md,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  placeDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  placeDistance: {
    fontSize: fontSize.sm,
    color: colors.text.disabled,
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  offerIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  offerText: {
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontWeight: '600',
  },
});
