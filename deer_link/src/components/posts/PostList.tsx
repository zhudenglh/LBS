// Post List Component

import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View } from 'react-native';
import PostCard from './PostCard';
import type { Post } from '@types';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLike: (postId: string, isLiked: boolean) => void;
  onPostPress?: (postId: string) => void;
  onEndReached?: () => void;
}

export default function PostList({
  posts,
  loading = false,
  refreshing = false,
  onRefresh,
  onLike,
  onPostPress,
  onEndReached,
}: PostListProps) {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0285f0" />
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
        />
      )}
      keyExtractor={(item) => item.post_id}
      contentContainerClassName="p-lg"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0285f0']} />
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
