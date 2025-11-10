// Stats Card Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.statItem} onPress={onPostsPress} disabled={!onPostsPress}>
        <Text style={styles.statNumber}>{posts}</Text>
        <Text style={styles.statLabel}>{t('profile.posts')}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem} onPress={onLikesPress} disabled={!onLikesPress}>
        <Text style={styles.statNumber}>{likes}</Text>
        <Text style={styles.statLabel}>{t('profile.likes')}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.statItem} onPress={onCollectsPress} disabled={!onCollectsPress}>
        <Text style={styles.statNumber}>{collects}</Text>
        <Text style={styles.statLabel}>{t('profile.collects')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
});
