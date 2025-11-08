// Waterfall Skeleton Component - Loading State

import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { WATERFALL_CONFIG, SKELETON_CONFIG } from '@constants/community';

const { width } = Dimensions.get('window');
const CARD_WIDTH =
  (width - WATERFALL_CONFIG.HORIZONTAL_PADDING * 2 - WATERFALL_CONFIG.COLUMN_GAP) / 2;

export default function WaterfallSkeleton() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: SKELETON_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: SKELETON_CONFIG.ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderSkeletonCard = (height: number) => (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        height,
        backgroundColor: SKELETON_CONFIG.BASE_COLOR,
        borderRadius: WATERFALL_CONFIG.CARD_BORDER_RADIUS,
        marginBottom: WATERFALL_CONFIG.CARD_GAP,
        opacity: shimmerOpacity,
      }}
    >
      <View style={{ padding: 8 }}>
        {/* Image placeholder */}
        <View
          style={{
            width: CARD_WIDTH - 16,
            height: (CARD_WIDTH - 16) * 1.33,
            backgroundColor: SKELETON_CONFIG.HIGHLIGHT_COLOR,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />

        {/* Title placeholder */}
        <View
          style={{
            width: '80%',
            height: 14,
            backgroundColor: SKELETON_CONFIG.HIGHLIGHT_COLOR,
            borderRadius: 4,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            width: '60%',
            height: 14,
            backgroundColor: SKELETON_CONFIG.HIGHLIGHT_COLOR,
            borderRadius: 4,
            marginBottom: 8,
          }}
        />

        {/* Author placeholder */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: SKELETON_CONFIG.HIGHLIGHT_COLOR,
              marginRight: 8,
            }}
          />
          <View
            style={{
              width: 60,
              height: 12,
              backgroundColor: SKELETON_CONFIG.HIGHLIGHT_COLOR,
              borderRadius: 4,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );

  // Generate random heights for more realistic skeleton
  const cardHeights = [280, 320, 300, 290, 310, 330];

  return (
    <View
      style={{
        paddingHorizontal: WATERFALL_CONFIG.HORIZONTAL_PADDING,
        paddingTop: WATERFALL_CONFIG.CARD_GAP,
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
          {renderSkeletonCard(cardHeights[0])}
          {renderSkeletonCard(cardHeights[2])}
          {renderSkeletonCard(cardHeights[4])}
        </View>

        {/* Right Column */}
        <View style={{ flex: 1 }}>
          {renderSkeletonCard(cardHeights[1])}
          {renderSkeletonCard(cardHeights[3])}
          {renderSkeletonCard(cardHeights[5])}
        </View>
      </View>
    </View>
  );
}
