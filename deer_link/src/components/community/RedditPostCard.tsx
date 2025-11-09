import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FlairBadge from './FlairBadge';
import UpvoteIcon from '@components/common/UpvoteIcon';
import DownvoteIcon from '@components/common/DownvoteIcon';
import ShareIcon from '@components/common/ShareIcon';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

const { width } = Dimensions.get('window');

interface RedditPostCardProps {
  id: string;
  subreddit: string;
  timeAgo: string;
  title: string;
  imageUrl?: string;
  upvotes: number;
  downvotes?: number;
  comments: number;
  onPress?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
}

// 分类颜色映射
const CATEGORY_VARIANTS: Record<string, any> = {
  '科技': 'tech',
  '旅游': 'travel',
  '美食': 'food',
  '游戏': 'gaming',
  '科学': 'science',
  '音乐': 'music',
};

// 格式化数字（1000 -> 1k）
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function RedditPostCard({
  subreddit,
  timeAgo,
  title,
  imageUrl,
  upvotes,
  downvotes = 0,
  comments,
  onPress,
  onUpvote,
  onDownvote,
  onComment,
  onShare,
  isUpvoted = false,
  isDownvoted = false,
}: RedditPostCardProps) {
  const { t } = useTranslation();
  const [localUpvoted, setLocalUpvoted] = useState(isUpvoted);
  const [localDownvoted, setLocalDownvoted] = useState(isDownvoted);

  const variant = CATEGORY_VARIANTS[subreddit] || 'default';

  function handleUpvote() {
    setLocalUpvoted(!localUpvoted);
    if (localDownvoted) {
      setLocalDownvoted(false);
    }
    onUpvote?.();
  }

  function handleDownvote() {
    setLocalDownvoted(!localDownvoted);
    if (localUpvoted) {
      setLocalUpvoted(false);
    }
    onDownvote?.();
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <FlairBadge text={subreddit} variant={variant} />
          <View style={styles.dot} />
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>

        {/* Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {/* Upvote/Downvote */}
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleUpvote}
              activeOpacity={0.7}
            >
              <UpvoteIcon
                size={18}
                color={localUpvoted ? '#FF6B35' : colors.text.secondary}
                filled={localUpvoted}
              />
            </TouchableOpacity>
            <Text style={styles.voteCount}>{formatNumber(upvotes)}</Text>
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleDownvote}
              activeOpacity={0.7}
            >
              <DownvoteIcon
                size={18}
                color={localDownvoted ? '#2196F3' : colors.text.secondary}
                filled={localDownvoted}
              />
            </TouchableOpacity>
          </View>

          {/* Comments */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onComment}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{comments}</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={onShare}
            activeOpacity={0.7}
          >
            <ShareIcon size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.disabled,
    marginHorizontal: spacing.sm,
  },
  timeAgo: {
    fontSize: fontSize.sm,
    color: colors.text.disabled,
  },
  title: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  image: {
    width: width - 32 - 32, // screen width - card padding - content padding
    height: 192,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
  },
  voteButton: {
    padding: spacing.xs,
  },
  voteCount: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
    marginHorizontal: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  shareButton: {
    marginLeft: 'auto',
  },
  actionIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
