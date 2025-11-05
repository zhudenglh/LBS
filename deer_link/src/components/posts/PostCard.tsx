// Post Card Component

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/Avatar';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';
import { formatTimeAgo, getTimeValue } from '@utils/time';
import type { Post } from '@types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - spacing.lg * 3) / 3;

export default function PostCard({ post, onLike, onPress }: PostCardProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const images = post.image_urls ? post.image_urls.split(',').filter(Boolean) : [];

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    onLike(post.post_id, newIsLiked);
  };

  const timeKey = formatTimeAgo(post.timestamp);
  const timeValue = getTimeValue(post.timestamp);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Avatar emoji={post.avatar} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.time}>
            {timeValue > 0 ? t(timeKey, { count: timeValue }) : t(timeKey)}
          </Text>
        </View>
        {post.bus_tag && <Text style={styles.busTag}>{post.bus_tag}</Text>}
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {post.content}
      </Text>

      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          {images.slice(0, 3).map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} resizeMode="cover" />
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>👍</Text>
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likeCount} {t('discover.post.like')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>
            {post.comments} {t('discover.post.comment')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  username: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  time: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  busTag: {
    fontSize: fontSize.sm,
    color: colors.primary,
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  content: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: borderRadius.md,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  likedIcon: {
    transform: [{ scale: 1.2 }],
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  likedText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
