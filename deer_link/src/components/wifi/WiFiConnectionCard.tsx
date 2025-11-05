// WiFi Connection Card - 精确按Figma还原（响应式适配）

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { scale, scaleFont } from '../../utils/scale';

interface WiFiConnectionCardProps {
  isConnected: boolean;
  networkName?: string;
  nearbyCount?: number;
  onConnect: () => void;
}

export default function WiFiConnectionCard({
  isConnected,
  networkName,
  nearbyCount = 33,
  onConnect,
}: WiFiConnectionCardProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: scale(20),
        paddingVertical: scale(24),
        paddingHorizontal: scale(24),
      }}
    >
      {/* 内容区 - 使用flex布局替代固定宽度 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 左侧文本区域 */}
        <View style={{ flex: 1, marginRight: scale(16) }}>
          {/* 主标题 - 34px Bold */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '700',
              fontSize: scaleFont(34),
              lineHeight: scaleFont(34),
              color: '#1c1e21',
              marginBottom: 0,
            }}
          >
            {isConnected ? t('wifi.status.connected') : '当前未连接WiFi'}
          </Text>

          {/* 副标题 - 24px Regular + 箭头 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scale(8) }}>
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '400',
                fontSize: scaleFont(24),
                lineHeight: scaleFont(24),
                color: '#878c99',
              }}
            >
              附近有{nearbyCount}个免费WiFi
            </Text>
            {/* 下拉箭头 */}
            <View
              style={{
                width: scale(30),
                height: scale(30),
                marginLeft: scale(3),
                transform: [{ rotate: '90deg' }],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: scaleFont(18), color: '#878c99' }}>›</Text>
            </View>
          </View>
        </View>

        {/* 右侧按钮 - 212x76 */}
        <TouchableOpacity
          onPress={onConnect}
          activeOpacity={0.8}
          style={{
            width: scale(212),
            height: scale(76),
            borderRadius: scale(116),
          }}
        >
          <LinearGradient
            colors={['#ffdd19', '#ffe631']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: scale(116),
              paddingHorizontal: scale(20),
              paddingVertical: scale(16),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#fff717',
              shadowOffset: { width: 0, height: scale(4) },
              shadowOpacity: 0.2,
              shadowRadius: scale(12),
              elevation: 4,
            }}
          >
            {/* WiFi图标 */}
            <Text style={{ fontSize: scaleFont(24), marginRight: scale(4) }}>📶</Text>

            {/* 按钮文本 - 28px Medium, lineHeight 44px */}
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '500',
                fontSize: scaleFont(28),
                lineHeight: scaleFont(44),
                color: '#1c1e21',
              }}
            >
              一键直连
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
