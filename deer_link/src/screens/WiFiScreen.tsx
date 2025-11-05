// WiFi Screen - 精确按Figma还原（黄色主题）

import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import WiFiHeader from '../components/wifi/WiFiHeader';
import WiFiConnectionCard from '../components/wifi/WiFiConnectionCard';
import QuickActionGrid from '../components/wifi/QuickActionGrid';
import BusRouteCard from '../components/wifi/BusRouteCard';
import MerchantOfferCard from '../components/wifi/MerchantOfferCard';
import { BusIcon, CashbackIcon, HealthIcon, WalletIcon } from '../components/wifi/QuickActionIcons';
import { scale } from '../utils/scale';

interface MerchantOffer {
  id: string;
  name: string;
  salesInfo?: string;
  distance: string;
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  imageUrl?: string;
  imageHeight?: number;
}

export default function WiFiScreen() {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);

  // Quick actions - 4列（使用Figma设计的彩色图标）
  const quickActions = [
    { id: '1', icon: <BusIcon />, labelKey: 'wifi.actions.bus', onPress: () => handleAction('bus') },
    { id: '2', icon: <CashbackIcon />, labelKey: 'wifi.actions.cashback', onPress: () => handleAction('cashback') },
    { id: '3', icon: <HealthIcon />, labelKey: 'wifi.actions.health', onPress: () => handleAction('health') },
    { id: '4', icon: <WalletIcon />, labelKey: 'wifi.actions.savings', onPress: () => handleAction('savings') },
  ];

  // 商家优惠 - 按Figma顺序，不同高度
  const merchantOffers: MerchantOffer[] = [
    // 左列
    {
      id: '1',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 346,
    },
    {
      id: '3',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 464,
    },
    {
      id: '5',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 464,
    },
    // 右列
    {
      id: '2',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 464,
    },
    {
      id: '4',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 464,
    },
    {
      id: '6',
      name: '爸爸吐司面包｜限时【上新】抹茶脑袋必冲好...',
      salesInfo: '半年售2.5万+',
      distance: '1.6km',
      currentPrice: '10.9',
      originalPrice: '16',
      discount: '低至2.1折',
      imageHeight: 464,
    },
  ];

  const handleConnect = () => {
    if (isConnected) {
      Alert.alert(t('wifi.disconnect'), t('wifi.confirm_disconnect'), [
        { text: t('common.button.cancel'), style: 'cancel' },
        {
          text: t('common.button.confirm'),
          onPress: () => {
            setIsConnected(false);
            Alert.alert(t('wifi.disconnected'));
          },
        },
      ]);
    } else {
      setIsConnected(true);
      Alert.alert(t('wifi.connect_success'));
    }
  };

  const handleAction = (action: string) => {
    Alert.alert(t('common.coming_soon'), `${action} ${t('common.feature_coming_soon')}`);
  };

  const handleOfferPress = (offer: MerchantOffer) => {
    Alert.alert(offer.name, `¥${offer.currentPrice}`);
  };

  const handleReminderPress = () => {
    Alert.alert(t('wifi.bus.arrival_reminder'), t('wifi.bus.reminder_set'));
  };

  const handleSearchPress = () => {
    Alert.alert(t('common.coming_soon'), t('common.feature_coming_soon'));
  };

  const handleLocationPress = () => {
    Alert.alert(t('common.coming_soon'), t('common.feature_coming_soon'));
  };

  const handleScanPress = () => {
    Alert.alert(t('common.coming_soon'), t('common.feature_coming_soon'));
  };

  // 分成两列
  const leftColumnOffers = merchantOffers.filter((_, index) => index % 2 === 0);
  const rightColumnOffers = merchantOffers.filter((_, index) => index % 2 === 1);

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f8f7' }}>
      {/* 顶部黄色Header */}
      <WiFiHeader
        onSearchPress={handleSearchPress}
        onLocationPress={handleLocationPress}
        onScanPress={handleScanPress}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* 主内容容器 - 使用padding替代固定宽度 */}
        <View
          style={{
            paddingHorizontal: scale(15),
            gap: scale(15),
            paddingTop: scale(15),
          }}
        >
          {/* WiFi连接卡片 */}
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: scale(20),
            }}
          >
            <WiFiConnectionCard
              isConnected={isConnected}
              nearbyCount={33}
              onConnect={handleConnect}
            />

            {/* 分隔线 */}
            <View
              style={{
                height: 1,
                backgroundColor: 'rgba(224, 225, 230, 1)',
                marginHorizontal: scale(24),
                marginVertical: scale(24),
              }}
            />

            {/* 快捷操作按钮 */}
            <QuickActionGrid actions={quickActions} />
          </View>

          {/* 公交欢迎卡片 */}
          <BusRouteCard
            routeName="71路"
            direction="开往·张江高科方向"
            nextStation="华拓路站"
            estimatedTime="3"
            onReminderPress={handleReminderPress}
          />

          {/* 商家优惠瀑布流 - 两列 */}
          <View
            style={{
              flexDirection: 'row',
              gap: scale(12),
            }}
          >
            {/* 左列 */}
            <View style={{ flex: 1, gap: scale(12) }}>
              {leftColumnOffers.map((offer) => (
                <MerchantOfferCard
                  key={offer.id}
                  offer={offer}
                  onPress={() => handleOfferPress(offer)}
                />
              ))}
            </View>

            {/* 右列 */}
            <View style={{ flex: 1, gap: scale(12) }}>
              {rightColumnOffers.map((offer) => (
                <MerchantOfferCard
                  key={offer.id}
                  offer={offer}
                  onPress={() => handleOfferPress(offer)}
                />
              ))}
            </View>
          </View>

          {/* 底部间距 */}
          <View style={{ height: scale(40) }} />
        </View>
      </ScrollView>
    </View>
  );
}
