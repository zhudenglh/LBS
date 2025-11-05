// My Posts Screen

import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PostList from '../components/posts/PostList';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useUser } from '@contexts/UserContext';
import { getPosts, likePost, unlikePost } from '@api/posts';
import type { Post } from '@types';

export default function MyPostsScreen() {
  const { t } = useTranslation();
  const { userId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMyPosts();
  }, []);

  async function loadMyPosts() {
    try {
      setLoading(true);
      const data = await getPosts({ userId });
      // Filter to only show user's own posts
      const myPosts = data.filter((post) => post.user_id === userId);
      setPosts(myPosts);
    } catch (error) {
      console.error('Failed to load my posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadMyPosts();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          icon="📝"
          title={t('profile.my_posts')}
          description="You haven't published any posts yet"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <PostList
        posts={posts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLike={handleLike}
      />
    </View>
  );
}
