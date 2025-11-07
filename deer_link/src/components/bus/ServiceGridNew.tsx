// Service Grid Component - 便民服务网格（完全按照Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ServiceItem {
  type: 'toilet' | 'store' | 'pharmacy';
  name: string;
  distance: string;
  icon: string;                                 // 使用Figma图片URL
}

interface ServiceGridProps {
  title: string;
  services: ServiceItem[];
  onServicePress?: (service: ServiceItem) => void;
}

// Figma图片资源
const FIGMA_IMAGES = {
  toiletIcon: 'http://localhost:3845/assets/7077eaa97425335352e3ab56f42205c41778037a.svg',
  storeIcon: 'http://localhost:3845/assets/8d8aa485478eeff5b3aad3210e6f40643709dea7.svg',
  pharmacyIcon: 'http://localhost:3845/assets/4667c4f81e1863df773ace76d13e126ae02bacbe.svg',
  locationIcon: 'http://localhost:3845/assets/d6dfb9ac9d46e65c66bf93008c9f32a7cddffd81.svg',
  cardBg: 'http://localhost:3845/assets/c91d8e109b6f6e592e8c90360c4d60b46dc0c0e4.svg',
  moreArrow: 'http://localhost:3845/assets/394c3b6c38e62d4a113ac138fe357650f8786c6d.svg',
};

export default function ServiceGridNew({ title, services, onServicePress }: ServiceGridProps) {
  // 计算每个卡片宽度（3列，精确按Figma）
  const cardWidth = 109;                        // Figma: 218px ÷ 2

  // 获取服务类型对应的图标
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'toilet':
        return FIGMA_IMAGES.toiletIcon;
      case 'store':
        return FIGMA_IMAGES.storeIcon;
      case 'pharmacy':
        return FIGMA_IMAGES.pharmacyIcon;
      default:
        return FIGMA_IMAGES.toiletIcon;
    }
  };

  // 获取标题图标（使用第一个服务的类型）
  const titleIconUri = services.length > 0 ? getServiceIcon(services[0].type) : FIGMA_IMAGES.toiletIcon;

  return (
    <View style={styles.container}>
      {/* 标题行 */}
      <View style={styles.headerRow}>
        {/* 图标 + 标题 */}
        <View style={styles.titleRow}>
          <RemoteSvg
            uri={titleIconUri}
            width={18}
            height={18}
          />
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* 全部服务按钮 */}
        <View style={styles.moreButton}>
          <Text style={styles.moreText}>全部服务</Text>
          <RemoteSvg
            uri={FIGMA_IMAGES.moreArrow}
            width={7}
            height={11}
          />
        </View>
      </View>

      {/* 服务网格 */}
      <View style={styles.grid}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={`${service.type}-${index}`}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onServicePress?.(service)}
            activeOpacity={0.7}
          >
            {/* 卡片背景 */}
            <View style={styles.cardBg}>
              <RemoteSvg
                uri={FIGMA_IMAGES.cardBg}
                width={109}
                height={64}
              />
            </View>

            {/* 服务名称 */}
            <Text style={styles.serviceName} numberOfLines={1}>
              {service.name}
            </Text>

            {/* 距离 */}
            <View style={styles.distanceRow}>
              <RemoteSvg
                uri={FIGMA_IMAGES.locationIcon}
                width={10.5}
                height={10.5}
              />
              <Text style={styles.distance}>{service.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingTop: 16,                             // Figma: 32px ÷ 2
    paddingBottom: 15,                          // Figma: 30px ÷ 2
    backgroundColor: colors.white,
  },

  // 标题行
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,                           // Figma: 60px ÷ 2
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,                                     // Figma: 10px ÷ 2
  },

  titleIcon: {
    width: 18,                                  // Figma: 36px ÷ 2
    height: 18,
  },

  title: {
    fontSize: 15,                               // Figma: 30px ÷ 2
    lineHeight: 19,                             // 15 × 1.27 (防止截断)
    fontWeight: '500',
    color: colors.text.primary,                 // #333333
  },

  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },

  moreText: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
  },

  moreArrow: {
    width: 7,                                   // Figma: 14px ÷ 2
    height: 11,                                 // Figma: 22px ÷ 2
  },

  // 网格
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 119,                                   // Figma: 238px ÷ 2 (水平间距)
    rowGap: 30,                                 // Figma: 60px ÷ 2 (垂直间距)
  },

  // 卡片
  card: {
    height: 64,                                 // Figma: 128px ÷ 2
    position: 'relative',
    justifyContent: 'center',
  },

  cardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  serviceName: {
    fontSize: 13,                               // Figma: 26px ÷ 2
    lineHeight: 17,                             // 13 × 1.31 (防止截断)
    fontWeight: '500',
    color: colors.text.primary,                 // #333333
    textAlign: 'left',
    marginLeft: 10,                             // Figma: 20px ÷ 2
    marginBottom: 2,
  },

  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,                                   // Figma: 5px ÷ 2
    marginLeft: 10,                             // Figma: 20px ÷ 2
  },

  locationIcon: {
    width: 10.5,                                // Figma: 21px ÷ 2
    height: 10.5,
  },

  distance: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '400',
    color: colors.busPage.serviceDistance,      // #6a6e81
  },
});
