# Reddit-like 社区实现指南

本文档提供 Reddit-like 社区功能的详细实现步骤和代码示例。

---

## 📁 文件结构变更

### 新增目录结构

```
deer_link/
├── src/
│   ├── screens/
│   │   ├── community/                    # 新增：社区相关页面
│   │   │   ├── CommunityFeedScreen.tsx   # 主页 Feed（替换现有 DiscoverScreen）
│   │   │   ├── CircleListScreen.tsx      # 圈子列表
│   │   │   ├── CircleDetailScreen.tsx    # 圈子详情
│   │   │   ├── PostDetailScreen.tsx      # 帖子详情（增强版）
│   │   │   ├── PostCreateScreen.tsx      # 发帖页面（支持 Flair）
│   │   │   └── CircleManageScreen.tsx    # 圈子管理（圈主）
│   │   │
│   ├── components/
│   │   ├── community/                    # 新增：社区组件
│   │   │   ├── CircleCard.tsx            # 圈子卡片
│   │   │   ├── FlairBadge.tsx            # Flair 标签
│   │   │   ├── FlairSelector.tsx         # Flair 选择器
│   │   │   ├── FeedSwitcher.tsx          # Feed 切换器
│   │   │   ├── SortSelector.tsx          # 排序选择器
│   │   │   ├── CommentItem.tsx           # 评论组件（支持嵌套）
│   │   │   ├── CommentInput.tsx          # 评论输入框
│   │   │   ├── PinnedPostBanner.tsx      # 置顶帖横幅
│   │   │   └── CircleHeader.tsx          # 圈子头部
│   │   │
│   │   ├── posts/
│   │   │   ├── PostCard.tsx              # 重构：支持显示圈子和 Flair
│   │   │   ├── PostList.tsx              # 重构：支持多种排序
│   │   │   └── PublishDialog.tsx         # 重构：支持选择 Flair
│   │   │
│   ├── api/
│   │   ├── circles.ts                    # 新增：圈子 API
│   │   ├── flairs.ts                     # 新增：Flair API
│   │   ├── comments.ts                   # 新增：评论 API
│   │   ├── posts.ts                      # 扩展：支持 Flair 和排序
│   │   └── feed.ts                       # 新增：Feed API
│   │
│   ├── types/
│   │   ├── circle.ts                     # 新增：圈子类型定义
│   │   ├── flair.ts                      # 新增：Flair 类型定义
│   │   ├── comment.ts                    # 新增：评论类型定义
│   │   └── post.ts                       # 扩展：添加 Flair 字段
│   │
│   ├── hooks/
│   │   ├── useCircles.ts                 # 新增：圈子 Hook
│   │   ├── useFlairs.ts                  # 新增：Flair Hook
│   │   ├── useComments.ts                # 新增：评论 Hook
│   │   └── useFeed.ts                    # 新增：Feed Hook
│   │
│   ├── utils/
│   │   ├── hotScore.ts                   # 新增：热度分数计算
│   │   └── markdown.ts                   # 新增：Markdown 渲染
```

---

## 📝 类型定义

### src/types/circle.ts

```typescript
export interface Circle {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  rules: string[];
  coverImage?: string;
  color?: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  creatorId: string;
  moderatorIds: string[];
}

export interface CircleMembership {
  id: string;
  circleId: string;
  userId: string;
  role: 'member' | 'moderator' | 'creator';
  joinedAt: string;
  isBanned: boolean;
  bannedUntil?: string;
  bannedReason?: string;
}

export interface CreateCircleRequest {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color?: string;
  rules?: string[];
}
```

### src/types/flair.ts

```typescript
export interface Flair {
  id: string;
  circleId: string;
  name: string;
  color: string;
  textColor: string;
  icon?: string;
  description?: string;
  postCount: number;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CreateFlairRequest {
  circleId: string;
  name: string;
  color: string;
  textColor: string;
  icon?: string;
  description?: string;
  isDefault?: boolean;
}
```

### src/types/comment.ts

```typescript
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  parentId?: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  depth: number;
  isPinned: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];  // 嵌套评论
  isLiked?: boolean;    // 当前用户是否点赞
  isDisliked?: boolean; // 当前用户是否踩
}

export interface CreateCommentRequest {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}
```

