// WiFi Header - 黄色背景 + 搜索栏 + 定位 + 扫码

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, scaleFont } from '../../utils/scale';

interface WiFiHeaderProps {
  onSearchPress?: () => void;
  onLocationPress?: () => void;
  onScanPress?: () => void;
}

export default function WiFiHeader({
  onSearchPress,
  onLocationPress,
  onScanPress,
}: WiFiHeaderProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: '#FFE631',
        paddingTop: StatusBar.currentHeight || scale(44),
      }}
    >
      {/* 顶部状态栏区域 - 88px高 */}
      <View
        style={{
          height: scale(88),
          paddingHorizontal: scale(15),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 左侧：定位标签 */}
        <TouchableOpacity
          onPress={onLocationPress}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: scale(6),
          }}
        >
          {/* 定位图标 */}
          <Text style={{ fontSize: scaleFont(20) }}>📍</Text>
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '500',
              fontSize: scaleFont(32),
              color: '#111111',
            }}
          >
            南京
          </Text>
        </TouchableOpacity>

        {/* 中间：搜索栏 */}
        <TouchableOpacity
          onPress={onSearchPress}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: scale(32),
            marginHorizontal: scale(12),
            paddingHorizontal: scale(30),
            paddingVertical: scale(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontFamily: 'Source Han Sans CN',
              fontWeight: '400',
              fontSize: scaleFont(24),
              color: '#1c1e21',
              flex: 1,
            }}
          >
            南京市的人气酒店
          </Text>
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '500',
              fontSize: scaleFont(28),
              color: '#1a1b16',
            }}
          >
            搜索
          </Text>
        </TouchableOpacity>

        {/* 右侧：扫码图标 */}
        <TouchableOpacity
          onPress={onScanPress}
          activeOpacity={0.7}
          style={{
            width: scale(68),
            height: scale(68),
            borderRadius: scale(24),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* 扫码图标 - 四个角 */}
          <View style={{ width: scale(36), height: scale(36) }}>
            {/* 左上角 */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: scale(8),
                height: scale(8),
                borderLeftWidth: scale(2),
                borderTopWidth: scale(2),
                borderColor: '#111111',
              }}
            />
            {/* 右上角 */}
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: scale(8),
                height: scale(8),
                borderRightWidth: scale(2),
                borderTopWidth: scale(2),
                borderColor: '#111111',
              }}
            />
            {/* 左下角 */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: scale(8),
                height: scale(8),
                borderLeftWidth: scale(2),
                borderBottomWidth: scale(2),
                borderColor: '#111111',
              }}
            />
            {/* 右下角 */}
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: scale(8),
                height: scale(8),
                borderRightWidth: scale(2),
                borderBottomWidth: scale(2),
                borderColor: '#111111',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
