// Post Card Component

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/Avatar';
import { colors } from '@constants/theme';
import { formatTimeAgo, getTimeValue } from '@utils/time';
import type { Post } from '@types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onPress?: () => void;
  onFlairClick?: (flair: string) => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 16 * 3) / 3;

export default function PostCard({ post, onLike, onPress, onFlairClick }: PostCardProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  // 处理 image_urls 可能是数组或字符串的情况
  const images = Array.isArray(post.image_urls)
    ? post.image_urls
    : post.image_urls
    ? post.image_urls.split(',').filter(Boolean)
    : [];

  if (images.length > 0) {
    console.log('[PostCard] Post', post.post_id, 'has images:', images);
  }

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    onLike(post.post_id, newIsLiked);
  };

  const handleFlairClick = () => {
    if (onFlairClick && post.bus_tag) {
      onFlairClick(post.bus_tag);
    }
  };

  const timeKey = formatTimeAgo(post.timestamp);
  const timeValue = getTimeValue(post.timestamp);

  return (
    <TouchableOpacity className="bg-white p-4 mb-3 shadow-md" onPress={onPress} activeOpacity={0.9}>
      <View className="flex-row items-center mb-3">
        <Avatar uri={post.avatar} size={40} />
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-text-primary">{post.username}</Text>
          <Text className="text-sm text-text-secondary mt-[2px]">
            {timeValue > 0 ? t(timeKey, { count: timeValue }) : t(timeKey)}
          </Text>
        </View>
        {post.bus_tag && (
          <TouchableOpacity
            onPress={handleFlairClick}
            activeOpacity={0.7}
            className="px-2 py-[2px] rounded-sm"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Text
              className="text-sm"
              style={{ color: colors.primary }}
            >
              {post.bus_tag}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-lg font-semibold text-text-primary mb-2">{post.title}</Text>
      <Text className="text-base text-text-secondary leading-5 mb-3" numberOfLines={3}>
        {post.content}
      </Text>

      {images.length > 0 && (
        <View className="flex-row mb-3 gap-2">
          {images.slice(0, 3).map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              className="rounded-md"
              style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View className="flex-row pt-3 border-t border-border">
        <TouchableOpacity className="flex-row items-center mr-6" onPress={handleLike}>
          <Text
            className={`text-base mr-1 ${isLiked ? 'scale-120' : ''}`}
            style={isLiked ? { transform: [{ scale: 1.2 }] } : {}}
          >
            👍
          </Text>
          <Text className={`text-sm ${isLiked ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
            {likeCount} {t('discover.post.like')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mr-6">
          <Text className="text-base mr-1">💬</Text>
          <Text className="text-sm text-text-secondary">
            {post.comments} {t('discover.post.comment')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
