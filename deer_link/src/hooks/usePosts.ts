// usePosts Hook - Post CRUD Operations

import { useState, useEffect, useCallback } from 'react';
import { getPosts, likePost, unlikePost, createPost } from '@api/posts';
import { useUser } from '@contexts/UserContext';
import type { Post, CreatePostRequest } from '@types';

export function usePosts() {
  const { userId, nickname, avatar } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts({ userId });
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const refreshPosts = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await getPosts({ userId });
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh posts');
      console.error('Failed to refresh posts:', err);
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const toggleLike = useCallback(async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await likePost(postId, userId);
      } else {
        await unlikePost(postId, userId);
      }

      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes + 1 : post.likes - 1,
                is_liked: isLiked,
              }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                is_liked: !isLiked,
              }
            : post
        )
      );
    }
  }, [userId]);

  const publishPost = useCallback(async (data: Omit<CreatePostRequest, 'userId' | 'username' | 'avatar'>) => {
    try {
      await createPost({
        ...data,
        userId,
        username: nickname,
        avatar,
      });
      await loadPosts();
    } catch (err) {
      console.error('Failed to publish post:', err);
      throw err;
    }
  }, [userId, nickname, avatar, loadPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    refreshing,
    error,
    loadPosts,
    refreshPosts,
    toggleLike,
    publishPost,
  };
}
