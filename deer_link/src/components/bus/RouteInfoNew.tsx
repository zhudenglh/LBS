// Route Info Component - 路线信息（完全按照Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';

interface RouteInfoProps {
  direction: string;
  nextStation: string;
  estimatedTime?: number;
  onReminderPress: () => void;
  reminderActive?: boolean;
}

// Figma图片资源
const FIGMA_IMAGES = {
  reminderIcon: 'http://localhost:3845/assets/4daae69147fb03e94c4d4fc7f4d15166aa7e6b35.svg',
};

export default function RouteInfoNew({
  direction,
  nextStation,
  estimatedTime,
  onReminderPress,
  reminderActive = false,
}: RouteInfoProps) {
  return (
    <View style={styles.container}>
      {/* 方向信息 */}
      <Text style={styles.directionText}>{direction}</Text>

      {/* 下一站信息和提醒按钮 */}
      <View style={styles.bottomRow}>
        {/* 左侧：下一站信息 */}
        <View style={styles.stationInfo}>
          <Text style={styles.nextStationText}>
            下一站·{nextStation}
            {estimatedTime !== undefined && `·预计${estimatedTime}分钟`}
          </Text>
        </View>

        {/* 右侧：下车提醒按钮 */}
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderActive && styles.reminderButtonActive,
          ]}
          onPress={onReminderPress}
          activeOpacity={0.8}
        >
          {/* 提醒图标 - 使用Figma SVG */}
          <RemoteSvg
            uri={FIGMA_IMAGES.reminderIcon}
            width={14}
            height={15}
          />
          <Text style={styles.reminderText}>
            {reminderActive ? '已设置' : '下车提醒'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingTop: 12,                             // Figma: 24px ÷ 2
    paddingBottom: 12,                          // Figma: 24px ÷ 2
  },

  // 方向文本
  directionText: {
    fontSize: 16,                               // Figma: 32px ÷ 2
    lineHeight: 20,                             // 16 × 1.25 (防止截断)
    fontWeight: '500',
    color: colors.text.figmaText1,              // #1c1e21
    marginBottom: 12,                           // Figma: 24px ÷ 2
  },

  // 底部行
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stationInfo: {
    flex: 1,
  },

  nextStationText: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '500',
    color: colors.busPage.nextStation,          // #1293fe
  },

  // 下车提醒按钮
  reminderButton: {
    backgroundColor: colors.busPage.reminderButton,  // #1293fe
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,                      // Figma: 20px ÷ 2
    paddingVertical: 7,                         // Figma: 14px ÷ 2
    borderRadius: 20,                           // Figma: 40px ÷ 2
    gap: 3,                                     // Figma: 6px ÷ 2
    width: 105,                                 // Figma: 210px ÷ 2
    height: 38,                                 // Figma: 76px ÷ 2
    justifyContent: 'center',
  },

  reminderButtonActive: {
    backgroundColor: '#4CAF50',                 // 已设置状态变绿色
  },

  reminderIconImage: {
    width: 14,                                  // Figma: 28px ÷ 2
    height: 15,                                 // Figma: 30px ÷ 2
  },

  reminderText: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '500',
    color: colors.white,
  },
});
