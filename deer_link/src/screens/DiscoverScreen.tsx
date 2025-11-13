// Discover Screen - 南京公交社区

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PostList from '../components/posts/PostList';
import TagFilterBar from '../components/community/TagFilterBar';
import FilterBanner from '../components/community/FilterBanner';
import { useUser } from '@contexts/UserContext';
import { getPosts, likePost, unlikePost } from '@api/posts';
import type { Post } from '@types';

export default function DiscoverScreen() {
  const { t } = useTranslation();
  const { userId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  function handleFlairClick(flair: string) {
    setSelectedTag(flair);
  }

  function handleClearFilter() {
    setSelectedTag(null);
  }

  // Filter posts based on selected tag
  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return posts;
    }
    return posts.filter((post) => post.bus_tag === selectedTag);
  }, [posts, selectedTag]);

  return (
    <View className="flex-1 bg-background">
      {/* Tag Filter Bar */}
      <TagFilterBar selectedTag={selectedTag} onTagChange={setSelectedTag} />

      {/* Filter Banner (shown when filtering) */}
      {selectedTag && (
        <FilterBanner
          selectedTag={selectedTag}
          postCount={filteredPosts.length}
          onClear={handleClearFilter}
        />
      )}

      {/* Post List */}
      <PostList
        posts={filteredPosts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onLike={handleLike}
        onFlairClick={handleFlairClick}
      />
    </View>
  );
}
