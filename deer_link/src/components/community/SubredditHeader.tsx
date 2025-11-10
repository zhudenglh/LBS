import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButtonIcon from '@components/common/BackButtonIcon';

interface SubredditHeaderProps {
  name: string;
  members: string;
  avatarUrl?: string;
  bannerUrl?: string;
  isJoined?: boolean;
  weeklyVisitors?: string;
  weeklyContributors?: string;
  description?: string;
  ranking?: string;
  onBack?: () => void;
  onJoinToggle?: () => void;
  onNotifications?: () => void;
}

export default function SubredditHeader({
  name,
  members,
  avatarUrl,
  bannerUrl,
  isJoined = false,
  weeklyVisitors = '近3万5千访客',
  weeklyContributors = '近4千1百贡献',
  description = '搭载移动城市智能体，是能聊路线、拼生活、寻同路人的暖心城市出行社区',
  ranking = '#7 in 出行',
  onBack,
  onJoinToggle,
  onNotifications,
}: SubredditHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white">
      {/* Banner Image */}
      <View className="h-24 relative">
        {bannerUrl ? (
          <Image
            source={{ uri: bannerUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-[#FB923C]" />
        )}

        {/* Icon Buttons Overlay */}
        <View className="absolute bottom-1 left-0 right-0 flex-row justify-between px-3">
          {/* Back Button */}
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
          >
            <BackButtonIcon size={40} />
          </TouchableOpacity>

          {/* Right Buttons */}
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-[rgba(0,0,0,0.5)] items-center justify-center" activeOpacity={0.7}>
              <Text className="text-white text-xl">🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-[rgba(0,0,0,0.5)] items-center justify-center" activeOpacity={0.7}>
              <Text className="text-white text-xl">🔗</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-[rgba(0,0,0,0.5)] items-center justify-center" activeOpacity={0.7}>
              <Text className="text-white text-xl">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Subreddit Info */}
      <View className="px-4 pb-3">
        {/* Main Row: Avatar + Name + Join Button */}
        <View className="flex-row items-start justify-between mt-3 mb-2">
          {/* Left: Avatar + Name + Stats */}
          <View className="flex-row items-start flex-1 gap-3">
            {/* Avatar */}
            <Image
              source={{
                uri:
                  avatarUrl ||
                  'https://images.unsplash.com/photo-1756723701257-46513cd36fc1?w=200',
              }}
              className="w-14 h-14 rounded-full border-2 border-white bg-white"
            />

            {/* Name and Stats */}
            <View className="flex-1">
              <Text className="text-lg font-medium text-text-primary mb-1">圈/{name}</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-xs text-text-secondary">{weeklyVisitors}</Text>
                <Text className="text-xs text-text-disabled">•</Text>
                <Text className="text-xs text-text-secondary">{weeklyContributors}</Text>
              </View>
            </View>
          </View>

          {/* Right: Join Button + Bell */}
          <View className="flex-row items-start gap-2">
            {isJoined ? (
              <>
                <TouchableOpacity
                  className="border border-primary px-3 py-2 rounded-full"
                  onPress={onJoinToggle}
                  activeOpacity={0.7}
                >
                  <Text className="text-primary text-xs font-medium">已加入</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2"
                  onPress={onNotifications}
                  activeOpacity={0.7}
                >
                  <Text className="text-base">🔔</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                className="bg-primary px-3 py-2 rounded-full"
                onPress={onJoinToggle}
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-medium">加入</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Separator */}
        <View className="h-[1px] bg-border my-3" />

        {/* Description */}
        <Text className="text-sm text-text-secondary leading-5 mb-3">{description}</Text>

        {/* View More + Ranking */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="flex-row items-center gap-1" activeOpacity={0.7}>
            <Text className="text-sm text-primary">查看更多内容</Text>
            <Text className="text-lg text-primary">›</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm">📈</Text>
            <Text className="text-sm text-text-secondary">{ranking}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