### src/types/post.ts (扩展)

```typescript
export interface Post {
  id: string;
  circleId: string;           // 新增
  circleName: string;         // 新增
  circleIcon: string;         // 新增
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  imageUrls: string[];
  flairIds: string[];         // 新增
  flairs: Flair[];            // 新增：关联的 Flair 对象
  tags: string[];
  likeCount: number;
  dislikeCount: number;       // 新增
  commentCount: number;
  viewCount: number;          // 新增
  hotScore: number;           // 新增
  isPinned: boolean;          // 新增
  pinnedAt?: string;          // 新增
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;       // 新增
}

export interface CreatePostRequest {
  circleId: string;           // 新增
  authorId: string;
  title: string;
  content: string;
  imageUrls: string[];
  flairIds: string[];         // 新增：必须至少1个
  tags?: string[];
}
```

---

## 🔧 API 客户端实现

### src/api/circles.ts

```typescript
import { apiClient } from './client';
import type { Circle, CircleMembership, CreateCircleRequest } from '@types/circle';

/**
 * 获取圈子列表
 */
export async function getCircles(params?: {
  category?: string;
  sort?: 'members' | 'posts' | 'new';
  page?: number;
  limit?: number;
}): Promise<{ circles: Circle[]; total: number; hasMore: boolean }> {
  const response = await apiClient.get('/circles', { params });
  return response.data;
}

/**
 * 获取圈子详情
 */
export async function getCircleById(circleId: string, userId?: string): Promise<{
  circle: Circle;
  isMember: boolean;
  role?: 'member' | 'moderator' | 'creator';
}> {
  const response = await apiClient.get(`/circles/${circleId}`, {
    params: { userId },
  });
  return response.data;
}

/**
 * 加入圈子
 */
export async function joinCircle(circleId: string, userId: string): Promise<CircleMembership> {
  const response = await apiClient.post(`/circles/${circleId}/join`, { userId });
  return response.data.membership;
}

/**
 * 退出圈子
 */
export async function leaveCircle(circleId: string, userId: string): Promise<void> {
  await apiClient.post(`/circles/${circleId}/leave`, { userId });
}

/**
 * 创建圈子（需要权限）
 */
export async function createCircle(data: CreateCircleRequest): Promise<Circle> {
  const response = await apiClient.post('/circles', data);
  return response.data.circle;
}

/**
 * 获取用户加入的圈子
 */
export async function getUserCircles(userId: string): Promise<Circle[]> {
  const response = await apiClient.get(`/users/${userId}/circles`);
  return response.data.circles;
}
```

### src/api/flairs.ts

```typescript
import { apiClient } from './client';
import type { Flair, CreateFlairRequest } from '@types/flair';

/**
 * 获取圈子的所有 Flair
 */
export async function getCircleFlairs(circleId: string): Promise<Flair[]> {
  const response = await apiClient.get(`/circles/${circleId}/flairs`);
  return response.data.flairs;
}

/**
 * 创建 Flair（圈主/管理员）
 */
export async function createFlair(data: CreateFlairRequest): Promise<Flair> {
  const response = await apiClient.post(`/circles/${data.circleId}/flairs`, data);
  return response.data.flair;
}

/**
 * 更新 Flair
 */
export async function updateFlair(
  flairId: string,
  data: Partial<CreateFlairRequest>
): Promise<Flair> {
  const response = await apiClient.put(`/flairs/${flairId}`, data);
  return response.data.flair;
}

/**
 * 删除 Flair
 */
export async function deleteFlair(flairId: string): Promise<void> {
  await apiClient.delete(`/flairs/${flairId}`);
}
```

### src/api/comments.ts

