// Tag Filter Bar - 标签筛选栏
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import SlidersHorizontalIcon from '@components/common/SlidersHorizontalIcon';
import CheckIcon from '@components/common/CheckIcon';

interface TagFilterBarProps {
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilterBar({ selectedTag, onTagChange }: TagFilterBarProps) {
  // Popular tags for quick filtering
  const popularTags = ['全部', '5路', '22路', 's3路', '轮渡21路', '攻略', '求助', '优惠'];

  return (
    <View
      className="bg-white border-b border-gray-200 px-4 py-3"
      style={{
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          },
          android: {
            elevation: 2,
          },
        }),
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {/* Filter Icon */}
        <TouchableOpacity
          className="flex items-center justify-center p-2 rounded-lg active:bg-gray-100"
          activeOpacity={0.7}
        >
          <SlidersHorizontalIcon size={18} color="#374151" />
        </TouchableOpacity>

        {/* Filter Tags */}
        {popularTags.map((tag) => {
          const isAll = tag === '全部';
          const isSelected = isAll ? selectedTag === null : selectedTag === tag;

          return (
            <TouchableOpacity
              key={tag}
              onPress={() => onTagChange(isAll ? null : tag)}
              className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${
                isSelected ? 'bg-gray-200' : 'bg-gray-100'
              }`}
              activeOpacity={0.7}
            >
              {isSelected && (
                <CheckIcon size={14} color="#1F2937" />
              )}
              <Text
                className={`text-sm ${isSelected ? 'text-gray-800 font-medium' : 'text-gray-600'}`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
