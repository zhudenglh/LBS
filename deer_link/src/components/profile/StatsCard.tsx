// Stats Card Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface StatsCardProps {
  posts: number;
  likes: number;
  collects: number;
  onPostsPress?: () => void;
  onLikesPress?: () => void;
  onCollectsPress?: () => void;
}

export default function StatsCard({
  posts,
  likes,
  collects,
  onPostsPress,
  onLikesPress,
  onCollectsPress,
}: StatsCardProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row bg-white py-4">
      <TouchableOpacity className="flex-1 items-center" onPress={onPostsPress} disabled={!onPostsPress}>
        <Text className="text-2xl font-bold text-[#333333] mb-1">{posts}</Text>
        <Text className="text-sm text-[#666666]">{t('profile.posts')}</Text>
      </TouchableOpacity>

      <View className="w-[1px] bg-[#E5E5E5]" />

      <TouchableOpacity className="flex-1 items-center" onPress={onLikesPress} disabled={!onLikesPress}>
        <Text className="text-2xl font-bold text-[#333333] mb-1">{likes}</Text>
        <Text className="text-sm text-[#666666]">{t('profile.likes')}</Text>
      </TouchableOpacity>

      <View className="w-[1px] bg-[#E5E5E5]" />

      <TouchableOpacity className="flex-1 items-center" onPress={onCollectsPress} disabled={!onCollectsPress}>
        <Text className="text-2xl font-bold text-[#333333] mb-1">{collects}</Text>
        <Text className="text-sm text-[#666666]">{t('profile.collects')}</Text>
      </TouchableOpacity>
    </View>
  );
}
