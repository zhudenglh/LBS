/**
 * ServiceArea - Figma完整还原 (NativeWind)
 * 参考: /Users/lihua/claude/figma/Bus5
 */

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BUS_IMAGES } from '../../../constants/busAssets';

interface ServiceItem {
  name: string;
  distance: string;
  logo?: any;
}

interface ServiceAreaProps {
  title?: string;
  toilets?: ServiceItem[];
  stores?: ServiceItem[];
  pharmacies?: ServiceItem[];
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

const defaultToilets: ServiceItem[] = [
  { name: '公共厕所', distance: '36m' },
  { name: '长泰广场厕所', distance: '256m' },
  { name: '洗手间(曙光...', distance: '382m' },
];

const defaultStores: ServiceItem[] = [
  { name: '7-11便利店', distance: '120m', logo: BUS_IMAGES.logo711 },
  { name: '全家便利店', distance: '440m', logo: BUS_IMAGES.logoFamilyMart },
  { name: '罗森便利店', distance: '656m', logo: BUS_IMAGES.logoLawson },
];

const defaultPharmacies: ServiceItem[] = [
  { name: '同仁堂药店', distance: '46m', logo: BUS_IMAGES.logoTongrentang },
  { name: '海王星辰药店', distance: '130m', logo: BUS_IMAGES.logoNeptune },
  { name: '老百姓大药房', distance: '356m', logo: BUS_IMAGES.logoLaobaixing },
];

type TabType = 'toilet' | 'store' | 'pharmacy';

export default function ServiceAreaFigmaSimple({
  title = '便民服务·东浦路',
  toilets = defaultToilets,
  stores = defaultStores,
  pharmacies = defaultPharmacies,
}: ServiceAreaProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toilet');

  const currentData =
    activeTab === 'toilet' ? toilets : activeTab === 'store' ? stores : pharmacies;

  return (
    <View className="bg-white mt-[4px] pb-[12px]">
      {/* 标题栏 */}
      <View className="flex-row items-center justify-between px-[14px] pt-[8px] pb-[6px]">
        <Text className="text-[#000000] text-[16px] font-bold leading-[16px]">{title}</Text>
        <View className="flex-row items-center">
          <Text className="text-[rgba(0,0,0,0.4)] text-[12px] leading-[12px] mr-[2px]">全部服务</Text>
          <ArrowRightIcon />
        </View>
      </View>

      {/* Tab标签栏 */}
      <View className="flex-row px-[14px] mb-[8px] gap-[10px]">
        <TouchableOpacity
          onPress={() => setActiveTab('toilet')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <Text className="text-[18px] mr-[2px]">🚻</Text>
          <Text className={activeTab === 'toilet' ? 'text-[14px] text-[#000000] font-medium leading-[14px]' : 'text-[14px] text-[#999999] leading-[14px]'}>
            厕所
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('store')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <Text className="text-[18px] mr-[2px]">🏪</Text>
          <Text className={activeTab === 'store' ? 'text-[14px] text-[#000000] font-medium leading-[14px]' : 'text-[14px] text-[#999999] leading-[14px]'}>
            便利店
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('pharmacy')}
          activeOpacity={0.8}
          className="flex-row items-center"
        >
          <Text className="text-[18px] mr-[2px]">💊</Text>
          <Text className={activeTab === 'pharmacy' ? 'text-[14px] text-[#000000] font-medium leading-[14px]' : 'text-[14px] text-[#999999] leading-[14px]'}>
            药店
          </Text>
        </TouchableOpacity>
      </View>

      {/* 服务卡片列表 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-[14px] gap-[6px]"
      >
        {currentData.map((item, index) => (
          <View
            key={index}
            className="bg-[#f8faff] rounded-[8px] p-[6px] w-[109px]"
          >
            {item.logo && (
              <Image
                source={item.logo}
                className="w-[25px] h-[25px] rounded-[4px] mb-[4px]"
                resizeMode="contain"
              />
            )}
            <Text className="text-[#000000] text-[13px] font-medium leading-[13px] mb-[2px]" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-[14px] mr-[2px]">📍</Text>
              <Text className="text-[#6a6e81] text-[12px] leading-[12px]">{item.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
