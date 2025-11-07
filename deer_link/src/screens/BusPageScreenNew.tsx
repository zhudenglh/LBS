// Bus Page Screen - 新公交页面（完全按照Figma还原，使用所有Figma资源）

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../types';
import { colors, spacing } from '../constants/theme';

// 导入新的Bus页面组件（使用Figma资源）
import BusHeaderNew from '../components/bus/BusHeaderNew';
import TransferBadgesNew, { TransferLine } from '../components/bus/TransferBadgesNew';
import RouteInfoNew from '../components/bus/RouteInfoNew';
import StationMapNew, { Station } from '../components/bus/StationMapNew';
import ServiceGridNew, { ServiceItem } from '../components/bus/ServiceGridNew';
import MerchantOfferGridNew, { MerchantOffer } from '../components/bus/MerchantOfferGridNew';

// Figma图片资源
const FIGMA_IMAGES = {
  offerImage1: 'http://localhost:3845/assets/efa45b8125454a6ce5f93d2d281e00d9e6e285e6.png',
  offerImage2: 'http://localhost:3845/assets/c2cc84a614c67e533bbee5d32d51b26ede5d6623.png',
};

export default function BusPageScreenNew() {
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

  // ============ 模拟数据（使用Figma精确颜色和图片） ============

  // 换乘线路（使用Figma精确颜色）
  const transferLines: TransferLine[] = [
    { type: 'metro', number: '4号线', backgroundColor: '#8565c4', textColor: '#FFFFFF' },
    { type: 'metro', number: 'S3号线', backgroundColor: '#c779bc', textColor: '#FFFFFF' },
    { type: 'bus', number: '33路', backgroundColor: '#dbefff', textColor: '#0285f0' },
  ];

  // 站点列表（精确按Figma）
  const stations: Station[] = [
    { name: '11 那宁路', passed: true },
    { name: '12 南坪东路鼓楼医院', passed: true },
    { name: '石板路', passed: true },
    { name: '中兴路', passed: false },          // currentIndex = 3 (小车在这里)
    { name: '东浦路', passed: false },          // 下一站（大绿点）
    { name: '招呼站', passed: false },
    { name: '18 蔡伦路', passed: false },
    { name: '19 中科路', passed: false },
  ];

  // 便民服务 - 厕所
  const toiletServices: ServiceItem[] = [
    { type: 'toilet', name: '公共厕所', distance: '36m', icon: '' },
    { type: 'toilet', name: '长泰广场厕所', distance: '256m', icon: '' },
    { type: 'toilet', name: '洗手间(曙光...', distance: '382m', icon: '' },
  ];

  // 便民服务 - 便利店
  const storeServices: ServiceItem[] = [
    { type: 'store', name: '7-11便利店', distance: '120m', icon: '' },
    { type: 'store', name: '全家便利店', distance: '440m', icon: '' },
    { type: 'store', name: '罗森便利店', distance: '656m', icon: '' },
  ];

  // 便民服务 - 药店
  const pharmacyServices: ServiceItem[] = [
    { type: 'pharmacy', name: '同仁堂药店', distance: '46m', icon: '' },
    { type: 'pharmacy', name: '海王星辰药店', distance: '130m', icon: '' },
    { type: 'pharmacy', name: '老百姓大药房', distance: '356m', icon: '' },
  ];

  // 附近优惠（使用Figma图片）
  const merchantOffers: MerchantOffer[] = [
    {
      id: '1',
      name: '肯德基 (全国通用)｜可口可乐（小杯）',
      image: FIGMA_IMAGES.offerImage1,
      price: '0.00',
      originalPrice: '',
      distance: '520m',
      badge: '到店消费可用',
    },
    {
      id: '2',
      name: '旺福·贵州酸汤牛肉火锅｜牛肉火锅双人套餐超值',
      image: FIGMA_IMAGES.offerImage2,
      price: '177.5',
      originalPrice: '¥308',
      distance: '1.2km',
      badge: '随时退｜过期自动退',
    },
    {
      id: '3',
      name: '旺福·贵州酸汤牛肉火锅｜牛肉火锅双人套餐超值',
      image: FIGMA_IMAGES.offerImage2,
      price: '177.5',
      originalPrice: '¥308',
      distance: '1.2km',
      badge: '随时退｜过期自动退',
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
        {/* 顶部：公交路线号 + WiFi按钮 + 背景图 */}
        <BusHeaderNew
          busNumber="25路"
          onWiFiPress={handleWiFiPress}
          isWiFiConnected={isWiFiConnected}
        />

        {/* 可换乘线路 */}
        <TransferBadgesNew lines={transferLines} />

        {/* 路线信息 */}
        <RouteInfoNew
          direction="开往·张江高科方向"
          nextStation="东浦路"
          estimatedTime={3}
          onReminderPress={handleReminderPress}
          reminderActive={reminderActive}
        />

        {/* 站点地图 */}
        <StationMapNew
          stations={stations}
          busAtIndex={3}           // 公交车在中兴路
          nextStationIndex={4}     // 下一站是东浦路
        />

        {/* 便民服务 - 厕所 */}
        <ServiceGridNew
          title="厕所"
          services={toiletServices}
          onServicePress={handleServicePress}
        />

        {/* 便民服务 - 便利店 */}
        <ServiceGridNew
          title="便利店"
          services={storeServices}
          onServicePress={handleServicePress}
        />

        {/* 便民服务 - 药店 */}
        <ServiceGridNew
          title="药店"
          services={pharmacyServices}
          onServicePress={handleServicePress}
        />

        {/* 附近优惠 */}
        <MerchantOfferGridNew
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
    backgroundColor: colors.busPage.sectionBg,      // #f4f6fa
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
    backgroundColor: colors.busPage.sectionBg,      // #f4f6fa
  },

  bottomSpacer: {
    height: spacing.xxl,
  },
});
