// Transfer Badges Component - 可换乘线路标签

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../constants/theme';

export interface TransferLine {
  type: 'metro' | 'bus';  // 地铁或公交
  number: string;         // 线路号，如"4号线"、"33路"
  backgroundColor?: string; // 标签背景色（可选，会使用默认值）
  textColor?: string;      // 文字颜色（可选，默认白色）
}

interface TransferBadgesProps {
  lines: TransferLine[];
}

export default function TransferBadges({ lines }: TransferBadgesProps) {
  if (!lines || lines.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>可换乘</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lines.map((line, index) => (
          <View
            key={`${line.type}-${line.number}-${index}`}
            style={[
              styles.badge,
              { backgroundColor: line.backgroundColor || colors.busPage.metro4 },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: line.textColor || colors.white },
              ]}
            >
              {line.number}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,      // 16px
    paddingVertical: spacing.md,        // 12px
    backgroundColor: colors.white,
  },

  title: {
    fontSize: 14,                       // Figma: 28px ÷ 2
    lineHeight: 17,                     // 14 × 1.2
    fontWeight: '600',
    color: colors.busPage.stationText,  // #333333
    marginBottom: spacing.sm,           // 8px
  },

  scrollContent: {
    flexDirection: 'row',
    gap: spacing.sm,                    // 8px between badges
  },

  badge: {
    paddingHorizontal: spacing.md,      // 12px
    paddingVertical: spacing.xs,        // 4px
    borderRadius: borderRadius.xl,      // 16px (Figma: 32px ÷ 2)
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 12,                       // Figma: 24px ÷ 2
    lineHeight: 15,                     // 12 × 1.25
    fontWeight: '500',
    color: colors.white,
  },
});
