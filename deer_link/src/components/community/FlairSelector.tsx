// Flair Selector Component - 南京公交标签选择器
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import XIcon from '@components/common/XIcon';

interface FlairSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (flair: string) => void;
  selectedFlair?: string;
}

// Flair color mapping based on route type
const getFlairColor = (flair: string): { bg: string; text: string } => {
  if (flair.startsWith('s') || flair.startsWith('S')) {
    return { bg: '#A855F7', text: '#FFFFFF' }; // Metro lines - purple
  } else if (flair.includes('轮渡')) {
    return { bg: '#06B6D4', text: '#FFFFFF' }; // Ferry lines - cyan
  } else if (flair.startsWith('y') || flair.startsWith('Y')) {
    return { bg: '#6366F1', text: '#FFFFFF' }; // Night bus - indigo
  } else if (flair === '攻略' || flair === '推荐') {
    return { bg: '#3B82F6', text: '#FFFFFF' }; // Blue
  } else if (flair === '求助') {
    return { bg: '#9CA3AF', text: '#FFFFFF' }; // Gray
  } else if (flair === '优惠') {
    return { bg: '#F97316', text: '#FFFFFF' }; // Orange
  } else if (flair === '暖心') {
    return { bg: '#10B981', text: '#FFFFFF' }; // Green
  } else if (flair === '吐槽') {
    return { bg: '#EF4444', text: '#FFFFFF' }; // Red
  } else if (flair === '有轨电车') {
    return { bg: '#14B8A6', text: '#FFFFFF' }; // Teal
  } else if (flair === '机场巴士') {
    return { bg: '#EC4899', text: '#FFFFFF' }; // Pink
  } else if (flair === '地铁') {
    return { bg: '#9333EA', text: '#FFFFFF' }; // Purple-600
  } else {
    // Regular bus lines - use hash for consistency
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF' }, // Blue
      { bg: '#10B981', text: '#FFFFFF' }, // Green
      { bg: '#F97316', text: '#FFFFFF' }, // Orange
      { bg: '#EF4444', text: '#FFFFFF' }, // Red
      { bg: '#EC4899', text: '#FFFFFF' }, // Pink
      { bg: '#14B8A6', text: '#FFFFFF' }, // Teal
    ];
    const hash = flair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
};

export default function FlairSelector({
  visible,
  onClose,
  onSelect,
  selectedFlair,
}: FlairSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // All available flairs from Nanjing Bus subreddit
  const allFlairs = [
    's1路',
    's2路',
    's3路',
    's4路',
    's5路',
    '5路',
    '9路',
    '22路',
    '33路',
    '34路',
    '67路',
    '91路',
    '106路',
    '152路',
    'y1路',
    '轮渡21路',
    '有轨电车',
    '机场巴士',
    '地铁',
    '攻略',
    '推荐',
    '求助',
    '优惠',
    '暖心',
    '吐槽',
  ];

  // Filter flairs based on search query
  const filteredFlairs = searchQuery
    ? allFlairs.filter((flair) => flair.toLowerCase().includes(searchQuery.toLowerCase()))
    : allFlairs;

  const handleFlairClick = (flair: string) => {
    onSelect(flair);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-900">选择标记</Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 -mr-2 rounded-full active:bg-gray-100"
          >
            <XIcon size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Subreddit Info */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-base font-medium text-gray-900">圈/南京公交 标识</Text>
          <Text className="text-sm text-gray-500 mt-1">特定于社区的标记。此社区需要标识。</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Icon name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-900"
              placeholder="搜索标识"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Flair List */}
        <ScrollView className="flex-1 px-4 pb-4">
          <View className="space-y-2">
            {filteredFlairs.map((flair) => {
              const isSelected = selectedFlair === flair;
              const colors = getFlairColor(flair);

              return (
                <TouchableOpacity
                  key={flair}
                  onPress={() => handleFlairClick(flair)}
                  className="flex-row items-center py-2 active:bg-gray-50 rounded"
                >
                  {/* Radio Button */}
                  <View
                    className="w-5 h-5 rounded-full border-2 items-center justify-center mr-3"
                    style={{
                      borderColor: isSelected ? '#3B82F6' : '#D1D5DB',
                    }}
                  >
                    {isSelected && <View className="w-3 h-3 bg-blue-500 rounded-full" />}
                  </View>

                  {/* Flair Badge */}
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  >
                    <Text className="text-sm font-medium" style={{ color: colors.text }}>
                      {flair}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
