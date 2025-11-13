// Post List Component

import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import PostCard from './PostCard';
import { colors } from '@constants/theme';
import type { Post } from '@types';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLike: (postId: string, isLiked: boolean) => void;
  onPostPress?: (postId: string) => void;
  onEndReached?: () => void;
  onFlairClick?: (flair: string) => void;
}

export default function PostList({
  posts,
  loading = false,
  refreshing = false,
  onRefresh,
  onLike,
  onPostPress,
  onEndReached,
  onFlairClick,
}: PostListProps) {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onLike={onLike}
          onPress={onPostPress ? () => onPostPress(item.post_id) : undefined}
          onFlairClick={onFlairClick}
        />
      )}
      keyExtractor={(item) => item.post_id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}
