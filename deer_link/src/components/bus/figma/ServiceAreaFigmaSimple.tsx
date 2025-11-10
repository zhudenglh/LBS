/**
 * ServiceArea - 简化版本
 * 修复Tab切换和布局问题
 */

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.moreButton}>
          <Text style={styles.moreText}>全部服务</Text>
          <ArrowRightIcon />
        </View>
      </View>

      {/* Tab标签栏 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('toilet')}
          activeOpacity={0.8}
          style={styles.tabItem}
        >
          <Text style={styles.tabIcon}>🚻</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'toilet' && styles.tabTextActive
            ]}
          >
            厕所
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('store')}
          activeOpacity={0.8}
          style={styles.tabItem}
        >
          <Text style={styles.tabIcon}>🏪</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'store' && styles.tabTextActive
            ]}
          >
            便利店
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('pharmacy')}
          activeOpacity={0.8}
          style={styles.tabItem}
        >
          <Text style={styles.tabIcon}>💊</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'pharmacy' && styles.tabTextActive
            ]}
          >
            药店
          </Text>
        </TouchableOpacity>
      </View>

      {/* 服务卡片列表 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentData.map((item, index) => (
          <View
            key={index}
            style={styles.serviceCard}
          >
            {item.logo && (
              <Image
                source={item.logo}
                style={styles.serviceLogo}
                resizeMode="contain"
              />
            )}
            <Text style={styles.serviceName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.distanceRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    marginRight: 4,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 20,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#999999',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 12,
    width: 140,
  },
  serviceLogo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceName: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  distanceText: {
    color: '#6a6e81',
    fontSize: 12,
  },
});
