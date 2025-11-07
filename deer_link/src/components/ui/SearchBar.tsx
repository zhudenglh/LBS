// SearchBar - 搜索栏组件（精确Figma尺寸）
// Node ID: 1:571 - Group 51447788
// 尺寸：750×88px (设计稿) → 375×44px (实际)
// 结构：定位图标+城市名 | 搜索框(placeholder+搜索按钮) | 扫码图标

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import LocationIcon from '../icons/LocationIcon';
import ScanIcon from '../icons/ScanIcon';
import { colors } from '../../constants/theme';

interface SearchBarProps {
  onSearchPress?: () => void;
  onScanPress?: () => void;
  placeholder?: string;
  location?: string;
}

export default function SearchBar({
  onSearchPress,
  onScanPress,
  placeholder,
  location = '南京',
}: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* 左侧：位置图标 + 城市名 */}
      <View style={styles.locationSection}>
        <LocationIcon size={15} color="#111111" />
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* 中间：搜索框 */}
      <TouchableOpacity
        style={styles.searchField}
        onPress={onSearchPress}
        activeOpacity={0.8}
      >
        <Text style={styles.placeholderText} numberOfLines={1}>
          {placeholder || t('search.placeholder') || '南京市的人气酒店'}
        </Text>
        <View style={styles.searchButton}>
          <Text style={styles.searchButtonText}>
            {t('search.button') || '搜索'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 右侧：扫码图标 */}
      <TouchableOpacity
        style={styles.scanIconButton}
        onPress={onScanPress}
        activeOpacity={0.8}
      >
        <ScanIcon size={34} color="#111111" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 容器 - 精确Figma高度88px/2 = 44px
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },

  // 左侧位置区域
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },

  // 城市名文字 - 精确Figma: 32px/2 = 16px Medium, #111111
  locationText: {
    fontFamily: 'Noto Sans CJK SC',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 19,
    color: '#111111',
    marginLeft: 4,
  },

  // 搜索框 - 精确Figma: height 64px/2 = 32px, borderRadius 32px/2 = 16px
  searchField: {
    flex: 1,
    height: 32,
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 8,
    marginRight: 6,
  },

  // Placeholder文字 - 精确Figma: 24px/2 = 12px Regular, #1c1e21
  placeholderText: {
    flex: 1,
    fontFamily: 'Source Han Sans CN',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 22,
    color: colors.text.figmaText1,
  },

  // "搜索"按钮区域
  searchButton: {
    paddingHorizontal: 4,
  },

  // "搜索"按钮文字 - 精确Figma: 28px/2 = 14px Medium, #1a1b16
  searchButtonText: {
    fontFamily: 'Noto Sans CJK SC',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.searchPlaceholder,
  },

  // 扫码图标按钮 - 精确Figma: 68px/2 = 34px
  scanIconButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
