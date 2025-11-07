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
        backgroundColor: 'transparent',
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
        <View style={{ flex: 1, marginRight: 8 }}>
          {/* 主标题 - 34px/2=17px Bold */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '700',
              fontSize: 17,
              lineHeight: 22,
              color: '#1c1e21',
              marginBottom: 0,
            }}
          >
            {isConnected ? t('wifi.status.connected') : '当前未连接WiFi'}
          </Text>

          {/* 副标题 - 24px/2=12px Regular + 箭头 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text
              style={{
                fontFamily: 'Noto Sans CJK SC',
                fontWeight: '400',
                fontSize: 12,
                lineHeight: 16,
                color: '#878c99',
              }}
            >
              附近有{nearbyCount}个免费WiFi
            </Text>
            {/* 下拉箭头 */}
            <View
              style={{
                width: 15,
                height: 15,
                marginLeft: 2,
                transform: [{ rotate: '90deg' }],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 9, color: '#878c99' }}>›</Text>
            </View>
          </View>
        </View>

        {/* 右侧按钮 - 212x76/2 = 106x38 */}
        <TouchableOpacity
          onPress={onConnect}
          activeOpacity={0.8}
          style={{
            width: 106,
            height: 38,
            borderRadius: 58,
          }}
        >
          {isConnected ? (
            // 连接成功 - 绿框白底
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 58,
                borderWidth: 1,
                borderColor: '#52c41a',
                backgroundColor: '#ffffff',
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* 绿色背景白色对勾 */}
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#52c41a',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 4,
                }}
              >
                <Text style={{ fontSize: 12, color: '#ffffff' }}>✓</Text>
              </View>

              {/* 绿色文字 */}
              <Text
                style={{
                  fontFamily: 'Noto Sans CJK SC',
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 22,
                  color: '#52c41a',
                }}
              >
                连接成功
              </Text>
            </View>
          ) : (
            // 未连接 - 黄色渐变
            <LinearGradient
              colors={['#ffdd19', '#ffe631']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 58,
                paddingHorizontal: 10,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#fff717',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              {/* WiFi图标 */}
              <Text style={{ fontSize: 12, marginRight: 2 }}>📶</Text>

              {/* 按钮文本 */}
              <Text
                style={{
                  fontFamily: 'Noto Sans CJK SC',
                  fontWeight: '500',
                  fontSize: 14,
                  lineHeight: 22,
                  color: '#1c1e21',
                }}
              >
                一键直连
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
