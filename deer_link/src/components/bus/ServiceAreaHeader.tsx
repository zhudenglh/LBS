// Service Area Header Component - 便民服务区域标题（完全按照Figma还原）

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';

interface ServiceAreaHeaderProps {
  title: string;                                // 标题（如"便民服务·东浦路"）
  onMorePress?: () => void;                     // 点击"全部服务"
}

// Figma图片资源
const FIGMA_IMAGES = {
  serviceIcon: 'http://localhost:3845/assets/7077eaa97425335352e3ab56f42205c41778037a.svg',  // 便民服务图标
  moreArrow: 'http://localhost:3845/assets/394c3b6c38e62d4a113ac138fe357650f8786c6d.svg',
};

export default function ServiceAreaHeader({ title, onMorePress }: ServiceAreaHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 左侧：图标 + 标题 */}
      <View style={styles.titleRow}>
        <RemoteSvg
          uri={FIGMA_IMAGES.serviceIcon}
          width={18}
          height={18}
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* 右侧：全部服务按钮 */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={onMorePress}
        activeOpacity={0.7}
      >
        <Text style={styles.moreText}>全部服务</Text>
        <RemoteSvg
          uri={FIGMA_IMAGES.moreArrow}
          width={7}
          height={11}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingTop: 8,                              // 减少顶部间距
    paddingBottom: 8,                           // 减少底部间距
    backgroundColor: colors.white,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,                                     // Figma: 10px ÷ 2
  },

  title: {
    fontSize: 15,                               // Figma: 30px ÷ 2
    lineHeight: 19,                             // 15 × 1.27 (防止截断)
    fontWeight: '500',
    color: colors.text.primary,                 // #333333
  },

  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },

  moreText: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
  },
});
