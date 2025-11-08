// Waterfall Post Card Component - Dual Column Layout

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import Avatar from '../../common/Avatar';
import { WATERFALL_CONFIG } from '@constants/community';
import type { CommunityPost } from '@types';

interface WaterfallPostCardProps {
  post: CommunityPost;
  onPress?: () => void;
  onLike: (postId: string, isLiked: boolean) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH =
  (width - WATERFALL_CONFIG.HORIZONTAL_PADDING * 2 - WATERFALL_CONFIG.COLUMN_GAP) / 2;

export default function WaterfallPostCard({
  post,
  onPress,
  onLike,
}: WaterfallPostCardProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const images = post.image_urls ? post.image_urls.split(',').filter(Boolean) : [];
  const coverImage = images[0];

  // Calculate image height based on aspect ratio
  const getImageHeight = () => {
    // Default to 3:4 ratio if no image
    if (!coverImage) return CARD_WIDTH * 1.33;
    return CARD_WIDTH * 1.33; // Maintain consistent height for better layout
  };

  const handleLike = (e: any) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    onLike(post.post_id, newIsLiked);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{ width: CARD_WIDTH, marginBottom: WATERFALL_CONFIG.CARD_GAP }}
      className="bg-white rounded-lg overflow-hidden ios:shadow-md-rn android:elevation-[2]"
    >
      {/* Cover Image */}
      {coverImage && (
        <FastImage
          source={{ uri: coverImage, priority: FastImage.priority.normal }}
          style={{
            width: CARD_WIDTH,
            height: getImageHeight(),
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {/* Content Section */}
      <View className="p-sm">
        {/* Title */}
        <Text
          className="text-sm font-semibold text-text-primary mb-xs leading-5"
          numberOfLines={2}
        >
          {post.title}
        </Text>

        {/* Content Preview */}
        {post.content && (
          <Text
            className="text-xs text-text-secondary leading-4 mb-sm"
            numberOfLines={2}
          >
            {post.content}
          </Text>
        )}

        {/* Bottom Info Bar */}
        <View className="flex-row items-center justify-between mt-xs">
          {/* Author */}
          <View className="flex-row items-center flex-1">
            <Avatar emoji={post.avatar} size={20} />
            <Text className="text-xs text-text-secondary ml-xs flex-1" numberOfLines={1}>
              {post.username}
            </Text>
          </View>

          {/* Like Button */}
          <TouchableOpacity
            onPress={handleLike}
            className="flex-row items-center ml-sm"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className={`text-sm ${isLiked ? 'scale-110' : ''}`}>
              {isLiked ? '❤️' : '🤍'}
            </Text>
            {likeCount > 0 && (
              <Text
                className={`text-xs ml-0.5 ${
                  isLiked ? 'text-primary font-semibold' : 'text-text-secondary'
                }`}
              >
                {likeCount > 999 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bus Tag */}
        {post.bus_tag && (
          <View className="mt-sm">
            <Text className="text-xs text-primary bg-primary/20 px-sm py-0.5 rounded-sm self-start">
              {post.bus_tag}
            </Text>
          </View>
        )}

        {/* Featured Badge */}
        {post.is_featured && (
          <View className="absolute top-sm right-sm">
            <View className="bg-[#FF5722] px-xs py-0.5 rounded-sm">
              <Text className="text-xs text-white font-semibold">
                {t('community.post.featured')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
