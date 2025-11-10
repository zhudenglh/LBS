/**
 * BusScreen - Figma完整还原版本
 * 使用NativeWind + 响应式布局
 */

import React from 'react';
import { View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import BusHeaderFigma from './BusHeaderFigma';
import RouteInfoFigma from './RouteInfoFigma';
import TransferBadgesFigma from './TransferBadgesFigma';
import StationMapFigma from './StationMapFigma';
import MerchantOffersFigma from './MerchantOffersFigma';
import ServiceAreaFigma from './ServiceAreaFigma';

export default function BusScreenFigma() {
  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fa]">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* 顶部：公交车背景 + 路线号 + WiFi按钮 */}
        <BusHeaderFigma />

        {/* 路线信息：开往方向 + 下一站 + 下车提醒 */}
        <RouteInfoFigma />

        {/* 可换乘线路 */}
        <TransferBadgesFigma />

        {/* 站点地图（进度条 + 小车图标） */}
        <StationMapFigma />

        {/* 附近优惠 */}
        <MerchantOffersFigma />

        {/* 便民服务（厕所、便利店、药店） */}
        <ServiceAreaFigma />

        {/* 底部留白 */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
