// Bottom Navigation Bar - Reddit风格底部导航栏（居中红色发帖按钮）
import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import PlusIcon from '@components/common/PlusIcon';

interface SubredditBottomNavProps {
  onCreatePost: () => void;
}

export default function SubredditBottomNav({ onCreatePost }: SubredditBottomNavProps) {
  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200"
      style={{
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          },
          android: {
            elevation: 4,
          },
        }),
      }}
    >
      <View className="flex-row items-center justify-center h-16">
        <TouchableOpacity
          onPress={onCreatePost}
          className="w-14 h-14 bg-red-500 rounded-full items-center justify-center active:bg-red-600"
          style={{
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              },
              android: {
                elevation: 6,
              },
            }),
          }}
          activeOpacity={0.8}
        >
          <PlusIcon size={28} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
