// Merchant Offer Card - 精确按Figma还原（响应式适配）

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { scale, scaleFont, screenWidth } from '../../utils/scale';

interface MerchantOffer {
  id: string;
  name: string;
  salesInfo?: string;
  distance: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  imageUrl?: string;
  imageHeight?: number; // 346 或 464
}

interface MerchantOfferCardProps {
  offer: MerchantOffer;
  onPress: () => void;
}

export default function MerchantOfferCard({ offer, onPress }: MerchantOfferCardProps) {
  // 计算卡片宽度：(屏幕宽度 - 左右padding - 中间gap) / 2
  const cardWidth = (screenWidth - scale(30) - scale(12)) / 2;
  // 按比例缩放图片高度
  const imageHeight = scale(offer.imageHeight || 346);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: cardWidth,
        marginBottom: scale(12),
      }}
    >
      {/* 图片区域 */}
      <View
        style={{
          width: cardWidth,
          height: imageHeight,
          borderTopLeftRadius: scale(20),
          borderTopRightRadius: scale(20),
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 背景图片 */}
        {offer.imageUrl ? (
          <Image
            source={{ uri: offer.imageUrl }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f6f8f7',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 80 }}>🏪</Text>
          </View>
        )}

        {/* 底部标签 */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* 团购标签 */}
          <View
            style={{
              height: scale(38),
              backgroundColor: '#ff6600',
              paddingHorizontal: scale(12),
              paddingVertical: scale(4),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Source Han Sans CN',
                fontWeight: '400',
                fontSize: scaleFont(22),
                lineHeight: scaleFont(28),
                color: 'white',
              }}
            >
              团购
            </Text>
          </View>

          {/* 距离标签 */}
          <View
            style={{
              height: scale(38),
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingHorizontal: scale(12),
              paddingVertical: scale(4),
              borderTopRightRadius: scale(10),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Source Han Sans CN',
                fontWeight: '400',
                fontSize: scaleFont(22),
                lineHeight: scaleFont(28),
                color: 'white',
              }}
            >
              {offer.distance}
            </Text>
          </View>
        </View>
      </View>

      {/* 文字区域 */}
      <View
        style={{
          width: cardWidth,
          backgroundColor: 'white',
          borderBottomLeftRadius: scale(20),
          borderBottomRightRadius: scale(20),
          paddingHorizontal: scale(14),
          paddingVertical: scale(10),
        }}
      >
        <View style={{ gap: scale(8) }}>
          {/* 标题+销量 */}
          <View style={{ gap: scale(6) }}>
            {/* 标题 - 26px, 2行省略 */}
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '400',
                fontSize: scaleFont(26),
                lineHeight: scaleFont(38),
                color: '#333333',
              }}
              numberOfLines={2}
            >
              {offer.name}
            </Text>

            {/* 销量信息 - 22px */}
            {offer.salesInfo && (
              <Text
                style={{
                  fontFamily: 'Source Han Sans CN',
                  fontWeight: '400',
                  fontSize: scaleFont(22),
                  lineHeight: scaleFont(28),
                  color: '#878c99',
                }}
                numberOfLines={1}
              >
                {offer.salesInfo}
              </Text>
            )}
          </View>

          {/* 价格区域 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            {/* 左侧价格组 */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: scale(4) }}>
              {/* ¥符号 - 22px */}
              <Text
                style={{
                  fontFamily: 'Source Han Sans CN',
                  fontWeight: '400',
                  fontSize: scaleFont(22),
                  lineHeight: scaleFont(30),
                  color: '#ee6757',
                }}
              >
                ¥
              </Text>

              {/* 当前价格 - 32px */}
              <Text
                style={{
                  fontFamily: 'Noto Sans CJK SC',
                  fontWeight: '500',
                  fontSize: scaleFont(32),
                  lineHeight: scaleFont(38),
                  color: '#ee6757',
                }}
              >
                {offer.currentPrice}
              </Text>

              {/* 原价 - 22px + 删除线 */}
              {offer.originalPrice && (
                <Text
                  style={{
                    fontFamily: 'Source Han Sans CN',
                    fontWeight: '400',
                    fontSize: scaleFont(22),
                    lineHeight: scaleFont(30),
                    color: '#878c99',
                    textDecorationLine: 'line-through',
                  }}
                >
                  ¥{offer.originalPrice}
                </Text>
              )}
            </View>

            {/* 折扣标签 - 22px */}
            {offer.discount && (
              <Text
                style={{
                  fontFamily: 'Source Han Sans CN',
                  fontWeight: '400',
                  fontSize: scaleFont(22),
                  lineHeight: scaleFont(28),
                  color: '#ff3b30',
                }}
              >
                {offer.discount}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
