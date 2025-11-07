// Merchant Offer Grid Component - 附近优惠网格（2列）

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface MerchantOffer {
  id: string;
  name: string;              // 商户名称
  image: string;             // 图片URL
  price: string;             // 价格，如"¥12"
  originalPrice?: string;    // 原价（划线价），如"¥18"
  distance: string;          // 距离，如"120m"
  badge?: string;            // 标签，如"团购"
}

interface MerchantOfferGridProps {
  title: string;             // 标题，如"附近优惠·东浦路"
  offers: MerchantOffer[];   // 优惠列表
  onOfferPress?: (offer: MerchantOffer) => void;  // 点击事件
}

export default function MerchantOfferGrid({ title, offers, onOfferPress }: MerchantOfferGridProps) {
  // 计算每个卡片宽度（2列）
  const cardWidth = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.grid}>
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.7}
          >
            {/* 商户图片 */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: offer.image }}
                style={styles.image}
                resizeMode="cover"
              />

              {/* 距离标签 */}
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{offer.distance}</Text>
              </View>

              {/* 团购标签 */}
              {offer.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{offer.badge}</Text>
                </View>
              )}
            </View>

            {/* 商户名称 */}
            <Text style={styles.merchantName} numberOfLines={1}>
              {offer.name}
            </Text>

            {/* 价格区域 */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>{offer.price}</Text>
              {offer.originalPrice && (
                <Text style={styles.originalPrice}>{offer.originalPrice}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,      // 16px
    paddingVertical: spacing.lg,        // 16px
    backgroundColor: colors.busPage.sectionBg,  // #F5F5F5
  },

  title: {
    fontSize: 16,                       // Figma: 32px ÷ 2
    lineHeight: 20,                     // 16 × 1.25
    fontWeight: '600',
    color: colors.busPage.stationText,  // #333333
    marginBottom: spacing.md,           // 12px
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,                    // 12px between cards
  },

  card: {
    backgroundColor: colors.busPage.cardBg,  // #FFFFFF
    borderRadius: borderRadius.sm,      // 6px (Figma: 12px ÷ 2)
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // 图片容器
  imageContainer: {
    width: '100%',
    height: 100,                        // Figma: 200px ÷ 2
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  // 距离标签（右上角）
  distanceBadge: {
    position: 'absolute',
    top: spacing.xs,                    // 4px
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: spacing.xs,      // 4px
    paddingVertical: 2,
    borderRadius: 4,
  },

  distanceText: {
    fontSize: 10,                       // Figma: 20px ÷ 2
    lineHeight: 13,                     // 10 × 1.3
    fontWeight: '400',
    color: colors.white,
  },

  // 团购标签（左上角）
  badge: {
    position: 'absolute',
    top: spacing.xs,                    // 4px
    left: spacing.xs,
    backgroundColor: colors.badge.orange,  // #ff6600
    paddingHorizontal: spacing.xs,      // 4px
    paddingVertical: 2,
    borderRadius: 4,
  },

  badgeText: {
    fontSize: 10,                       // Figma: 20px ÷ 2
    lineHeight: 13,                     // 10 × 1.3
    fontWeight: '500',
    color: colors.white,
  },

  // 商户名称
  merchantName: {
    fontSize: 13,                       // Figma: 26px ÷ 2
    lineHeight: 16,                     // 13 × 1.23
    fontWeight: '500',
    color: colors.text.merchantTitle,   // #333333
    paddingHorizontal: spacing.sm,      // 8px
    paddingTop: spacing.sm,             // 8px
    paddingBottom: spacing.xs,          // 4px
  },

  // 价格行
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,      // 8px
    paddingBottom: spacing.sm,          // 8px
  },

  price: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 17,                     // 14 × 1.2
    fontWeight: '600',
    color: colors.price.current,        // #ee6757 (红色)
    marginRight: spacing.xs,            // 4px
  },

  originalPrice: {
    fontSize: 11,                       // Figma: 22px ÷ 2
    lineHeight: 14,                     // 11 × 1.27
    fontWeight: '400',
    color: colors.price.original,       // #878c99 (灰色)
    textDecorationLine: 'line-through',
  },
});
