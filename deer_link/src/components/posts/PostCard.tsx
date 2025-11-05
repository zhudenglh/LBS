// Post Card Component

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import Avatar from '../common/Avatar';
import { formatTimeAgo, getTimeValue } from '@utils/time';
import type { Post } from '@types';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 16 * 3) / 3; // 16px = lg spacing

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
    <TouchableOpacity
      className="bg-white p-lg mb-md ios:shadow-md-rn android:elevation-[4]"
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View className="flex-row items-center mb-md">
        <Avatar emoji={post.avatar} size={40} />
        <View className="flex-1 ml-md">
          <Text className="text-base font-semibold text-text-primary">{post.username}</Text>
          <Text className="text-sm text-text-secondary mt-0.5">
            {timeValue > 0 ? t(timeKey, { count: timeValue }) : t(timeKey)}
          </Text>
        </View>
        {post.bus_tag && (
          <Text className="text-sm text-primary bg-primary/20 px-sm py-0.5 rounded-sm">
            {post.bus_tag}
          </Text>
        )}
      </View>

      <Text className="text-lg font-semibold text-text-primary mb-sm">{post.title}</Text>
      <Text className="text-base text-text-secondary leading-5 mb-md" numberOfLines={3}>
        {post.content}
      </Text>

      {images.length > 0 && (
        <View className="flex-row mb-md gap-sm">
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

      <View className="flex-row pt-md border-t border-border">
        <TouchableOpacity className="flex-row items-center mr-xl" onPress={handleLike}>
          <Text className={`text-base mr-xs ${isLiked ? 'scale-125' : ''}`}>👍</Text>
          <Text className={`text-sm ${isLiked ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
            {likeCount} {t('discover.post.like')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mr-xl">
          <Text className="text-base mr-xs">💬</Text>
          <Text className="text-sm text-text-secondary">
            {post.comments} {t('discover.post.comment')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
