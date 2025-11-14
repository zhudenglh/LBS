// Profile Header Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/Avatar';

interface ProfileHeaderProps {
  avatar: string;
  nickname: string;
  userId: string;
  onEditPress?: () => void;
}

export default function ProfileHeader({ avatar, nickname, userId, onEditPress }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <View className="items-center p-6 bg-white">
      <Avatar uri={avatar} size={80} />

      <Text className="text-xl font-bold text-[#333333] mt-3">{nickname}</Text>

      <Text className="text-sm text-[#666666] mt-1">ID: {userId.slice(0, 8)}</Text>

      {onEditPress && (
        <TouchableOpacity className="flex-row items-center mt-4 px-4 py-2 bg-[#F5F5F5] rounded-full" onPress={onEditPress}>
          <Text className="text-base mr-1">✏️</Text>
          <Text className="text-sm text-[#333333] font-semibold">{t('profile.edit_profile')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
