/**
 * MerchantOffers - Figma完整还原
 * 附近优惠卡片列表
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import { scaleWidth as sw, scaleHeight as sh, scaleFont as sf } from '../../../utils/responsive';
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
  salesInfo?: string;
}

interface MerchantOffersProps {
  title?: string;
  offers?: MerchantOffer[];
  onOfferPress?: (offer: MerchantOffer) => void;
}

// 箭头图标
function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.64} viewBox="0 0 14 23" fill="none">
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
    salesInfo: '半年售  5000+',
  },
  {
    id: '3',
    title: '牛肉火锅双人套餐超值',
    merchant: '旺福·贵州酸汤牛肉火锅',
    image: BUS_IMAGES.offerHotpot2,
    price: '177.5',
    originalPrice: '¥308',
    distance: '1.2km',
    badge: '随时退｜过期自动退',
    tag: '抢购',
    salesInfo: '半年售  5000+',
  },
];

export default function MerchantOffersFigma({
  title = '附近优惠·东浦路',
  offers = defaultOffers,
  onOfferPress
}: MerchantOffersProps) {
  return (
    <View className="bg-white" style={{ marginTop: sh(12), paddingBottom: sh(20) }}>
      {/* 标题栏 */}
      <View className="flex-row items-center justify-between px-4" style={{ paddingTop: sh(32) }}>
        <Text
          className="text-black font-bold"
          style={{
            fontSize: sf(32),
            lineHeight: sf(44),
            includeFontPadding: false,
            textAlignVertical: 'center'
          }}
        >
          {title}
        </Text>
        <View className="flex-row items-center">
          <Text
            className="text-black/40 mr-1"
            style={{
              fontSize: sf(28),
              lineHeight: sf(38),
              includeFontPadding: false,
              textAlignVertical: 'center'
            }}
          >
            更多优惠
          </Text>
          <ArrowRightIcon size={sw(14)} />
        </View>
      </View>

      {/* 优惠卡片列表 */}
      <View className="mt-4">
        {offers.map((offer, index) => (
          <TouchableOpacity
            key={offer.id}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.8}
          >
            {index === 0 ? (
              /* 第一个卡片：KFC特殊渐变样式 */
              <LinearGradient
                colors={['#fff6f6', 'rgba(255,246,246,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.68 }}
                className="mx-4 rounded-2xl"
                style={{ marginBottom: sh(12), paddingVertical: sh(16) }}
              >
                <View className="flex-row items-center px-4">
                  {/* 左侧图片 */}
                  <LinearGradient
                    colors={['#ff366a', '#ff7c4f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ width: sw(180), height: sw(180) }}
                  >
                    <Image
                      source={offer.image}
                      style={{ width: sw(180), height: sw(180) }}
                      resizeMode="cover"
                    />
                  </LinearGradient>

                  {/* 右侧信息 */}
                  <View className="flex-1 ml-3" style={{ minHeight: sw(180) }}>
                    <View className="flex-1">
                      <Text
                        className="text-black font-medium leading-tight"
                        style={{
                          fontSize: sf(28),
                          lineHeight: sf(40),
                          includeFontPadding: false,
                          textAlignVertical: 'center'
                        }}
                        numberOfLines={2}
                      >
                        <Text className="text-[#a15300]">{offer.merchant}｜</Text>
                        {offer.title}
                      </Text>
                      <Text
                        className="text-[#5d606a] mt-2"
                        style={{
                          fontSize: sf(24),
                          lineHeight: sf(34),
                          includeFontPadding: false,
                          textAlignVertical: 'center'
                        }}
                      >
                        {offer.distance} ｜ {offer.badge}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between" style={{ marginTop: sh(12) }}>
                      <Text className="text-[#ff5740] font-bold" style={{ fontSize: sf(32), lineHeight: sf(44), includeFontPadding: false, textAlignVertical: 'center' }}>
                        <Text style={{ fontSize: sf(20) }}>¥</Text>{offer.price}
                      </Text>
                      <View className="bg-gradient-to-r from-[#ff352e] to-[#ff5b42] px-3 py-1 rounded">
                        <Text className="text-white font-medium" style={{ fontSize: sf(24) }}>
                          {offer.tag}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            ) : (
              /* 普通卡片 */
              <View
                className="bg-white mx-4 rounded-2xl"
                style={{ marginBottom: sh(12), paddingVertical: sh(16) }}
              >
                <View className="flex-row items-center px-4">
                  {/* 左侧图片 */}
                  <Image
                    source={offer.image}
                    className="rounded-2xl"
                    style={{ width: sw(180), height: sw(180) }}
                    resizeMode="cover"
                  />

                  {/* 右侧信息 */}
                  <View className="flex-1 ml-3" style={{ minHeight: sw(180) }}>
                    <View className="flex-1">
                      <Text
                        className="text-black font-medium leading-tight"
                        style={{
                          fontSize: sf(28),
                          lineHeight: sf(40),
                          includeFontPadding: false,
                          textAlignVertical: 'center'
                        }}
                        numberOfLines={2}
                      >
                        <Text className="text-[#a15300]">{offer.merchant}｜</Text>
                        {offer.title}
                      </Text>
                      <Text
                        className="text-[#5d606a] mt-2"
                        style={{
                          fontSize: sf(24),
                          lineHeight: sf(34),
                          includeFontPadding: false,
                          textAlignVertical: 'center'
                        }}
                      >
                        {offer.distance} ｜ {offer.badge}
                      </Text>
                      {offer.salesInfo && (
                        <Text
                          className="text-gray-500 mt-1"
                          style={{
                            fontSize: sf(20),
                            lineHeight: sf(28),
                            includeFontPadding: false,
                            textAlignVertical: 'center'
                          }}
                        >
                          {offer.salesInfo}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row items-center justify-between" style={{ marginTop: sh(12) }}>
                      <View className="flex-row items-center" style={{ flexWrap: 'wrap' }}>
                        <Text className="text-[#ff5740] font-bold" style={{ fontSize: sf(32), lineHeight: sf(44), includeFontPadding: false, textAlignVertical: 'center' }}>
                          <Text style={{ fontSize: sf(20) }}>¥</Text>{offer.price}
                        </Text>
                        {offer.originalPrice && (
                          <Text
                            className="text-[#666666] line-through ml-1"
                            style={{
                              fontSize: sf(20),
                              lineHeight: sf(28),
                              includeFontPadding: false,
                              textAlignVertical: 'center'
                            }}
                          >
                            {offer.originalPrice}
                          </Text>
                        )}
                        <View className="ml-1 px-2 py-1 rounded border border-[#ea7a31]">
                          <Text className="text-[#e8592e]" style={{ fontSize: sf(18) }}>
                            省70.5元
                          </Text>
                        </View>
                      </View>
                      <LinearGradient
                        colors={['#ed6f38', '#fa6b39']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="px-6 py-2 rounded-full"
                      >
                        <Text className="text-white font-medium" style={{ fontSize: sf(24) }}>
                          {offer.tag}
                        </Text>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
