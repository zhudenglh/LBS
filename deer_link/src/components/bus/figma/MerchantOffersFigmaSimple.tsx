/**
 * MerchantOffers - 简化版本
 * 修复布局错乱问题
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { BUS_IMAGES } from '../../../constants/busAssets';

interface MerchantOffer {
  id: string;
  title: string;
  merchant: string;
  image: any;
  price: string;
  originalPrice?: string;
  distance: string;
  badge: string;
  tag?: string;
}

interface MerchantOffersProps {
  title?: string;
  offers?: MerchantOffer[];
  onOfferPress?: (offer: MerchantOffer) => void;
}

// 箭头图标
function ArrowRightIcon() {
  return (
    <Svg width={8} height={12} viewBox="0 0 14 23" fill="none">
      <Path
        d="M2 1.25L12 11.25L2 21.25"
        stroke="#909497"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const defaultOffers: MerchantOffer[] = [
  {
    id: '1',
    title: '可口可乐（小杯）',
    merchant: '肯德基 (全国通用)',
    image: BUS_IMAGES.offerKFC,
    price: '0.00',
    distance: '520m',
    badge: '到店消费可用',
    tag: '免费领',
  },
  {
    id: '2',
    title: '牛肉火锅双人套餐超值',
    merchant: '旺福·贵州酸汤牛肉火锅',
    image: BUS_IMAGES.offerHotpot2,
    price: '177.5',
    originalPrice: '¥308',
    distance: '1.2km',
    badge: '随时退｜过期自动退',
    tag: '抢购',
  },
];

export default function MerchantOffersFigmaSimple({
  title = '附近优惠·东浦路',
  offers = defaultOffers,
  onOfferPress
}: MerchantOffersProps) {
  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.moreButton}>
          <Text style={styles.moreText}>更多优惠</Text>
          <ArrowRightIcon />
        </View>
      </View>

      {/* 优惠卡片列表 */}
      <View style={styles.offersList}>
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.8}
            style={styles.offerItem}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                {/* 左侧图片 */}
                <Image
                  source={offer.image}
                  style={styles.offerImage}
                  resizeMode="cover"
                />

                {/* 右侧信息 */}
                <View style={styles.offerInfo}>
                  {/* 商户和标题 */}
                  <View>
                    <Text style={styles.offerTitle} numberOfLines={2}>
                      <Text style={styles.merchantName}>{offer.merchant}｜</Text>
                      <Text style={styles.offerTitleText}>{offer.title}</Text>
                    </Text>
                    <Text style={styles.offerBadge}>
                      {offer.distance} ｜ {offer.badge}
                    </Text>
                  </View>

                  {/* 价格和按钮 */}
                  <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>
                        <Text style={styles.priceSymbol}>¥</Text>{offer.price}
                      </Text>
                      {offer.originalPrice && (
                        <Text style={styles.originalPrice}>
                          {offer.originalPrice}
                        </Text>
                      )}
                    </View>

                    {/* 标签按钮 */}
                    <LinearGradient
                      colors={
                        offer.id === '1'
                          ? ['#ff352e', '#ff5b42']
                          : ['#ed6f38', '#fa6b39']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.tagButton}
                    >
                      <Text style={styles.tagText}>
                        {offer.tag}
                      </Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    marginRight: 4,
  },
  offersList: {
    paddingHorizontal: 16,
  },
  offerItem: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  offerImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  offerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  merchantName: {
    color: '#a15300',
  },
  offerTitleText: {
    color: '#000000',
  },
  offerBadge: {
    color: '#5d606a',
    fontSize: 12,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  price: {
    color: '#ff5740',
    fontWeight: 'bold',
    fontSize: 18,
  },
  priceSymbol: {
    fontSize: 12,
  },
  originalPrice: {
    color: '#666666',
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
