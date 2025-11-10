// SearchBar - 搜索栏组件（精确Figma尺寸）
// Node ID: 1:571 - Group 51447788
// 尺寸：750×88px (设计稿) → 375×44px (实际)
// 结构：定位图标+城市名 | 搜索框(placeholder+搜索按钮) | 扫码图标

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <View className="h-[44px] flex-row items-center bg-transparent px-0">
      {/* 左侧：位置图标 + 城市名 */}
      <View className="flex-row items-center mr-[6px]">
        <LocationIcon size={15} color="#111111" />
        {/* 城市名文字 - 精确Figma: 32px/2 = 16px Medium, #111111 */}
        <Text
          className="font-medium text-[16px] leading-[19px] text-[#111111] ml-[4px]"
          style={{ fontFamily: 'Noto Sans CJK SC' }}
        >
          {location}
        </Text>
      </View>

      {/* 中间：搜索框 - 精确Figma: height 64px/2 = 32px, borderRadius 32px/2 = 16px */}
      <TouchableOpacity
        className="flex-1 h-[32px] bg-white rounded-[16px] flex-row items-center pl-[15px] pr-[8px] mr-[6px]"
        onPress={onSearchPress}
        activeOpacity={0.8}
      >
        {/* Placeholder文字 - 精确Figma: 24px/2 = 12px Regular, #1c1e21 */}
        <Text
          className="flex-1 font-normal text-[12px] leading-[22px]"
          numberOfLines={1}
          style={{ fontFamily: 'Source Han Sans CN', color: colors.text.figmaText1 }}
        >
          {placeholder || t('search.placeholder') || '南京市的人气酒店'}
        </Text>
        <View className="px-[4px]">
          {/* "搜索"按钮文字 - 精确Figma: 28px/2 = 14px Medium, #1a1b16 */}
          <Text
            className="font-medium text-[14px] leading-[22px]"
            style={{ fontFamily: 'Noto Sans CJK SC', color: colors.text.searchPlaceholder }}
          >
            {t('search.button') || '搜索'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 右侧：扫码图标 - 精确Figma: 68px/2 = 34px */}
      <TouchableOpacity
        className="w-[34px] h-[34px] justify-center items-center"
        onPress={onScanPress}
        activeOpacity={0.8}
      >
        <ScanIcon size={34} color="#111111" />
      </TouchableOpacity>
    </View>
  );
}
