// Profile Header Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/Avatar';
import { colors, spacing, fontSize } from '@constants/theme';

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
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  nickname: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  userId: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  editIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  editText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
