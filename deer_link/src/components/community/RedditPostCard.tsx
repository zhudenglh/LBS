import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FlairBadge from './FlairBadge';
import UpvoteIcon from '@components/common/UpvoteIcon';
import DownvoteIcon from '@components/common/DownvoteIcon';
import ShareIcon from '@components/common/ShareIcon';
import { colors } from '@constants/theme';

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
      className="bg-white rounded-lg mb-3 shadow-sm"
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <FlairBadge text={subreddit} variant={variant} />
          <View className="w-[3px] h-[3px] rounded-[1.5px] bg-text-disabled mx-2" />
          <Text className="text-sm text-text-disabled">{timeAgo}</Text>
        </View>

        {/* Title */}
        <Text className="text-base leading-[22px] text-text-primary mb-3" numberOfLines={3}>
          {title}
        </Text>

        {/* Image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            className="h-48 rounded-md mb-3 bg-background"
            style={{ width: width - 32 - 32 }}
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View className="flex-row items-center">
          {/* Upvote/Downvote */}
          <View className="flex-row items-center bg-background rounded-[20px] px-3 py-2 mr-3">
            <TouchableOpacity
              className="p-1"
              onPress={handleUpvote}
              activeOpacity={0.7}
            >
              <UpvoteIcon
                size={18}
                color={localUpvoted ? '#FF6B35' : colors.text.secondary}
                filled={localUpvoted}
              />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-text-primary mx-1">{formatNumber(upvotes)}</Text>
            <TouchableOpacity
              className="p-1"
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
            className="flex-row items-center px-3 py-2 rounded-[20px] mr-2"
            onPress={onComment}
            activeOpacity={0.7}
          >
            <Text className="text-base mr-1">💬</Text>
            <Text className="text-sm text-text-secondary">{comments}</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            className="flex-row items-center px-3 py-2 rounded-[20px] ml-auto"
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
