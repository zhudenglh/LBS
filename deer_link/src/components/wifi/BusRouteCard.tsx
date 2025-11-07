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
        borderRadius: 10,
        padding: 12,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        {/* 左侧 - 图标+文本 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1 }}>
          {/* 公交图标 - 40x40/2 = 20x20 */}
          <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>🚌</Text>
          </View>

          {/* 欢迎文本 - 30px/2 = 15px */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '500',
              fontSize: 15,
              lineHeight: 19,
              color: '#222222',
              flex: 1,
            }}
            numberOfLines={1}
          >
            欢迎乘坐南京公交·{routeName}
          </Text>
        </View>

        {/* 右侧箭头 - 34x34/2 = 17x17 */}
        <View
          style={{
            width: 17,
            height: 17,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ rotate: '90deg' }],
          }}
        >
          <Text style={{ fontSize: 10, color: '#999' }}>›</Text>
        </View>
      </View>

      {/* Info区域 */}
      <View
        style={{
          backgroundColor: '#f4f6fa',
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 左侧信息 - 使用flex替代固定宽度 */}
        <View style={{ flex: 1, gap: 10, marginRight: 6 }}>
          {/* 方向 - 28px/2 = 14px */}
          {direction && (
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '500',
                fontSize: 14,
                lineHeight: 18,
                color: '#1c1e21',
              }}
            >
              {direction}
            </Text>
          )}

          {/* 下一站信息 - 24px/2 = 12px */}
          {nextStation && (
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 16,
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
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 7,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* 铃铛图标 - 24px/2 = 12px */}
            <View style={{ width: 12, height: 12, marginRight: 2 }}>
              <Text style={{ fontSize: 9 }}>🔔</Text>
            </View>

            {/* 按钮文本 - 24px/2 = 12px */}
            <Text
              style={{
                fontFamily: 'PingFang SC',
                fontWeight: '500',
                fontSize: 12,
                lineHeight: 12,
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
