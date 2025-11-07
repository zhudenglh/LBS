// Merchant Offer Grid Component - 附近优惠（完全按照Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';
import { getFigmaAssetUrl } from '../../utils/figma';

export interface MerchantOffer {
  id: string;
  name: string;
  image: string;                                // Figma图片URL
  price: string;
  originalPrice?: string;
  distance: string;
  badge?: string;
}

interface MerchantOfferGridProps {
  title: string;
  offers: MerchantOffer[];
  onOfferPress?: (offer: MerchantOffer) => void;
}

// Figma图片资源
const FIGMA_IMAGES = {
  moreArrow: 'http://localhost:3845/assets/394c3b6c38e62d4a113ac138fe357650f8786c6d.svg',
  offerImage1: 'http://localhost:3845/assets/efa45b8125454a6ce5f93d2d281e00d9e6e285e6.png',
  offerImage2: 'http://localhost:3845/assets/c2cc84a614c67e533bbee5d32d51b26ede5d6623.png',
  rectangle9707: 'http://localhost:3845/assets/5a837212022346c1333e4640725f92194cd12498.svg',
  rectangle9708: 'http://localhost:3845/assets/e784c26e4c4f8250677dc40adc01c310e81c315f.svg',
};

export default function MerchantOfferGridNew({ title, offers, onOfferPress }: MerchantOfferGridProps) {
  return (
    <View style={styles.container}>
      {/* 标题行 */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        {/* 更多优惠按钮 */}
        <View style={styles.moreButton}>
          <Text style={styles.moreText}>更多优惠</Text>
          <RemoteSvg
            uri={FIGMA_IMAGES.moreArrow}
            width={7}
            height={11}
          />
        </View>
      </View>

      {/* 优惠列表 */}
      <View style={styles.offerList}>
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            style={styles.offerCard}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.7}
          >
            {/* 渐变背景 */}
            <View style={styles.gradientBg} />

            {/* 左侧：图片 */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getFigmaAssetUrl(offer.image) }}
                style={styles.offerImage}
                resizeMode="cover"
              />
            </View>

            {/* 右侧：信息 */}
            <View style={styles.infoContainer}>
              {/* 标题 */}
              <Text style={styles.offerTitle} numberOfLines={1}>
                {offer.name}
              </Text>

              {/* 距离和标签 */}
              <Text style={styles.distanceText} numberOfLines={1}>
                {offer.distance}
                {offer.badge && ` ｜ ${offer.badge}`}
              </Text>
            </View>

            {/* 价格区域 */}
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSymbol}>¥</Text>
                <Text style={styles.priceValue}>{offer.price}</Text>
              </View>
              {offer.originalPrice && (
                <Text style={styles.originalPrice}>{offer.originalPrice}</Text>
              )}
            </View>

            {/* 抢购按钮 */}
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>抢购</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingTop: 17,                             // Figma: 34px ÷ 2
    paddingBottom: 15,
    backgroundColor: colors.white,
  },

  // 标题行
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,                           // Figma精确间距
  },

  title: {
    fontSize: 16,                               // Figma: 32px ÷ 2
    lineHeight: 20,                             // 16 × 1.25 (防止截断)
    fontWeight: '700',
    color: colors.text.primary,                 // #333333
  },

  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },

  moreText: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
  },

  moreArrow: {
    width: 7,                                   // Figma: 14px ÷ 2
    height: 11,                                 // Figma: 22px ÷ 2
  },

  // 优惠列表
  offerList: {
    gap: 10.5,                                  // Figma精确间距
  },

  // 优惠卡片
  offerCard: {
    height: 110,                                // Figma: 220px ÷ 2
    borderRadius: 8,                            // Figma: 16px ÷ 2
    position: 'relative',
    overflow: 'hidden',
  },

  // 渐变背景
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,                                 // Figma: 180px ÷ 2
    backgroundColor: '#fff6f6',
  },

  // 图片容器
  imageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 90,                                  // Figma: 180px ÷ 2
    height: 90,                                 // Figma: 180px ÷ 2
    borderRadius: 8,                            // Figma: 16px ÷ 2
    overflow: 'hidden',
  },

  offerImage: {
    width: '100%',
    height: '100%',
  },

  // 信息容器
  infoContainer: {
    position: 'absolute',
    left: 97.5,                                 // Figma: 195px ÷ 2
    top: 5,                                     // Figma: 10px ÷ 2
    right: 70,
  },

  offerTitle: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 7.5,                          // Figma: 15px ÷ 2
  },

  distanceText: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '400',
    color: colors.busPage.stationText,          // #5d606a
  },

  // 价格容器
  priceContainer: {
    position: 'absolute',
    left: 119,                                  // Figma: 238px ÷ 2
    bottom: 12,                                 // Figma: 24px ÷ 2
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,                                     // Figma: 6px ÷ 2
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  priceSymbol: {
    fontSize: 10,                               // Figma: 20px ÷ 2
    lineHeight: 13,                             // 10 × 1.3 (防止截断)
    fontWeight: '700',
    color: '#ff5740',
    marginBottom: 4,                            // 对齐调整
  },

  priceValue: {
    fontSize: 16,                               // Figma: 32px ÷ 2
    lineHeight: 20,                             // 16 × 1.25 (防止截断)
    fontWeight: '700',
    color: '#ff5740',
  },

  originalPrice: {
    fontSize: 10,                               // Figma: 20px ÷ 2
    lineHeight: 13,                             // 10 × 1.3 (防止截断)
    fontWeight: '400',
    color: '#666666',
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },

  // 抢购按钮
  buyButton: {
    position: 'absolute',
    right: 14,                                  // Figma: 28px ÷ 2
    bottom: 10,                                 // Figma: 20px ÷ 2
    paddingHorizontal: 15,                      // Figma: 30px ÷ 2
    paddingVertical: 5,                         // Figma: 10px ÷ 2
    borderRadius: 50,                           // Figma: 100px ÷ 2
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  buyButtonText: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '500',
    color: colors.white,
  },
});
