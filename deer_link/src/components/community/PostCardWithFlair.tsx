import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import UpvoteIcon from '@components/common/UpvoteIcon';
import DownvoteIcon from '@components/common/DownvoteIcon';
import ShareIcon from '@components/common/ShareIcon';
import Avatar from '@components/common/Avatar';

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
  id,
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

  // 验证URL是否有效（用于帖子图片）
  const isValidUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const validImageUrl = isValidUrl(imageUrl) ? imageUrl : undefined;

  // 调试日志
  if (imageUrl) {
    console.log('[PostCardWithFlair]', id, 'imageUrl prop:', imageUrl, 'isValid:', isValidUrl(imageUrl), 'validImageUrl:', validImageUrl);
  }

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
      className="bg-white rounded-lg mb-3 shadow-sm"
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          {isUserMode ? (
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => userName && onUserClick?.(userName)}
              activeOpacity={0.7}
            >
              <Avatar uri={userAvatar} size={28} />
              <Text className="text-xs text-text-secondary">{userName}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="flex-row items-center gap-2"
              onPress={() => subreddit && onSubredditClick?.(subreddit)}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri: subreddit ? (CATEGORY_AVATARS[subreddit] || 'https://via.placeholder.com/28') : 'https://via.placeholder.com/28',
                }}
                className="w-7 h-7 rounded-full bg-background"
              />
              <Text className="text-xs text-text-secondary">圈/{subreddit}</Text>
            </TouchableOpacity>
          )}

          <View className="w-[3px] h-[3px] rounded-full bg-text-disabled mx-2" />
          <Text className="text-xs text-text-disabled">{timeAgo}</Text>

          {!isJoined && (
            <TouchableOpacity className="ml-auto px-3 py-1 bg-primary rounded-full" activeOpacity={0.7}>
              <Text className="text-xs text-white font-medium">加入</Text>
            </TouchableOpacity>
          )}

          {isJoined && (
            <TouchableOpacity className="ml-auto p-1" activeOpacity={0.7}>
              <Text className="text-base text-text-secondary">⋮</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text className="text-base leading-[22px] text-text-primary mb-2" numberOfLines={3}>
          {title}
        </Text>

        {/* Flair */}
        {flair && (
          <TouchableOpacity
            className="self-start px-[10px] py-1 rounded-full mb-3"
            style={{ backgroundColor: getFlairColor(flair) }}
            onPress={handleFlairPress}
            activeOpacity={0.8}
          >
            <Text className="text-xs text-white font-medium">{flair}</Text>
          </TouchableOpacity>
        )}

        {/* Image */}
        {validImageUrl && (
          <Image
            source={{ uri: validImageUrl }}
            className="w-full h-48 rounded-md mb-3 -mx-4 bg-background"
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
                color={localUpvoted ? '#FF4500' : '#666666'}
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
                color={localDownvoted ? '#0079D3' : '#666666'}
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

          {/* Awards */}
          {awards && awards > 0 && (
            <TouchableOpacity className="flex-row items-center px-3 py-2 rounded-[20px] mr-2" activeOpacity={0.7}>
              <Text className="text-base mr-1 text-[#FF6B35]">🎁</Text>
              <Text className="text-sm text-text-secondary">{awards}</Text>
            </TouchableOpacity>
          )}

          {/* Share */}
          <TouchableOpacity
            className="flex-row items-center px-3 py-2 rounded-[20px] ml-auto"
            onPress={onShare}
            activeOpacity={0.7}
          >
            <ShareIcon size={18} color="#666666" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
