// Merchant Offer Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {offer.imageUrl ? (
        <Image source={{ uri: offer.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderIcon}>🏪</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {offer.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {offer.category}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.distance}>{offer.distance}</Text>
          <View style={styles.offerBadge}>
            <Text style={styles.offerText} numberOfLines={1}>
              {offer.offer}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distance: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  offerBadge: {
    backgroundColor: colors.status.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  offerText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '600',
  },
});
