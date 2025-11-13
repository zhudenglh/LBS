// Filter Banner - 筛选横幅
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFlairColor } from '@utils/flairColors';

interface FilterBannerProps {
  selectedTag: string;
  postCount?: number;
  onClear: () => void;
}

export default function FilterBanner({ selectedTag, postCount, onClear }: FilterBannerProps) {
  const colors = getFlairColor(selectedTag);

  return (
    <View className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <View className="flex-row items-center justify-between">
        {/* Filter Info */}
        <View className="flex-row items-center flex-1">
          <View
            className="px-2.5 py-1 rounded-full mr-2"
            style={{ backgroundColor: colors.bg }}
          >
            <Text className="text-xs font-medium" style={{ color: colors.text }}>
              {selectedTag}
            </Text>
          </View>
          <Text className="text-sm text-gray-600">
            {postCount !== undefined ? `${postCount} 条帖子` : '正在筛选...'}
          </Text>
        </View>

        {/* Clear Button */}
        <TouchableOpacity
          onPress={onClear}
          className="flex-row items-center bg-white rounded-full px-3 py-1.5 active:bg-gray-100"
          activeOpacity={0.7}
        >
          <Icon name="close-circle" size={16} color="#6B7280" style={{ marginRight: 4 }} />
          <Text className="text-sm font-medium text-gray-700">清除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
