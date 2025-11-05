// Discover Screen - Updated with animations

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import PostList from '../components/posts/PostList';
import PublishDialog from '../components/posts/PublishDialog';
import { useUser } from '@contexts/UserContext';
import { getPosts, likePost, unlikePost } from '@api/posts';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';
import { animations } from '@utils/animations';
import type { Post } from '@types';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const { userId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [publishDialogVisible, setPublishDialogVisible] = useState(false);

  // Animation for FAB
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getPosts({ userId });
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }

  async function handleLike(postId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        await likePost(postId, userId);
      } else {
        await unlikePost(postId, userId);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  }

  function handlePublishSuccess() {
    loadPosts();
  }

  function handleFabPress() {
    // Animate FAB on press
    Animated.sequence([
      animations.scale(scaleAnim, 0.9, 100),
      animations.scale(scaleAnim, 1, 100),
    ]).start();

    setPublishDialogVisible(true);
  }

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <PostList
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLike={handleLike}
      />

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [{ scale: scaleAnim }, { rotate: spin }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={handleFabPress}
          activeOpacity={0.9}
        >
          <Text style={styles.fabIcon}>✏️</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Publish Dialog */}
      <PublishDialog
        visible={publishDialogVisible}
        onClose={() => setPublishDialogVisible(false)}
        onSuccess={handlePublishSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
  },
  fabIcon: {
    fontSize: 24,
  },
});
