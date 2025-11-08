// Post List Component

import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from 'react-native';
import PostCard from './PostCard';
import { colors, spacing } from '@constants/theme';
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
      <View style={styles.loadingContainer}>
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
        />
      )}
      keyExtractor={(item) => item.post_id}
      contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
});
