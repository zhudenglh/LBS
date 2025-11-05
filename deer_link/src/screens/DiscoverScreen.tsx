// Discover Screen - Updated with animations

import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import PostList from '../components/posts/PostList';
import PublishDialog from '../components/posts/PublishDialog';
import { useUser } from '@contexts/UserContext';
import { getPosts, likePost, unlikePost } from '@api/posts';
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
    <View className="flex-1 bg-background">
      <PostList
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLike={handleLike}
      />

      {/* Floating Action Button */}
      <Animated.View
        className="absolute right-xl bottom-xl w-14 h-14 rounded-[28px] bg-primary ios:shadow-lg-rn android:elevation-[8]"
        style={{
          transform: [{ scale: scaleAnim }, { rotate: spin }],
        }}
      >
        <TouchableOpacity
          className="w-full h-full items-center justify-center rounded-[28px]"
          onPress={handleFabPress}
          activeOpacity={0.9}
        >
          <Text className="text-2xl">✏️</Text>
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
