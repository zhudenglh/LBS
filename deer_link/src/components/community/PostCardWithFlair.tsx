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
import UpvoteIcon from '@components/common/UpvoteIcon';
import DownvoteIcon from '@components/common/DownvoteIcon';
import ShareIcon from '@components/common/ShareIcon';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

const { width } = Dimensions.get('window');

// 分类头像映射 - 来自Figma设计
const CATEGORY_AVATARS: Record<string, string> = {
  '科技': 'https://images.unsplash.com/photo-1760842543713-108c3cadbba1?w=200',
  '旅游': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200',
  '美食': 'https://images.unsplash.com/photo-1661712963154-91081d8ddc43?w=200',
  '游戏': 'https://images.unsplash.com/photo-1611138290962-2c550ffd4002?w=200',
  '科学': 'https://images.unsplash.com/photo-1634872583967-6417a8638a59?w=200',
  '音乐': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200',
  '南京公交': 'https://images.unsplash.com/photo-1756723701257-46513cd36fc1?w=200',
  '南京': 'https://images.unsplash.com/photo-1593930491857-b0b9be2ded45?w=200',
  '健身': 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=200',
  '萌宠': 'https://images.unsplash.com/photo-1670665352766-400cebbd5575?w=200',
  '数码': 'https://images.unsplash.com/photo-1611138290962-2c550ffd4002?w=200',
  '读书': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200',
  '电影': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200',
  '学习': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200',
  '汽车': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200',
  '家居': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=200',
  '育儿': 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=200',
  '娱乐': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=200',
};

interface PostCardWithFlairProps {
  id: string;
  subreddit?: string;
  userName?: string;
  userAvatar?: string;
  timeAgo: string;
  title: string;
  imageUrl?: string;
  upvotes: number;
  downvotes?: number;
  comments: number;
  awards?: number;
  flair?: string;
  isJoined?: boolean;
  onPress?: () => void;
  onSubredditClick?: (subreddit: string) => void;
  onUserClick?: (userName: string) => void;
  onFlairClick?: (flair: string) => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
}

// Flair 颜色映射
function getFlairColor(flair: string): string {
  // 地铁线路（s开头）
  if (flair.startsWith('s') || flair.startsWith('S')) {
    return '#A855F7'; // purple-500
  }
  // 轮渡线路
  else if (flair.includes('轮渡')) {
    return '#06B6D4'; // cyan-500
  }
  // 夜间公交（y开头）
  else if (flair.startsWith('y') || flair.startsWith('Y')) {
    return '#6366F1'; // indigo-500
  }
  // 普通公交（多色系统）
  else {
    const flairColors = [
      '#3B82F6', // blue-500
      '#10B981', // green-500
      '#F97316', // orange-500
      '#EF4444', // red-500
      '#EC4899', // pink-500
      '#14B8A6', // teal-500
    ];
    const hash = flair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return flairColors[hash % flairColors.length];
  }
}

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export default function PostCardWithFlair({
  subreddit,
  userName,
  userAvatar,
  timeAgo,
  title,
  imageUrl,
  upvotes,
  comments,
  awards,
  flair,
  isJoined = false,
  onPress,
  onSubredditClick,
  onUserClick,
  onFlairClick,
  onUpvote,
  onDownvote,
  onComment,
  onShare,
  isUpvoted = false,
  isDownvoted = false,
}: PostCardWithFlairProps) {
  const { t } = useTranslation();
  const [localUpvoted, setLocalUpvoted] = useState(isUpvoted);
  const [localDownvoted, setLocalDownvoted] = useState(isDownvoted);

  const isUserMode = !!userName;

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

  function handleFlairPress() {
    if (flair && onFlairClick) {
      onFlairClick(flair);
    }
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
          {isUserMode ? (
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => userName && onUserClick?.(userName)}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri:
                    userAvatar ||
                    'https://via.placeholder.com/28',
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{userName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => subreddit && onSubredditClick?.(subreddit)}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri: subreddit ? (CATEGORY_AVATARS[subreddit] || 'https://via.placeholder.com/28') : 'https://via.placeholder.com/28',
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>圈/{subreddit}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.dot} />
          <Text style={styles.timeAgo}>{timeAgo}</Text>

          {!isJoined && (
            <TouchableOpacity style={styles.joinButton} activeOpacity={0.7}>
              <Text style={styles.joinButtonText}>加入</Text>
            </TouchableOpacity>
          )}

          {isJoined && (
            <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
              <Text style={styles.moreIcon}>⋮</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>

        {/* Flair */}
        {flair && (
          <TouchableOpacity
            style={[
              styles.flairBadge,
              { backgroundColor: getFlairColor(flair) },
            ]}
            onPress={handleFlairPress}
            activeOpacity={0.8}
          >
            <Text style={styles.flairText}>{flair}</Text>
          </TouchableOpacity>
        )}

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
                color={localUpvoted ? '#FF4500' : colors.text.secondary}
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
                color={localDownvoted ? '#0079D3' : colors.text.secondary}
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

          {/* Awards */}
          {awards && awards > 0 && (
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Text style={styles.awardIcon}>🎁</Text>
              <Text style={styles.actionText}>{awards}</Text>
            </TouchableOpacity>
          )}

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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  userName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.text.disabled,
    marginHorizontal: spacing.sm,
  },
  timeAgo: {
    fontSize: fontSize.xs,
    color: colors.text.disabled,
  },
  joinButton: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
  },
  joinButtonText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '500',
  },
  moreButton: {
    marginLeft: 'auto',
    padding: spacing.xs,
  },
  moreIcon: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  title: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  flairBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.round,
    marginBottom: spacing.md,
  },
  flairText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: '500',
  },
  image: {
    width: '100%',
    height: 192,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    marginHorizontal: -spacing.lg,
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
  awardIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
    color: '#FF6B35',
  },
  actionText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
