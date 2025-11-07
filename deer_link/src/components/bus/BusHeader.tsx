// Bus Header Component - 公交页面顶部（完全按Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing } from '../../constants/theme';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';

interface BusHeaderProps {
  busNumber: string;
  onWiFiPress: () => void;
  isWiFiConnected?: boolean;
}

// 精确的公交车图标（绿色方形）
function BusIconPrecise() {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* 绿色方形背景 */}
      <Rect x="10" y="12" width="20" height="16" rx="2" fill="#4CAF50" />

      {/* 白色窗户 */}
      <Rect x="13" y="15" width="6" height="5" rx="0.5" fill="white" />
      <Rect x="21" y="15" width="6" height="5" rx="0.5" fill="white" />

      {/* 深色底部轮廓 */}
      <Rect x="10" y="26" width="20" height="2" fill="#2E7D32" />
    </Svg>
  );
}

// WiFi图标（黑色）
function WiFiIcon() {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Path
        d="M15 22C16.1046 22 17 21.1046 17 20C17 18.8954 16.1046 18 15 18C13.8954 18 13 18.8954 13 20C13 21.1046 13.8954 22 15 22Z"
        fill="#1D1D1D"
      />
      <Path
        d="M10 17C11.5 15.5 13.5 14.5 15 14.5C16.5 14.5 18.5 15.5 20 17"
        stroke="#1D1D1D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M6 13C8.5 10.5 11.5 9 15 9C18.5 9 21.5 10.5 24 13"
        stroke="#1D1D1D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function BusHeader({ busNumber, onWiFiPress, isWiFiConnected = false }: BusHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 背景层 - 使用图片或渐变 */}
      <View style={styles.backgroundContainer}>
        {/* 公交车图片背景（使用占位图） */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80' }}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.8 }}
        >
          {/* 半透明遮罩 */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
            style={styles.gradient}
          />

          {/* 大WiFi文字在背景上 */}
          <View style={styles.wifiBigText}>
            <Text style={styles.wifiBigTextStyle}>WiFi</Text>
          </View>
        </ImageBackground>
      </View>

      {/* 前景内容 */}
      <View style={styles.contentOverlay}>
        {/* 左侧：公交信息 */}
        <View style={styles.leftSection}>
          <View style={styles.busNumberRow}>
            <BusIconPrecise />
            <Text style={styles.busNumberText}>{busNumber}</Text>
          </View>
          <Text style={styles.subtitleText}>南京公交免费WiFi</Text>
        </View>

        {/* 右侧：WiFi按钮 */}
        <TouchableOpacity onPress={onWiFiPress} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFEB3B', '#FFD54F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wifiButton}
          >
            <WiFiIcon />
            <Text style={styles.wifiButtonText}>连公交WiFi</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 190,                        // 增加高度以容纳背景图
    position: 'relative',
    overflow: 'hidden',
  },

  // 背景容器
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4A90E2',         // 公交车蓝色作为fallback
  },

  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // 背景上的大WiFi文字
  wifiBigText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }],
  },

  wifiBigTextStyle: {
    fontSize: 48,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // 前景内容层
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg + spacing.md,  // 28px
    paddingBottom: spacing.lg,                   // 16px
    paddingTop: spacing.lg,
  },

  // 左侧区域
  leftSection: {
    gap: spacing.xs,
  },

  busNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  busNumberText: {
    fontSize: 21,                       // Figma: 42px ÷ 2
    lineHeight: 26,
    fontWeight: '500',
    color: '#222222',
  },

  subtitleText: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.95)',   // 白色，确保可见
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // WiFi按钮
  wifiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 58,
    gap: 4,
    shadowColor: '#FDD835',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  wifiButtonText: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
    color: '#1D1D1D',
  },
});
