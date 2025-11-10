/**
 * MerchantOffers - Figma完整还原 (NativeWind)
 * 参考: /Users/lihua/claude/figma/Bus5
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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
    <View className="bg-white mt-[4px] pb-[8px]">
      {/* 标题栏 */}
      <View className="flex-row items-center justify-between px-[14px] pt-[8px] pb-[6px]">
        <Text className="text-[#000000] text-[16px] font-bold leading-[16px]">{title}</Text>
        <View className="flex-row items-center">
          <Text className="text-[rgba(0,0,0,0.4)] text-[12px] leading-[12px] mr-[2px]">更多优惠</Text>
          <ArrowRightIcon />
        </View>
      </View>

      {/* 优惠卡片列表 */}
      <View className="px-[14px]">
        {offers.map((offer) => (
          <TouchableOpacity
            key={offer.id}
            onPress={() => onOfferPress?.(offer)}
            activeOpacity={0.8}
            className="mb-[6px]"
          >
            <View className="bg-white rounded-[8px] overflow-hidden border border-[#f3f4f6]">
              <View className="flex-row p-[6px]">
                {/* 左侧图片 */}
                <Image
                  source={offer.image}
                  className="w-[90px] h-[90px] rounded-[8px]"
                  resizeMode="cover"
                />

                {/* 右侧信息 */}
                <View className="flex-1 ml-[6px] justify-between">
                  {/* 商户和标题 */}
                  <View>
                    <Text className="text-[14px] font-medium leading-[19px]" numberOfLines={2}>
                      <Text className="text-[#a15300]">{offer.merchant}｜</Text>
                      <Text className="text-[#000000]">{offer.title}</Text>
                    </Text>
                    <Text className="text-[#5d606a] text-[12px] leading-[12px] mt-[2px]">
                      {offer.distance} ｜ {offer.badge}
                    </Text>
                  </View>

                  {/* 价格和按钮 */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-end">
                      <Text className="text-[#ff5740] font-bold text-[17px] leading-[17px]">
                        <Text className="text-[10px]">¥</Text>{offer.price}
                      </Text>
                      {offer.originalPrice && (
                        <Text className="text-[#666666] text-[12px] leading-[14px] line-through ml-[2px]">
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
                      className="px-[10px] py-[4px] rounded-[20px]"
                    >
                      <Text className="text-white text-[12px] font-medium leading-[12px]">
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
