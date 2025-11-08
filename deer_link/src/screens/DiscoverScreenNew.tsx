// Discover Screen - Community with Hybrid Layout

import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUser } from '@contexts/UserContext';
import { animations } from '@utils/animations';
import CommunityTabBar from '../components/community/CommunityTabBar';
import FilterBar from '../components/community/FilterBar';
import { WaterfallGrid } from '../components/community/waterfall';
import PublishDialog from '../components/posts/PublishDialog';
import WiFiScreen from './WiFiScreen';
import { getPosts, likePost, unlikePost } from '@api/posts';
import { CommunityTab, FilterType } from '@types';
import type { CommunityPost, Post } from '@types';

export default function DiscoverScreenNew() {
  const { t } = useTranslation();
  const { userId } = useUser();

  // State
  const [activeTab, setActiveTab] = useState<CommunityTab>(CommunityTab.RECOMMEND);
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.HOT);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [publishDialogVisible, setPublishDialogVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load posts on mount and when filter changes
  useEffect(() => {
    loadPosts(true);
  }, [activeTab, activeFilter]);

  async function loadPosts(reset = false) {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(0);
      }

      const offset = reset ? 0 : currentPage * 20;

      // TEMPORARY: Use existing getPosts API until backend implements /api/community/feed
      // TODO: Replace with getCommunityFeed when backend is ready
      const regularPosts = await getPosts({
        userId,
        limit: 20,
        offset,
      });

      // Convert Post to CommunityPost format
      const communityPosts: CommunityPost[] = regularPosts.map((post) => ({
        ...post,
        post_type: 'normal' as const,
        is_pinned: false,
        is_featured: Math.random() > 0.8, // Random featured for demo
        view_count: Math.floor(Math.random() * 1000),
        reply_count: post.comments,
      }));

      // Debug logging
      console.log('✅ Posts loaded:', communityPosts.length);
      console.log('📊 Sample post:', communityPosts[0] || 'No posts');

      if (reset) {
        setPosts(communityPosts);
      } else {
        setPosts((prev) => [...prev, ...communityPosts]);
      }

      setHasMore(communityPosts.length === 20);
      setCurrentPage((prev) => (reset ? 1 : prev + 1));
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to empty array or show error
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadPosts(true);
  }

  async function handleEndReached() {
    if (!loading && hasMore) {
      await loadPosts(false);
    }
  }

  async function handleLike(postId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        await likePost(postId, userId);
      } else {
        await unlikePost(postId, userId);
      }

      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.post_id === postId
            ? {
                ...post,
                is_liked: isLiked,
                likes: post.likes + (isLiked ? 1 : -1),
              }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  }

  function handlePublishSuccess() {
    loadPosts(true);
  }

  function handleFabPress() {
    Animated.sequence([
      animations.scale(scaleAnim, 0.9, 100),
      animations.scale(scaleAnim, 1, 100),
    ]).start();

    setPublishDialogVisible(true);
  }

  function handlePostPress(postId: string) {
    // TODO: Navigate to post detail screen
    console.log('Post pressed:', postId);
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case CommunityTab.RECOMMEND:
        // Show empty state if no posts and not loading
        if (!loading && posts.length === 0) {
          return (
            <View className="flex-1 items-center justify-center bg-background">
              <Text className="text-6xl mb-4">📭</Text>
              <Text className="text-lg text-text-primary font-semibold mb-2">
                暂无内容
              </Text>
              <Text className="text-sm text-text-secondary">
                成为第一个发帖的人吧！
              </Text>
              <TouchableOpacity
                className="mt-6 bg-primary px-6 py-3 rounded-lg"
                onPress={handleFabPress}
              >
                <Text className="text-white font-semibold">✏️ 发布第一条动态</Text>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <WaterfallGrid
            posts={posts}
            loading={loading}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleEndReached}
            onPostPress={handlePostPress}
            onLike={handleLike}
          />
        );

      case CommunityTab.ROUTE_CIRCLE:
        // TODO: Implement Route Circle Screen
        return (
          <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-lg text-text-secondary">
              {t('common.coming_soon')}
            </Text>
            <Text className="text-sm text-text-secondary mt-sm">
              {t('community.tabs.route_circle')}
            </Text>
          </View>
        );

      case CommunityTab.NEARBY_PEOPLE:
        // WiFi功能 - 显示附近连接WiFi的人和优惠信息
        return <WiFiScreen />;

      case CommunityTab.TOPICS:
        // TODO: Implement Topics/Forum Screen
        return (
          <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-lg text-text-secondary">
              {t('common.coming_soon')}
            </Text>
            <Text className="text-sm text-text-secondary mt-sm">
              {t('community.tabs.topics')}
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Tab Bar */}
      <CommunityTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filter Bar - Only show for Recommend and Route Circle tabs, hide for WiFi/Nearby People */}
      {(activeTab === CommunityTab.RECOMMEND ||
        activeTab === CommunityTab.ROUTE_CIRCLE) && (
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      )}

      {/* Content */}
      {renderContent()}

      {/* Floating Action Button - Hide for WiFi/Nearby People tab */}
      {activeTab !== CommunityTab.NEARBY_PEOPLE && (
        <Animated.View
          className="absolute right-xl bottom-xl w-14 h-14 rounded-[28px] bg-primary ios:shadow-lg-rn android:elevation-[8]"
          style={{
            transform: [{ scale: scaleAnim }],
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
      )}

      {/* Publish Dialog */}
      <PublishDialog
        visible={publishDialogVisible}
        onClose={() => setPublishDialogVisible(false)}
        onSuccess={handlePublishSuccess}
      />
    </View>
  );
}
