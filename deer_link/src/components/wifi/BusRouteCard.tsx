// Bus Route Card - 精确按Figma还原（响应式适配）

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, scaleFont } from '../../utils/scale';

interface BusRouteCardProps {
  routeName: string;
  direction?: string;
  nextStation?: string;
  estimatedTime?: string;
  onReminderPress?: () => void;
}

export default function BusRouteCard({
  routeName,
  direction,
  nextStation,
  estimatedTime,
  onReminderPress,
}: BusRouteCardProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: scale(20),
        padding: scale(24),
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: scale(16),
        }}
      >
        {/* 左侧 - 图标+文本 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6), flex: 1 }}>
          {/* 公交图标 - 40x40 */}
          <View style={{ width: scale(40), height: scale(40), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: scaleFont(32) }}>🚌</Text>
          </View>

          {/* 欢迎文本 - 30px */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '500',
              fontSize: scaleFont(30),
              lineHeight: scaleFont(30),
              color: '#222222',
              flex: 1,
            }}
            numberOfLines={1}
          >
            欢迎乘坐南京公交·{routeName}
          </Text>
        </View>

        {/* 右侧箭头 - 34x34 */}
        <View
          style={{
            width: scale(34),
            height: scale(34),
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: '90deg' }],
          }}
        >
          <Text style={{ fontSize: scaleFont(20), color: '#999' }}>›</Text>
        </View>
      </View>

      {/* Info区域 */}
      <View
        style={{
          backgroundColor: '#f4f6fa',
          borderRadius: scale(20),
          padding: scale(24),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 左侧信息 - 使用flex替代固定宽度 */}
        <View style={{ flex: 1, gap: scale(20), marginRight: scale(12) }}>
          {/* 方向 - 28px */}
          {direction && (
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '500',
                fontSize: scaleFont(28),
                lineHeight: scaleFont(28),
                color: '#1c1e21',
              }}
            >
              {direction}
            </Text>
          )}

          {/* 下一站信息 - 24px */}
          {nextStation && (
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '500',
                fontSize: scaleFont(24),
                lineHeight: scaleFont(24),
                color: '#1293fe',
              }}
            >
              下一站·{nextStation}·预计{estimatedTime || '3'}分钟
            </Text>
          )}
        </View>

        {/* 右侧按钮 */}
        {onReminderPress && (
          <TouchableOpacity
            onPress={onReminderPress}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#1293fe',
              borderRadius: scale(40),
              paddingHorizontal: scale(20),
              paddingVertical: scale(14),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* 铃铛图标 */}
            <View style={{ width: scale(24), height: scale(24), marginRight: scale(4) }}>
              <Text style={{ fontSize: scaleFont(18) }}>🔔</Text>
            </View>

            {/* 按钮文本 - 24px */}
            <Text
              style={{
                fontFamily: 'PingFang SC',
                fontWeight: '500',
                fontSize: scaleFont(24),
                lineHeight: scaleFont(24),
                color: 'white',
              }}
            >
              到站提醒
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
