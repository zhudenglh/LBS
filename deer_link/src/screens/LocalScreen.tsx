// LocalScreen - 本地tab页面（精确Figma设计复刻）
// Node ID: 1:530 - 公交-在车上
// 尺寸：750×1624px (设计稿)
// 使用 NativeWind 样式

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../components/ui/SearchBar';
import WiFiConnectionCard from '../components/wifi/WiFiConnectionCard';
import QuickActionGrid from '../components/wifi/QuickActionGrid';
import BusRouteCard from '../components/wifi/BusRouteCard';
import { BusIcon, CashbackIcon, HealthIcon, WalletIcon } from '../components/wifi/QuickActionIcons';
import { colors } from '../constants/theme';

// 商户优惠数据类型
interface MerchantOffer {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  sales: string;
  distance: string;
  badge: string;
  badgeColor: string;
}

export default function LocalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [isConnected, setIsConnected] = useState(false);

  // 常量
  const FREE_WIFI_COUNT = 33;

  // 快捷操作数据（精确Figma图标尺寸68×68px/2 = 34×34px）
  const quickActions = [
    {
      id: '1',
      icon: <BusIcon size={34} />,
      labelKey: 'wifi.actions.bus_routes',
      onPress: () => navigation.navigate('Bus'),
      backgroundColor: '#E8F5E9',
    },
    {
      id: '2',
      icon: <CashbackIcon size={34} />,
      labelKey: 'wifi.actions.cashback',
      onPress: () => console.log('返利团'),
      backgroundColor: '#FFF9E6',
    },
    {
      id: '3',
      icon: <HealthIcon size={34} />,
      labelKey: 'wifi.actions.health',
      onPress: () => console.log('小鹿健康'),
      backgroundColor: '#E3F2FD',
    },
    {
      id: '4',
      icon: <WalletIcon size={34} />,
      labelKey: 'wifi.actions.savings',
      onPress: () => console.log('省钱包'),
      backgroundColor: '#FFEBE9',
    },
  ];

  // 商户优惠数据（精确Figma数据）
  const merchantOffers: MerchantOffer[] = [
    {
      id: '1',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '2',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '3',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '4',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '5',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
    {
      id: '6',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop&q=80',
      price: '10.9',
      originalPrice: '16',
      sales: '半年售2.5万+',
      distance: '1.6km',
      badge: '团购',
      badgeColor: colors.badge.orange,
    },
  ];

  // 分成左右两列
  const leftColumnOffers = merchantOffers.filter((_, index) => index % 2 === 0);
  const rightColumnOffers = merchantOffers.filter((_, index) => index % 2 === 1);

  // 处理函数
  const handleSearch = () => {
    console.log('搜索');
  };

  const handleScan = () => {
    console.log('扫码');
  };

  const handleWiFiConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleBusReminder = () => {
    console.log('到站提醒');
  };

  return (
    <View className="flex-1 bg-background">
      {/* 黄色渐变背景 - 精确Figma: 331px高，从#f9de47到#f6f8f7，75%位置 */}
      <LinearGradient
        colors={[colors.localYellow, colors.localGradientEnd]}
        locations={[0, 0.75]}
        className="absolute top-0 left-0 right-0 h-[331px] z-0"
      />

      <ScrollView
        className="flex-1 z-10"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 搜索栏 - 精确Figma尺寸 */}
        <View className="px-[15px] pt-3">
          <SearchBar
            onSearchPress={handleSearch}
            onScanPress={handleScan}
            placeholder="南京市的人气酒店"
            location="南京"
          />
        </View>

        {/* WiFi连接+快捷操作卡片 - 精确Figma: 白色圆角卡片 */}
        <View className="bg-white rounded-[10px] px-3 pt-3 pb-3 mx-[15px] mt-[15px]">
          <WiFiConnectionCard
            isConnected={isConnected}
            networkName="Nanjing_Bus_Free_WiFi"
            nearbyCount={FREE_WIFI_COUNT}
            onConnect={handleWiFiConnect}
            buttonColor={[colors.localYellow, colors.localYellow]}
          />

          {/* 分割线 - 精确Figma: 1px高, #e0e1e6颜色, 左右各留14px */}
          <View className="h-[1px] bg-[#e0e1e6] mx-[14px] my-3" />

          {/* 快捷操作网格 - 在同一个卡片内 */}
          <QuickActionGrid actions={quickActions} />
        </View>

        {/* 公交路线卡片 - 精确Figma间距15px */}
        <View className="px-[15px] mt-[15px]">
          <BusRouteCard
            routeName={t('home.bus.line') || '71路'}
            direction="开往·张江高科方向"
            nextStation="华拓路站"
            estimatedTime="3"
            onReminderPress={handleBusReminder}
            buttonColor={colors.localYellow}
          />
        </View>

        {/* 商户优惠瀑布流 - 精确Figma: 12px列间距 */}
        <View className="flex-row px-[15px] mt-[15px] gap-3">
          {/* 左列 */}
          <View className="flex-1 gap-3">
            {leftColumnOffers.map((offer) => (
              <MerchantCard key={offer.id} offer={offer} />
            ))}
          </View>

          {/* 右列 */}
          <View className="flex-1 gap-3">
            {rightColumnOffers.map((offer) => (
              <MerchantCard key={offer.id} offer={offer} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// 商户卡片组件（精确Figma设计 - 使用 NativeWind）
function MerchantCard({ offer }: { offer: MerchantOffer }) {
  return (
    <View className="w-full mb-1.5 bg-white rounded-[10px] overflow-hidden">
      {/* 图片区域 - 精确Figma: 354×464px/2 = 177×232px */}
      <View className="w-full h-[232px] relative">
        <Image
          source={{ uri: offer.imageUrl }}
          className="w-full h-full rounded-t-[10px]"
          resizeMode="cover"
        />

        {/* 标签：团购+距离 */}
        <View className="absolute bottom-0 left-0 flex-row">
          <View
            className="h-[19px] px-1.5 py-0.5 justify-center items-center"
            style={{ backgroundColor: offer.badgeColor }}
          >
            <Text className="text-[11px] leading-[14px] text-white font-normal tracking-tight">
              {offer.badge}
            </Text>
          </View>
          <View className="h-[19px] px-1.5 py-0.5 justify-center items-center bg-[rgba(0,0,0,0.4)] rounded-tr-[5px]">
            <Text className="text-[11px] leading-[14px] text-white font-normal tracking-tight">
              {offer.distance}
            </Text>
          </View>
        </View>
      </View>

      {/* 文字区域 - 精确Figma: padding 7px */}
      <View className="p-[7px]">
        {/* 标题 - 精确Figma: 13px Regular, #333333, lineHeight 19px */}
        <Text
          className="text-[13px] leading-[19px] text-[#333333] font-normal tracking-tight mb-[3px]"
          numberOfLines={2}
        >
          {offer.name}
        </Text>

        {/* 销量 - 精确Figma: 11px Regular, #878c99, lineHeight 14px */}
        <Text className="text-[11px] leading-[14px] text-[#878c99] font-normal tracking-tight mb-1">
          {offer.sales}
        </Text>

        {/* 价格区域 - 精确Figma间距 */}
        <View className="flex-row items-end justify-between">
          <View className="flex-row items-end gap-0.5">
            {/* ¥符号 - 11px */}
            <Text className="text-[11px] leading-[15px] text-[#ee6757] font-normal tracking-tight">
              ¥
            </Text>
            {/* 价格数字 - 16px Medium */}
            <Text className="text-[16px] leading-[19px] text-[#ee6757] font-medium">
              {offer.price}
            </Text>
            {/* 划线价 - 11px, 删除线 */}
            <Text className="text-[11px] leading-[15px] text-[#878c99] font-normal tracking-tight line-through">
              ¥{offer.originalPrice}
            </Text>
          </View>
          {/* 折扣标签 - 11px Regular, #ff3b30 */}
          <Text className="text-[11px] leading-[14px] text-[#ff3b30] font-normal tracking-tight">
            低至2.1折
          </Text>
        </View>
      </View>
    </View>
  );
}
