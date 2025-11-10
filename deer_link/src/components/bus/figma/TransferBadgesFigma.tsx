/**
 * TransferBadges - Figma完整还原
 * 可换乘线路徽章列表
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface TransferLine {
  number: string;
  bgColor: string;
  textColor: string;
  type: 'metro' | 'bus';
}

interface TransferBadgesProps {
  lines?: TransferLine[];
}

// 箭头图标
function ArrowRightIcon() {
  return (
    <Svg width={7} height={11} viewBox="0 0 13 23" fill="none">
      <Path
        d="M1.25 1.25L11.25 11.25L1.25 21.25"
        stroke="black"
        strokeOpacity="0.4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 更多图标（三个点）
function MoreDotsIcon() {
  return (
    <Svg width={11.5} height={2.5} viewBox="0 0 23 5" fill="none">
      <Path
        d="M2.5 0C3.88071 0 5 1.11929 5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0ZM11.5 0C12.8807 0 14 1.11929 14 2.5C14 3.88071 12.8807 5 11.5 5C10.1193 5 9 3.88071 9 2.5C9 1.11929 10.1193 0 11.5 0ZM20.5 0C21.8807 0 23 1.11929 23 2.5C23 3.88071 21.8807 5 20.5 5C19.1193 5 18 3.88071 18 2.5C18 1.11929 19.1193 0 20.5 0Z"
        fill="#7C84A1"
      />
    </Svg>
  );
}

const defaultLines: TransferLine[] = [
  { number: '4号线', bgColor: '#8565c4', textColor: '#FFFFFF', type: 'metro' },
  { number: 'S3号线', bgColor: '#c779bc', textColor: '#FFFFFF', type: 'metro' },
  { number: '33路', bgColor: '#dbefff', textColor: '#0285f0', type: 'bus' },
];

export default function TransferBadgesFigma({ lines = defaultLines }: TransferBadgesProps) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* 标题：可换乘 */}
        <Text style={styles.title}>可换乘</Text>

        {/* 徽章列表 */}
        {lines.map((line, index) => (
          <View
            key={index}
            style={[styles.badge, { backgroundColor: line.bgColor }]}
          >
            <Text style={[styles.badgeText, { color: line.textColor }]}>
              {line.number}
            </Text>
          </View>
        ))}

        {/* 更多图标 */}
        <View style={styles.moreIconContainer}>
          <MoreDotsIcon />
        </View>

        {/* 右侧更多按钮 */}
        <View style={styles.moreButton}>
          <Text style={styles.moreText}>更多</Text>
          <ArrowRightIcon />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 8,
    paddingHorizontal: 16, // 与 RouteInfo 相同的水平padding
  },
  container: {
    backgroundColor: '#f4f6fa',
    alignSelf: 'flex-start', // 左对齐
    flexDirection: 'row', // 水平排列所有元素
    alignItems: 'center', // 垂直居中对齐
    paddingHorizontal: 7, // Figma 14px / 2
    paddingVertical: 5, // Figma 10px / 2，紧凑包围
    borderRadius: 4, // Figma 8px / 2
    gap: 5, // 统一间距 Figma 10px / 2
    marginLeft: 52, // Figma 104px / 2，让框从"下一站"文字右侧开始
  },
  title: {
    color: '#5d606a',
    fontSize: 14, // Figma 28px / 2
    fontWeight: '400',
    marginRight: 5, // 与徽章的间距
    flexShrink: 0, // 防止压缩
  },
  badge: {
    width: 47.5, // Figma 95px / 2
    height: 19, // Figma 38px / 2
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4, // Figma 8px / 2
    paddingHorizontal: 5, // Figma 10px / 2
    paddingVertical: 4.5, // Figma 9px / 2
    flexShrink: 0, // 防止压缩
  },
  badgeText: {
    fontSize: 12, // Figma 24px / 2
    fontWeight: '400',
    lineHeight: 11,
    textAlign: 'center',
  },
  moreIconContainer: {
    width: 14, // Figma 28px / 2
    height: 20, // Figma 40px / 2
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5, // Figma 10px / 2
    paddingVertical: 4.5, // Figma 9px / 2
    flexShrink: 0, // 防止压缩
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', // 推到最右侧
    flexShrink: 0, // 防止压缩
  },
  moreText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 12,
    marginRight: 2,
  },
});
