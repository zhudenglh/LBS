// Bus Header Component - 完全按照Figma还原（使用Figma图片资源）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RemoteSvg from '../common/RemoteSvg';

interface BusHeaderProps {
  busNumber: string;
  onWiFiPress: () => void;
  isWiFiConnected?: boolean;
}

// Figma 资源 URL
const FIGMA_ASSETS = {
  busBackground: 'http://localhost:3845/assets/0e974262834be012d9007d9b476f8b45cd26c99e.png',
  busIcon: 'http://localhost:3845/assets/1e67e466904771282f83b62e84eab34b326ffea2.svg',
  wifiIcon: 'http://localhost:3845/assets/bbcadc8407cb387de8f261b1cd1545fa7877d2de.svg',
};

// Android 需要使用 10.0.2.2 替代 localhost
const getAssetUrl = (url: string) => {
  if (Platform.OS === 'android') {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

export default function BusHeaderNew({ busNumber, onWiFiPress, isWiFiConnected = false }: BusHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 公交车图片 - 完整图片，顶部被截断 */}
      <Image
        source={{ uri: getAssetUrl(FIGMA_ASSETS.busBackground) }}
        style={styles.busImage}
        resizeMode="cover"
      />

      {/* 顶部渐变遮罩（倒置） */}
      <View style={styles.topGradientContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.48)', 'rgba(102,102,102,0)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.topGradient}
        />
      </View>

      {/* 底部白色信息栏 - 遮盖在公交车图片上 */}
      <View style={styles.bottomWhiteBar}>
        {/* 左侧：25路信息 */}
        <View style={styles.leftSection}>
          <View style={styles.busNumberRow}>
            {/* 公交车图标 - Figma SVG */}
            <RemoteSvg
              uri={getAssetUrl(FIGMA_ASSETS.busIcon)}
              width={20}
              height={20}
            />
            <Text style={styles.busNumberText}>{busNumber}</Text>
          </View>
          <Text style={styles.subtitleText}>南京公交免费WiFi</Text>
        </View>

        {/* 右侧：WiFi按钮 */}
        <TouchableOpacity onPress={onWiFiPress} activeOpacity={0.8}>
          <LinearGradient
            colors={['#ffdd19', '#ffe631']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wifiButton}
          >
            {/* WiFi图标 - Figma SVG（黑色） */}
            <RemoteSvg
              uri={getAssetUrl(FIGMA_ASSETS.wifiIcon)}
              width={15}
              height={15}
              fill="#1d1d1d"
            />
            <Text style={styles.wifiButtonText}>连公交WiFi</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 主容器 - 可见区域高度 320px → 160px
  container: {
    height: 160,                        // 可见区域高度
    position: 'relative',
    overflow: 'hidden',                 // 裁剪超出部分
    backgroundColor: '#f4f6fa',
    borderBottomWidth: 1,               // 分割线
    borderBottomColor: '#E0E0E0',       // 浅灰色分割线
  },

  // 公交车图片 - 完整图片，顶部被截断
  busImage: {
    position: 'absolute',
    width: '100%',
    height: 250,                        // 图片实际高度（大于容器，顶部被裁剪）
    top: -50,                           // 负值让顶部被截断，只显示公交车部分
    left: 0,
    right: 0,
  },

  // 顶部渐变遮罩容器 - Figma: 116px → 58px
  topGradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 58,
    zIndex: 1,
  },

  // 顶部渐变（从下到上：透明到黑色）
  topGradient: {
    flex: 1,
  },

  // 底部白色信息栏 - Figma: 150px → 75px
  bottomWhiteBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#FFFFFF',         // 白色背景，遮盖公交车图片
    paddingHorizontal: 14,              // Figma: 28px ÷ 2
    paddingTop: 14,                     // Figma: 28px ÷ 2
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 2,                          // 在渐变和图片上方
  },

  // 左侧信息区域
  leftSection: {
    flex: 1,
  },

  busNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,                             // Figma: 8px ÷ 2，SVG和文字之间的间距
  },

  // 公交线路号 - Figma: 42px → 21px
  busNumberText: {
    fontSize: 21,
    lineHeight: 26,                     // Figma: 40px → 20px，稍微增加防止截断
    fontWeight: '500',
    color: '#222222',
  },

  // 副标题文字 - Figma: 24px → 12px
  subtitleText: {
    fontSize: 12,
    lineHeight: 15,
    color: '#999999',
  },

  // WiFi按钮 - Figma: 76px高 → 38px
  wifiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,              // Figma: 32px ÷ 2
    paddingVertical: 10,                // Figma: 20px ÷ 2
    borderRadius: 58,                   // Figma: 116px ÷ 2
    gap: 2,                             // Figma: 4px ÷ 2，SVG和文字之间的间距
    shadowColor: 'rgba(255,220,23,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  // WiFi按钮文字 - Figma: 28px → 14px
  wifiButtonText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#1d1d1d',                   // Figma: 按钮文字颜色
  },
});