```typescript
import { apiClient } from './client';
import type { Comment, CreateCommentRequest } from '@types/comment';

/**
 * 获取帖子的评论
 */
export async function getComments(
  postId: string,
  params?: {
    sort?: 'hot' | 'new' | 'old';
    page?: number;
    limit?: number;
    userId?: string;
  }
): Promise<{ comments: Comment[]; total: number }> {
  const response = await apiClient.get(`/posts/${postId}/comments`, { params });
  return response.data;
}

/**
 * 创建评论
 */
export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  const response = await apiClient.post(`/posts/${data.postId}/comments`, data);
  return response.data.comment;
}

/**
 * 点赞评论
 */
export async function likeComment(commentId: string, userId: string): Promise<number> {
  const response = await apiClient.post(`/comments/${commentId}/like`, { userId });
  return response.data.likeCount;
}

/**
 * 踩评论
 */
export async function dislikeComment(commentId: string, userId: string): Promise<number> {
  const response = await apiClient.post(`/comments/${commentId}/dislike`, { userId });
  return response.data.dislikeCount;
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string, userId: string): Promise<void> {
  await apiClient.delete(`/comments/${commentId}`, { data: { userId } });
}
```

### src/api/posts.ts (扩展)

```typescript
import { apiClient } from './client';
import type { Post, CreatePostRequest } from '@types/post';

/**
 * 获取帖子列表（支持多种筛选和排序）
 */
export async function getPosts(params?: {
  circleId?: string;
  flairIds?: string[];
  sort?: 'hot' | 'new' | 'top';
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  page?: number;
  limit?: number;
  userId?: string;
}): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
  const response = await apiClient.get('/posts', { params });
  return response.data;
}

/**
 * 创建帖子（支持 Flair）
 */
export async function createPost(data: CreatePostRequest): Promise<Post> {
  const response = await apiClient.post('/posts', data);
  return response.data.post;
}

/**
 * 置顶帖子
 */
export async function pinPost(postId: string, circleId: string, userId: string): Promise<void> {
  await apiClient.post(`/posts/${postId}/pin`, { circleId, userId });
}

/**
 * 取消置顶
 */
export async function unpinPost(postId: string, circleId: string, userId: string): Promise<void> {
  await apiClient.post(`/posts/${postId}/unpin`, { circleId, userId });
}

/**
 * 踩帖子
 */
export async function dislikePost(postId: string, userId: string): Promise<void> {
  await apiClient.post(`/posts/${postId}/dislike`, { userId });
}

/**
 * 取消踩
 */
export async function undislikePost(postId: string, userId: string): Promise<void> {
  await apiClient.post(`/posts/${postId}/undislike`, { userId });
}
```

### src/api/feed.ts

```typescript
import { apiClient } from './client';
import type { Post } from '@types/post';

/**
 * 获取主页 Feed
 */
export async function getHomeFeed(params: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; hasMore: boolean }> {
  const response = await apiClient.get('/feed/home', { params });
  return response.data;
}

/**
 * 获取热门 Feed
 */
export async function getHotFeed(params?: {
  timeRange?: 'day' | 'week';
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; hasMore: boolean }> {
  const response = await apiClient.get('/feed/hot', { params });
  return response.data;
}

/**
 * 获取资讯 Feed
 */
export async function getNewsFeed(params?: {
  page?: number;
  limit?: number;
}): Promise<{ posts: Post[]; hasMore: boolean }> {
  const response = await apiClient.get('/feed/news', { params });
  return response.data;
}
```

---

## 🎯 关键组件实现

### src/components/community/FlairBadge.tsx

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Flair } from '@types/flair';

interface FlairBadgeProps {
  flair: Flair;
  size?: 'small' | 'medium' | 'large';
}

export default function FlairBadge({ flair, size = 'medium' }: FlairBadgeProps) {
  const fontSize = size === 'small' ? 10 : size === 'large' ? 14 : 12;
  const paddingH = size === 'small' ? 6 : size === 'large' ? 10 : 8;
  const paddingV = size === 'small' ? 2 : size === 'large' ? 5 : 3;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: flair.color,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}
    >
      {flair.icon && <Text style={styles.icon}>{flair.icon}</Text>}
      <Text
        style={[
          styles.text,
          { color: flair.textColor, fontSize },
        ]}
      >
        {flair.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
    fontSize: 10,
  },
  text: {
    fontWeight: '600',
  },
});
```

### src/components/community/FeedSwitcher.tsx

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize } from '@constants/theme';

type FeedType = 'home' | 'hot' | 'news' | 'following';

interface FeedSwitcherProps {
  currentFeed: FeedType;
  onFeedChange: (feed: FeedType) => void;
}

export default function FeedSwitcher({ currentFeed, onFeedChange }: FeedSwitcherProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const feedOptions: { value: FeedType; label: string }[] = [
    { value: 'home', label: t('feed.home') },
    { value: 'hot', label: t('feed.hot') },
    { value: 'news', label: t('feed.news') },
    { value: 'following', label: t('feed.following') },
  ];

  const currentLabel = feedOptions.find((f) => f.value === currentFeed)?.label || '';

  function handleSelect(feed: FeedType) {
    onFeedChange(feed);
    setModalVisible(false);
  }

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>{currentLabel}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {feedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  currentFeed === option.value && styles.optionActive,
                ]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentFeed === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {currentFeed === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  triggerText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  arrow: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingLeft: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 200,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionActive: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  optionTextActive: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkmark: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
});
```

