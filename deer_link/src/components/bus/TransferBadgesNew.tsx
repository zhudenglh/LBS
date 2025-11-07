// Transfer Badges Component - 可换乘线路标签（完全按照Figma还原）

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import RemoteSvg from '../common/RemoteSvg';

export interface TransferLine {
  type: 'metro' | 'bus';
  number: string;
  backgroundColor: string;
  textColor: string;
}

interface TransferBadgesProps {
  lines: TransferLine[];
}

// Figma图片资源
const FIGMA_IMAGES = {
  moreIcon: 'http://localhost:3845/assets/7300ecaa1a0373f4692d551a6d12dea85da511e7.svg',
  vectorArrow: 'http://localhost:3845/assets/2b71a6171a816201f2a21bd4713397641bee21d2.svg',
};

export default function TransferBadgesNew({ lines }: TransferBadgesProps) {
  return (
    <View style={styles.container}>
      {/* 标题 */}
      <Text style={styles.title}>可换乘</Text>

      {/* 线路标签容器 */}
      <View style={styles.badgesRow}>
        {lines.map((line, index) => (
          <View
            key={`${line.type}-${line.number}-${index}`}
            style={[
              styles.badge,
              { backgroundColor: line.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: line.textColor },
              ]}
            >
              {line.number}
            </Text>
          </View>
        ))}

        {/* 更多按钮 */}
        <View style={styles.moreButton}>
          <RemoteSvg
            uri={FIGMA_IMAGES.moreIcon}
            width={11.5}
            height={2.5}
          />
        </View>
      </View>

      {/* 更多文字 + 箭头 */}
      <View style={styles.moreTextContainer}>
        <Text style={styles.moreText}>更多</Text>
        <RemoteSvg
          uri={FIGMA_IMAGES.vectorArrow}
          width={5}
          height={10}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.busPage.sectionBg,  // #f4f6fa
    paddingHorizontal: 14,                      // Figma: 28px ÷ 2
    paddingVertical: 5,                         // Figma: 10px ÷ 2
    borderRadius: 4,                            // Figma: 8px ÷ 2
    marginHorizontal: 14,                       // Figma: 28px ÷ 2
    marginTop: 5,                               // Figma: 10px ÷ 2
  },

  title: {
    fontSize: 14,                               // Figma: 28px ÷ 2
    lineHeight: 18,                             // 14 × 1.29 (防止截断)
    fontWeight: '400',
    color: colors.busPage.stationText,          // #5d606a
    marginBottom: 3,                            // 调整间距
  },

  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,                                     // Figma: 10px ÷ 2
  },

  badge: {
    height: 19,                                 // Figma: 38px ÷ 2
    paddingHorizontal: 5,                       // Figma: 10px ÷ 2
    paddingVertical: 4.5,                       // Figma: 9px ÷ 2
    borderRadius: 4,                            // Figma: 8px ÷ 2
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '400',
    textAlign: 'center',
  },

  moreButton: {
    width: 14,                                  // Figma: 28px ÷ 2
    height: 20,                                 // Figma: 40px ÷ 2
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4.5,
    borderRadius: 4,
  },

  moreIcon: {
    width: 11.5,                                // Figma: 23px ÷ 2
    height: 2.5,                                // Figma: 5px ÷ 2
  },

  moreTextContainer: {
    position: 'absolute',
    right: 14,
    top: 17,                                    // 对齐到标题行
    flexDirection: 'row',
    alignItems: 'center',
    gap: -4,
  },

  moreText: {
    fontSize: 12,                               // Figma: 24px ÷ 2
    lineHeight: 15,                             // 12 × 1.25 (防止截断)
    fontWeight: '400',
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'right',
  },

  arrowIcon: {
    width: 5,                                   // Figma: 10px ÷ 2
    height: 10,                                 // Figma: 20px ÷ 2
    marginLeft: 2,
  },
});
