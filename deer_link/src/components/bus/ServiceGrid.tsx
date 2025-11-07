// Service Grid Component - 便民服务网格（3列）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ServiceItem {
  type: 'toilet' | 'store' | 'pharmacy';  // 服务类型
  name: string;                            // 服务名称，如"公共厕所"
  distance: string;                        // 距离，如"50m"
  icon: string;                            // 图标 emoji
}

interface ServiceGridProps {
  title: string;                           // 标题，如"便民服务·东浦路"
  services: ServiceItem[];                 // 服务列表
  onServicePress?: (service: ServiceItem) => void;  // 点击事件
}

export default function ServiceGrid({ title, services, onServicePress }: ServiceGridProps) {
  // 计算每个卡片宽度（3列）
  const cardWidth = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * 2) / 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.grid}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={`${service.type}-${index}`}
            style={[styles.card, { width: cardWidth }]}
            onPress={() => onServicePress?.(service)}
            activeOpacity={0.7}
          >
            {/* 图标 */}
            <Text style={styles.icon}>{service.icon}</Text>

            {/* 服务名称 */}
            <Text style={styles.serviceName} numberOfLines={1}>
              {service.name}
            </Text>

            {/* 距离 */}
            <Text style={styles.distance}>{service.distance}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,      // 16px
    paddingVertical: spacing.lg,        // 16px
    backgroundColor: colors.busPage.sectionBg,  // #F5F5F5
  },

  title: {
    fontSize: 16,                       // Figma: 32px ÷ 2
    lineHeight: 20,                     // 16 × 1.25
    fontWeight: '600',
    color: colors.busPage.stationText,  // #333333
    marginBottom: spacing.md,           // 12px
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,                    // 12px between cards
  },

  card: {
    backgroundColor: colors.busPage.cardBg,  // #FFFFFF
    borderRadius: borderRadius.md,      // 8px
    paddingVertical: spacing.md,        // 12px
    paddingHorizontal: spacing.sm,      // 8px
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  icon: {
    fontSize: 24,
    marginBottom: spacing.xs,           // 4px
  },

  serviceName: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,                     // 12 × 1.25
    fontWeight: '400',
    color: colors.busPage.stationText,  // #333333
    marginBottom: spacing.xs,           // 4px
    textAlign: 'center',
  },

  distance: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,                     // 12 × 1.25
    fontWeight: '400',
    color: colors.busPage.serviceDistance,  // #6a6e81
  },
});
