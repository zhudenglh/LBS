// Stats Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize } from '@constants/theme';

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.statItem} onPress={onPostsPress} disabled={!onPostsPress}>
        <Text style={styles.statValue}>{posts}</Text>
        <Text style={styles.statLabel}>{t('profile.posts')}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem} onPress={onLikesPress} disabled={!onLikesPress}>
        <Text style={styles.statValue}>{likes}</Text>
        <Text style={styles.statLabel}>{t('profile.likes')}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem} onPress={onCollectsPress} disabled={!onCollectsPress}>
        <Text style={styles.statValue}>{collects}</Text>
        <Text style={styles.statLabel}>{t('profile.collects')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
});
