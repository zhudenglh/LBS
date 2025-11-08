// Waterfall Grid Component - Masonry Layout

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import WaterfallPostCard from './WaterfallPostCard';
import WaterfallSkeleton from './WaterfallSkeleton';
import { WATERFALL_CONFIG } from '@constants/community';
import type { CommunityPost } from '@types';

interface WaterfallGridProps {
  posts: CommunityPost[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  onPostPress?: (postId: string) => void;
  onLike: (postId: string, isLiked: boolean) => void;
}

export default function WaterfallGrid({
  posts,
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  onPostPress,
  onLike,
}: WaterfallGridProps) {
  const [leftColumn, setLeftColumn] = useState<CommunityPost[]>([]);
  const [rightColumn, setRightColumn] = useState<CommunityPost[]>([]);
  const [leftColumnHeight, setLeftColumnHeight] = useState(0);
  const [rightColumnHeight, setRightColumnHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Split posts into two columns for waterfall layout
  useEffect(() => {
    if (posts.length === 0) {
      setLeftColumn([]);
      setRightColumn([]);
      setLeftColumnHeight(0);
      setRightColumnHeight(0);
      return;
    }

    const left: CommunityPost[] = [];
    const right: CommunityPost[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    posts.forEach((post) => {
      // Estimate card height based on content
      const cardHeight = estimateCardHeight(post);

      // Add to shorter column
      if (leftHeight <= rightHeight) {
        left.push(post);
        leftHeight += cardHeight;
      } else {
        right.push(post);
        rightHeight += cardHeight;
      }
    });

    setLeftColumn(left);
    setRightColumn(right);
    setLeftColumnHeight(leftHeight);
    setRightColumnHeight(rightHeight);
  }, [posts]);

  // Estimate card height for waterfall layout
  const estimateCardHeight = (post: CommunityPost): number => {
    const { width } = Dimensions.get('window');
    const cardWidth =
      (width -
        WATERFALL_CONFIG.HORIZONTAL_PADDING * 2 -
        WATERFALL_CONFIG.COLUMN_GAP) /
      2;

    // Image height (3:4 ratio)
    const imageHeight = cardWidth * 1.33;

    // Title height (14px font, 2 lines max, 20px line height)
    const titleHeight = 40;

    // Content preview height (12px font, 2 lines max, 16px line height)
    const contentHeight = post.content ? 32 : 0;

    // Author + like bar height
    const bottomBarHeight = 24;

    // Bus tag height
    const busTagHeight = post.bus_tag ? 20 : 0;

    // Padding (8px * 2)
    const padding = 16;

    return (
      imageHeight +
      titleHeight +
      contentHeight +
      bottomBarHeight +
      busTagHeight +
      padding +
      WATERFALL_CONFIG.CARD_GAP
    );
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const paddingToBottom = 100;

    if (
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - paddingToBottom
    ) {
      onEndReached?.();
    }
  };

  if (loading && posts.length === 0) {
    return <WaterfallSkeleton />;
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0285f0']}
            tintColor="#0285f0"
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: WATERFALL_CONFIG.HORIZONTAL_PADDING,
        paddingTop: WATERFALL_CONFIG.CARD_GAP,
        paddingBottom: 80, // Extra padding for FAB
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: WATERFALL_CONFIG.COLUMN_GAP,
        }}
      >
        {/* Left Column */}
        <View style={{ flex: 1 }}>
          {leftColumn.map((post) => (
            <WaterfallPostCard
              key={post.post_id}
              post={post}
              onPress={() => onPostPress?.(post.post_id)}
              onLike={onLike}
            />
          ))}
        </View>

        {/* Right Column */}
        <View style={{ flex: 1 }}>
          {rightColumn.map((post) => (
            <WaterfallPostCard
              key={post.post_id}
              post={post}
              onPress={() => onPostPress?.(post.post_id)}
              onLike={onLike}
            />
          ))}
        </View>
      </View>

      {/* Loading More Indicator */}
      {loading && posts.length > 0 && (
        <View className="py-lg items-center">
          <ActivityIndicator size="small" color="#0285f0" />
        </View>
      )}
    </ScrollView>
  );
}