### src/components/community/FlairSelector.tsx

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FlairBadge from './FlairBadge';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';
import type { Flair } from '@types/flair';

interface FlairSelectorProps {
  flairs: Flair[];
  selectedFlairIds: string[];
  onSelectFlairs: (flairIds: string[]) => void;
  maxSelection?: number;
}

export default function FlairSelector({
  flairs,
  selectedFlairIds,
  onSelectFlairs,
  maxSelection = 3,
}: FlairSelectorProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedFlairs = flairs.filter((f) => selectedFlairIds.includes(f.id));

  function toggleFlair(flairId: string) {
    if (selectedFlairIds.includes(flairId)) {
      onSelectFlairs(selectedFlairIds.filter((id) => id !== flairId));
    } else {
      if (selectedFlairIds.length < maxSelection) {
        onSelectFlairs([...selectedFlairIds, flairId]);
      }
    }
  }

  function handleDone() {
    setModalVisible(false);
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>
          {t('post.select_flair')} *
          <Text style={styles.hint}> ({t('post.max_flairs', { max: maxSelection })})</Text>
        </Text>

        <TouchableOpacity
          style={styles.trigger}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          {selectedFlairs.length > 0 ? (
            <View style={styles.selectedFlairs}>
              {selectedFlairs.map((flair) => (
                <FlairBadge key={flair.id} flair={flair} size="small" />
              ))}
            </View>
          ) : (
            <Text style={styles.placeholder}>{t('post.select_flair_placeholder')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleDone}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('post.select_flair')}</Text>
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.doneButton}>{t('common.done')}</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={flairs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedFlairIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.flairOption, isSelected && styles.flairOptionSelected]}
                    onPress={() => toggleFlair(item.id)}
                  >
                    <FlairBadge flair={item} />
                    {item.description && (
                      <Text style={styles.flairDescription}>{item.description}</Text>
                    )}
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: 'normal',
  },
  trigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 50,
  },
  selectedFlairs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  placeholder: {
    color: colors.text.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  doneButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  flairOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  flairOptionSelected: {
    backgroundColor: colors.background,
  },
  flairDescription: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  checkmark: {
    fontSize: fontSize.lg,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});
