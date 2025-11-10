/**
 * BusPageFigmaScreen
 * Figma完整还原版本的公交页面
 *
 * 特点：
 * - 像素级还原Figma设计
 * - 使用纯StyleSheet（移除NativeWind）
 * - 所有SVG内联，无需外部图标库依赖
 */

import React from 'react';
import { View, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { MainTabParamList } from '../types';

// Figma组件导入
import BusHeaderFigma from '../components/bus/figma/BusHeaderFigma';
import RouteInfoFigma from '../components/bus/figma/RouteInfoFigma';
import TransferBadgesFigma from '../components/bus/figma/TransferBadgesFigma';
import StationMapFigma from '../components/bus/figma/StationMapFigma';
import MerchantOffersFigmaSimple from '../components/bus/figma/MerchantOffersFigmaSimple';
import ServiceAreaFigmaSimple from '../components/bus/figma/ServiceAreaFigmaSimple';

export default function BusPageFigmaScreen() {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* 返回按钮（浮动在内容上方） */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>◀</Text>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 1. 公交车背景 + 路线号 + WiFi按钮 */}
        <BusHeaderFigma />

        {/* 2. 路线信息：开往方向 + 下一站 + 下车提醒 */}
        <RouteInfoFigma
          direction="开往·张江高科方向"
          nextStation="东浦路"
          estimatedMinutes={3}
        />

        {/* 3. 可换乘线路 */}
        <TransferBadgesFigma />

        {/* 4. 站点地图（进度条 + 小车图标） */}
        <StationMapFigma />

        {/* 5. 附近优惠 */}
        <MerchantOffersFigmaSimple />

        {/* 6. 便民服务（厕所、便利店、药店） */}
        <ServiceAreaFigmaSimple />

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    zIndex: 50,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacer: {
    height: 32,
  },
});
