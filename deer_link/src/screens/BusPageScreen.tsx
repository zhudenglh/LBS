// Bus Page Screen - 新公交页面（完全按Figma设计）

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../types';
import { colors, spacing } from '../constants/theme';

// 导入新的Bus页面组件
import BusHeader from '../components/bus/BusHeader';
import TransferBadges, { TransferLine } from '../components/bus/TransferBadges';
import RouteInfo from '../components/bus/RouteInfo';
import StationMap, { Station } from '../components/bus/StationMap';
import ServiceGrid, { ServiceItem } from '../components/bus/ServiceGrid';
import MerchantOfferGrid, { MerchantOffer } from '../components/bus/MerchantOfferGrid';

export default function BusPageScreen() {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  // 状态管理
  const [isWiFiConnected, setIsWiFiConnected] = useState(false);
  const [reminderActive, setReminderActive] = useState(false);

  // 返回主页
  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  // WiFi连接
  const handleWiFiPress = () => {
    setIsWiFiConnected(!isWiFiConnected);
    Alert.alert(
      isWiFiConnected ? 'WiFi已断开' : 'WiFi已连接',
      isWiFiConnected ? '已断开南京公交WiFi' : '已成功连接到南京公交WiFi',
    );
  };

  // 下车提醒
  const handleReminderPress = () => {
    setReminderActive(!reminderActive);
    Alert.alert(
      reminderActive ? '已取消提醒' : '已设置提醒',
      reminderActive
        ? '已取消东浦路站的下车提醒'
        : '将在到达东浦路站前3分钟提醒您下车',
    );
  };

  // 服务点击
  const handleServicePress = (service: ServiceItem) => {
    Alert.alert(
      service.name,
      `距离: ${service.distance}\n类型: ${service.type}\n\n点击查看详情或导航`,
      [
        { text: '取消', style: 'cancel' },
        { text: '导航', onPress: () => console.log('Navigate to', service.name) },
      ],
    );
  };

  // 商户优惠点击
  const handleOfferPress = (offer: MerchantOffer) => {
    Alert.alert(
      offer.name,
      `价格: ${offer.price}\n距离: ${offer.distance}\n\n点击查看优惠详情`,
      [
        { text: '取消', style: 'cancel' },
        { text: '查看详情', onPress: () => console.log('View offer', offer.id) },
      ],
    );
  };

  // ============ 模拟数据 ============

  // 换乘线路（使用Figma精确颜色）
  const transferLines: TransferLine[] = [
    { type: 'metro', number: '4号线', backgroundColor: colors.busPage.metro4, textColor: colors.white },
    { type: 'metro', number: 'S3号线', backgroundColor: colors.busPage.metroS3, textColor: colors.white },
    { type: 'bus', number: '33路', backgroundColor: colors.busPage.bus33Bg, textColor: colors.busPage.bus33Text },
  ];

  // 站点列表
  const stations: Station[] = [
    { name: '张江高科', passed: true },
    { name: '金科路', passed: true },
    { name: '张东路', passed: false },  // currentIndex = 2
    { name: '东浦路', passed: false },
    { name: '施湾', passed: false },
    { name: '川杨河', passed: false },
  ];

  // 便民服务
  const services: ServiceItem[] = [
    { type: 'toilet', name: '公共厕所', distance: '50m', icon: '🚻' },
    { type: 'store', name: '全家便利店', distance: '80m', icon: '🏪' },
    { type: 'pharmacy', name: '益丰大药房', distance: '120m', icon: '💊' },
    { type: 'toilet', name: '地铁站厕所', distance: '100m', icon: '🚻' },
    { type: 'store', name: '罗森便利店', distance: '150m', icon: '🏪' },
    { type: 'pharmacy', name: '国药大药房', distance: '200m', icon: '💊' },
  ];

  // 附近优惠
  const merchantOffers: MerchantOffer[] = [
    {
      id: '1',
      name: '星巴克咖啡',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
      price: '¥25',
      originalPrice: '¥38',
      distance: '120m',
      badge: '团购',
    },
    {
      id: '2',
      name: '肯德基',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
      price: '¥35',
      originalPrice: '¥48',
      distance: '150m',
      badge: '满减',
    },
    {
      id: '3',
      name: '爸爸吐司面包',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      price: '¥12',
      originalPrice: '¥18',
      distance: '200m',
    },
    {
      id: '4',
      name: '必胜客',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      price: '¥58',
      originalPrice: '¥88',
      distance: '250m',
      badge: '新店',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 返回按钮 */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backArrow}>◀</Text>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部：公交路线号 + WiFi按钮 */}
        <BusHeader
          busNumber="25路"
          onWiFiPress={handleWiFiPress}
          isWiFiConnected={isWiFiConnected}
        />

        {/* 可换乘线路 */}
        <TransferBadges lines={transferLines} />

        {/* 路线信息 */}
        <RouteInfo
          direction="开往·张江高科方向"
          nextStation="东浦路"
          estimatedTime={3}
          onReminderPress={handleReminderPress}
          reminderActive={reminderActive}
        />

        {/* 站点地图 */}
        <StationMap stations={stations} currentIndex={2} />

        {/* 便民服务 */}
        <ServiceGrid
          title="便民服务·东浦路"
          services={services}
          onServicePress={handleServicePress}
        />

        {/* 附近优惠 */}
        <MerchantOfferGrid
          title="附近优惠·东浦路"
          offers={merchantOffers}
          onOfferPress={handleOfferPress}
        />

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.busPage.sectionBg,
  },

  backButtonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 20,
    color: colors.primary,
    marginRight: spacing.xs,
  },

  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },

  scrollView: {
    flex: 1,
  },

  bottomSpacer: {
    height: spacing.xxl,
  },
});
