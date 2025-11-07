// Route Info Component - 路线信息（方向、下一站、提醒按钮）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface RouteInfoProps {
  direction: string;          // 方向，如"开往·张江高科方向"
  nextStation: string;        // 下一站名称，如"东浦路"
  estimatedTime?: number;     // 预计时间（分钟）
  onReminderPress: () => void; // 下车提醒按钮点击事件
  reminderActive?: boolean;   // 是否已设置提醒
}

export default function RouteInfo({
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
      <View style={styles.stationRow}>
        <View style={styles.stationInfo}>
          <Text style={styles.nextStationLabel}>下一站</Text>
          <Text style={styles.stationName}>{nextStation}</Text>
          {estimatedTime !== undefined && (
            <Text style={styles.estimatedTime}>
              预计{estimatedTime}分钟
            </Text>
          )}
        </View>

        {/* 下车提醒按钮 */}
        <TouchableOpacity
          style={[
            styles.reminderButton,
            reminderActive && styles.reminderButtonActive,
          ]}
          onPress={onReminderPress}
          activeOpacity={0.8}
        >
          <Text style={styles.reminderIcon}>{reminderActive ? '✓' : '🔔'}</Text>
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
    paddingHorizontal: spacing.lg,      // 16px
    paddingVertical: spacing.md,        // 12px
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // 方向文本
  directionText: {
    fontSize: 16,                       // Figma: 32px ÷ 2
    lineHeight: 20,                     // 16 × 1.25
    fontWeight: '500',
    color: colors.busPage.direction,    // #1c1e21
    marginBottom: spacing.md + spacing.xs,  // 16px
  },

  // 下一站信息行
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  stationInfo: {
    flex: 1,
  },

  nextStationLabel: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,                     // 12 × 1.25
    fontWeight: '400',
    color: colors.busPage.timeText,     // #999999
    marginBottom: spacing.xs,           // 4px
  },

  stationName: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 17,                     // 14 × 1.2
    fontWeight: '500',
    color: colors.busPage.nextStation,  // #1293fe （蓝色）
    marginBottom: spacing.xs,           // 4px
  },

  estimatedTime: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 17,                     // 14 × 1.2
    fontWeight: '500',
    color: colors.busPage.nextStation,  // #1293fe （蓝色）
  },

  // 下车提醒按钮
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.busPage.reminderButton,  // #1293fe（蓝色）
    paddingHorizontal: spacing.lg + spacing.xs,  // 20px
    paddingVertical: spacing.md + 2,    // 14px
    borderRadius: 20,                   // Figma: 40px ÷ 2
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  reminderButtonActive: {
    backgroundColor: '#4CAF50',         // 已设置状态变绿色
  },

  reminderIcon: {
    fontSize: 14,
    marginRight: spacing.xs,            // 4px
  },

  reminderText: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 17,                     // 14 × 1.2
    fontWeight: '500',
    color: colors.busPage.busNumber,    // #1D1D1D
  },
});
