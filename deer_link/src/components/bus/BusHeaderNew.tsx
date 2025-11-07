// Bus Header Component - 完全按照Figma还原（使用Figma图片资源）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';

interface BusHeaderProps {
  busNumber: string;
  onWiFiPress: () => void;
  isWiFiConnected?: boolean;
}

// Figma图片资源URL
const FIGMA_IMAGES = {
  busBackground1: 'http://localhost:3845/assets/12bc340389a2c0d3156a53745a84d76363893cd2.png',
  busBackground2: 'http://localhost:3845/assets/e497b612e35b4e6f16f8b24c32b49abed1740ddc.png',
  busBackground3: 'http://localhost:3845/assets/0e974262834be012d9007d9b476f8b45cd26c99e.png',
  bgSvg: 'http://localhost:3845/assets/5ca2be3597f84e02296541615ead23f864880dac.svg',
  busIcon: 'http://localhost:3845/assets/1e67e466904771282f83b62e84eab34b326ffea2.svg',
  wifiIcon: 'http://localhost:3845/assets/bbcadc8407cb387de8f261b1cd1545fa7877d2de.svg',
  wifiSignal: 'http://localhost:3845/assets/71e94da7a2f925c7f7f28d44ccd783b6b6e25bc3.svg',
};

export default function BusHeaderNew({ busNumber, onWiFiPress, isWiFiConnected = false }: BusHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 背景图片 - 使用Figma提供的图片 */}
      <Image
        source={{ uri: FIGMA_IMAGES.busBackground2 }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 顶部渐变遮罩 */}
      <View style={styles.topGradient}>
        <LinearGradient
          colors={['rgba(0,0,0,0.48)', 'rgba(102,102,102,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientFill}
        />
      </View>

      {/* 底部内容容器 */}
      <View style={styles.bottomContent}>
        {/* 底部背景 - 使用Figma bg SVG */}
        <View style={styles.bgSvg}>
          <RemoteSvg
            uri={FIGMA_IMAGES.bgSvg}
            width={750}
            height={75}
          />
        </View>

        {/* 左侧：25路信息 */}
        <View style={styles.leftSection}>
          <View style={styles.busNumberRow}>
            {/* 公交图标 - 使用Figma SVG */}
            <RemoteSvg
              uri={FIGMA_IMAGES.busIcon}
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
            {/* WiFi图标 - 使用Figma SVG */}
            <RemoteSvg
              uri={FIGMA_IMAGES.wifiIcon}
              width={15}
              height={15}
            />
            <Text style={styles.wifiButtonText}>连公交WiFi</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,                        // Figma: 320px ÷ 2
    position: 'relative',
    overflow: 'hidden',
  },

  // 背景图片
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  // 顶部渐变遮罩
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 58,                         // Figma: 116px ÷ 2
    transform: [{ rotate: '180deg' }],
  },

  gradientFill: {
    flex: 1,
  },

  // 底部内容区域
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,                         // Figma: 150px ÷ 2
  },

  // 底部背景SVG
  bgSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 75,
  },

  // 左侧信息区域
  leftSection: {
    position: 'absolute',
    left: 14,                           // Figma: 28px ÷ 2
    top: 14,                            // Figma: 28px ÷ 2
    gap: 0,
  },

  busNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,                             // Figma: 8px ÷ 2
    marginBottom: 2,
  },

  // 公交图标 - Figma精确尺寸
  busIcon: {
    width: 20,                          // Figma: 40px ÷ 2
    height: 20,                         // Figma: 40px ÷ 2
  },

  busNumberText: {
    fontSize: 21,                       // Figma: 42px ÷ 2
    lineHeight: 26,                     // 21 × 1.24 (防止截断)
    fontWeight: '500',
    color: colors.busPage.busNumber,    // #222222
  },

  subtitleText: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,                     // 12 × 1.25 (防止截断)
    fontWeight: '400',
    color: colors.busPage.wifiSubtext,  // #999999
  },

  // WiFi按钮
  wifiButton: {
    position: 'absolute',
    right: 14,                          // Figma: 28px ÷ 2 (从右边距)
    bottom: 17.5,                       // Figma: 35px ÷ 2 (从底部)
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,              // Figma: 32px ÷ 2
    paddingVertical: 10,                // Figma: 20px ÷ 2
    borderRadius: 58,                   // Figma: 116px ÷ 2
    gap: 2,                             // Figma: 4px ÷ 2
    shadowColor: 'rgba(255,220,23,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  // WiFi图标
  wifiIconImage: {
    width: 15,                          // Figma: 30px ÷ 2
    height: 15,                         // Figma: 30px ÷ 2
  },

  wifiButtonText: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 18,                     // 14 × 1.29 (防止截断)
    fontWeight: '500',
    color: '#1d1d1d',                   // Figma: 按钮文字颜色
  },
});
