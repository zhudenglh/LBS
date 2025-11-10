// Service Tabs with Grid Component - 带Tab切换的便民服务（完全按照Figma还原）

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../constants/theme';
import { getFigmaAssetUrl } from '../../utils/figma';
import ToiletIcon from '../../../assets/svgs/toilet-icon.svg';
import StoreIcon from '../../../assets/svgs/store-icon.svg';
import PharmacyIcon from '../../../assets/svgs/pharmacy-icon.svg';
import LocationIcon from '../../../assets/svgs/location-icon.svg';
import CardBg from '../../../assets/svgs/card-bg.svg';

export interface ServiceItem {
  type: 'toilet' | 'store' | 'pharmacy';
  name: string;
  distance: string;
  icon: string;
  brandIcon?: string;
}

interface ServiceTabsWithGridProps {
  toiletServices: ServiceItem[];
  storeServices: ServiceItem[];
  pharmacyServices: ServiceItem[];
  onServicePress?: (service: ServiceItem) => void;
}

// Tab类型
type TabType = 'toilet' | 'store' | 'pharmacy';

export default function ServiceTabsWithGrid({
  toiletServices,
  storeServices,
  pharmacyServices,
  onServicePress,
}: ServiceTabsWithGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toilet');

  // Tab配置
  const tabs = [
    { type: 'toilet' as TabType, label: '厕所', icon: ToiletIcon },
    { type: 'store' as TabType, label: '便利店', icon: StoreIcon },
    { type: 'pharmacy' as TabType, label: '药店', icon: PharmacyIcon },
  ];

  // 获取当前tab的服务数据
  const getCurrentServices = (): ServiceItem[] => {
    switch (activeTab) {
      case 'toilet':
        return toiletServices;
      case 'store':
        return storeServices;
      case 'pharmacy':
        return pharmacyServices;
      default:
        return [];
    }
  };

  // 获取卡片高度
  const getCardHeight = (service: ServiceItem) => {
    return service.brandIcon ? 91.5 : 64;
  };

  const currentServices = getCurrentServices();
  const cardWidth = 109;

  return (
    <View style={styles.container}>
      {/* Tab标签栏 */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.type;
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.type}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.type)}
              activeOpacity={0.7}
            >
              <IconComponent
                width={14}
                height={14}
              />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 服务网格 */}
      <View style={styles.grid}>
        {currentServices.map((service, index) => {
          const cardHeight = getCardHeight(service);
          return (
            <TouchableOpacity
              key={`${service.type}-${index}`}
              style={[styles.card, { width: cardWidth, height: cardHeight }]}
              onPress={() => onServicePress?.(service)}
              activeOpacity={0.7}
            >
              {/* 卡片背景 */}
              <View style={styles.cardBg}>
                <CardBg
                  width={109}
                  height={cardHeight}
                />
              </View>

              {/* 服务名称 */}
              <Text
                style={[
                  styles.serviceName,
                  service.brandIcon ? styles.serviceNameWithLogo : styles.serviceNameNoLogo
                ]}
                numberOfLines={1}
              >
                {service.name}
              </Text>

              {/* 距离 */}
              <View
                style={[
                  styles.distanceRow,
                  service.brandIcon ? styles.distanceRowWithLogo : styles.distanceRowNoLogo
                ]}
              >
                <LocationIcon
                  width={10.5}
                  height={10.5}
                />
                <Text style={styles.distance}>{service.distance}</Text>
              </View>

              {/* 品牌图标 */}
              {service.brandIcon && (
                <View style={styles.brandIconContainer}>
                  <Image
                    source={{ uri: getFigmaAssetUrl(service.brandIcon) }}
                    style={styles.brandIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 15,
  },

  // Tab栏
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 20,
    marginBottom: 12,
  },

  // 单个Tab
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: 'relative',
  },

  tabActive: {
    // 活动状态样式
  },

  tabText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: colors.text.secondary,
  },

  tabTextActive: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.text.primary,
  },

  // Tab指示器（下划线）
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  // 网格
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    rowGap: 15,
    paddingHorizontal: 14,
  },

  // 卡片
  card: {
    position: 'relative',
  },

  cardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // 品牌图标容器
  brandIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 25,
    height: 25,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  brandIcon: {
    width: '100%',
    height: '100%',
  },

  serviceName: {
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'left',
    width: 89,
  },

  // 有logo的卡片：文字在logo下方
  serviceNameWithLogo: {
    position: 'absolute',
    top: 52,
    left: 10,
  },

  // 无logo的卡片：文字居中
  serviceNameNoLogo: {
    position: 'absolute',
    top: 21,
    left: 10,
  },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
  },

  // 有logo的卡片：距离在文字下方
  distanceRowWithLogo: {
    position: 'absolute',
    top: 69.5,
    left: 10,
  },

  // 无logo的卡片：距离在文字下方
  distanceRowNoLogo: {
    position: 'absolute',
    top: 38,
    left: 10,
  },

  distance: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '400',
    color: colors.busPage.serviceDistance,
  },
});
