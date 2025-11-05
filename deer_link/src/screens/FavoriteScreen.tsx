// Favorite Screen

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import MerchantCard from '../components/wifi/MerchantCard';
import EmptyState from '../components/common/EmptyState';
import { colors, spacing } from '@constants/theme';
import type { MerchantInfo } from '@types';

// Favorite offers keys for translations
const FAVORITE_OFFER_KEYS = [
  { id: '1', key: 'starbucks', category: 'cafe', distance: 120, offerKey: 'starbucks_offer' },
  { id: '2', key: 'kfc', category: 'restaurant', distance: 200, offerKey: 'kfc_offer' },
  { id: '3', key: 'cinema_paradise', category: 'entertainment', distance: 400, offerKey: 'cinema_offer' },
];

export default function FavoriteScreen() {
  const { t } = useTranslation();

  // Generate offers from translation keys
  const offers: MerchantInfo[] = FAVORITE_OFFER_KEYS.map((item) => ({
    id: item.id,
    name: t(`wifi.merchants.${item.key}`),
    category: item.category as 'cafe' | 'restaurant' | 'shop' | 'entertainment',
    distance: item.distance,
    offer: t(`wifi.offers.${item.offerKey}`),
  }));

  if (offers.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title={t('favorite.no_offers')}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {offers.map((offer) => (
        <MerchantCard key={offer.id} merchant={offer} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
});
