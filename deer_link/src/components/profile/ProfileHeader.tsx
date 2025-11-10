// Profile Header Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Avatar emoji={avatar} size={80} />

      <Text style={styles.nickname}>{nickname}</Text>

      <Text style={styles.userId}>ID: {userId.slice(0, 8)}</Text>

      {onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editIcon}>✏️</Text>
          <Text style={styles.editText}>{t('profile.edit_profile')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 12,
  },
  userId: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  editIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  editText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
});