```

---

## 🌐 国际化文本

### src/i18n/locales/zh.json (新增部分)

```json
{
  "feed": {
    "home": "主页",
    "hot": "热门",
    "news": "资讯",
    "following": "关注的圈子"
  },
  "circle": {
    "join": "加入圈子",
    "joined": "已加入",
    "leave": "退出圈子",
    "members": "成员",
    "posts": "帖子",
    "online": "在线",
    "manage": "圈子管理",
    "about": "关于",
    "rules": "规则",
    "moderators": "管理员",
    "pinned_posts": "置顶帖",
    "all_flairs": "全部",
    "sort": {
      "hot": "热门",
      "new": "最新",
      "top": "精华",
      "top_week": "本周最佳",
      "top_month": "本月最佳",
      "top_year": "年度最佳",
      "top_all": "历史最佳"
    }
  },
  "post": {
    "select_flair": "选择 Flair",
    "select_flair_placeholder": "点击选择 Flair（必选）",
    "max_flairs": "最多 {max} 个",
    "select_circle": "选择圈子",
    "select_circle_placeholder": "点击选择发布圈子",
    "pin": "置顶",
    "unpin": "取消置顶",
    "delete": "删除",
    "views": "浏览",
    "posted_in": "发布于"
  },
  "comment": {
    "sort": {
      "hot": "热门",
      "new": "最新",
      "old": "最早"
    },
    "reply": "回复",
    "delete": "删除",
    "pin": "置顶",
    "unpin": "取消置顶",
    "replies": "{count} 条回复"
  },
  "flair": {
    "add": "添加 Flair",
    "edit": "编辑 Flair",
    "delete": "删除 Flair",
    "name": "名称",
    "color": "背景色",
    "text_color": "文字色",
    "icon": "图标（可选）",
    "description": "描述（可选）",
    "is_default": "设为默认"
  }
}
```

---

## 🚀 实施步骤

### 第一步：数据库和后端 API (1-2周)

1. **数据库设计**
   - 创建 PostgreSQL 数据库
   - 创建表：circles, flairs, posts (扩展), comments, circle_memberships, votes
   - 创建索引和外键

2. **后端 API 开发**
   - 实现圈子 CRUD API
   - 实现 Flair CRUD API
   - 扩展帖子 API（支持 Flair 和排序）
   - 实现评论 API（支持嵌套）
   - 实现 Feed API

3. **测试**
   - 使用 Postman 测试所有 API
   - 编写单元测试

### 第二步：前端类型和 API 客户端 (3-5天)

1. **类型定义**
   - 创建 Circle、Flair、Comment 类型
   - 扩展 Post 类型

2. **API 客户端**
   - 实现所有 API 调用函数
   - 添加错误处理

### 第三步：基础组件 (1周)

1. **FlairBadge** - Flair 标签显示
2. **FlairSelector** - Flair 选择器
3. **FeedSwitcher** - Feed 切换器
4. **SortSelector** - 排序选择器
5. **CircleCard** - 圈子卡片

### 第四步：核心页面 (2周)

1. **CommunityFeedScreen** - 主页 Feed
   - 实现 Feed 切换
   - 实现帖子列表
   - 实现下拉刷新和无限滚动

2. **CircleListScreen** - 圈子列表
   - 显示所有圈子
   - 支持搜索和筛选

3. **CircleDetailScreen** - 圈子详情
   - 显示圈子信息
   - 显示置顶帖
   - 支持 Flair 筛选
   - 支持排序

4. **PostCreateScreen** - 发帖页面
   - 选择圈子
   - 选择 Flair
   - 填写标题和内容
   - 上传图片

5. **PostDetailScreen** - 帖子详情
   - 显示帖子内容
   - 显示评论列表（支持嵌套）
   - 支持评论排序

### 第五步：高级功能 (1-2周)

1. **评论系统**
   - 嵌套评论显示
   - 评论输入
   - 评论点赞/踩

2. **圈子管理**
   - CircleManageScreen
   - Flair 管理
   - 置顶帖管理
   - 成员管理

3. **性能优化**
   - 实现 Redis 缓存
   - 优化图片加载
   - 优化列表滚动

### 第六步：测试和发布 (1周)

1. 完整功能测试
2. 性能测试
3. Bug 修复
4. 发布到测试环境

---

## ✅ 检查清单

### 后端开发

- [ ] PostgreSQL 数据库创建
- [ ] 数据库表创建和索引
- [ ] Circle CRUD API
- [ ] Flair CRUD API
- [ ] Post API 扩展
- [ ] Comment API
- [ ] Feed API
- [ ] 热度算法实现
- [ ] Redis 缓存实现
- [ ] API 单元测试

### 前端开发

- [ ] 类型定义完成
- [ ] API 客户端完成
- [ ] FlairBadge 组件
- [ ] FlairSelector 组件
- [ ] FeedSwitcher 组件
- [ ] SortSelector 组件
- [ ] CircleCard 组件
- [ ] CommentItem 组件
- [ ] CommunityFeedScreen
- [ ] CircleListScreen
- [ ] CircleDetailScreen
- [ ] PostCreateScreen
- [ ] PostDetailScreen
- [ ] CircleManageScreen
- [ ] 国际化文本完成
- [ ] 单元测试
- [ ] 集成测试

### 设计和用户体验

- [ ] UI 设计稿完成
- [ ] 交互原型完成
- [ ] 用户测试
- [ ] 反馈收集和迭代

---

**下一步**: 开始实施第一步 - 数据库和后端 API 开发
