// Community Related Types

import type { Post } from './api';

// 专题分类枚举
export enum TopicCategory {
  HOT = 'hot',
  GUIDE = 'guide',
  LOST_FOUND = 'lost_found',
  FEEDBACK = 'feedback',
  ANNOUNCEMENT = 'announcement',
}

// 内容类型枚举
export enum PostType {
  NORMAL = 'normal',
  TOPIC = 'topic',
  ANNOUNCEMENT = 'announcement',
}

// 筛选类型枚举
export enum FilterType {
  HOT = 'hot',
  LATEST = 'latest',
  FEATURED = 'featured',
}

// 扩展的社区帖子类型
export interface CommunityPost extends Post {
  post_type: PostType;
  category?: TopicCategory;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  reply_count: number;
  last_reply_user?: string;
  last_reply_avatar?: string;
  last_reply_time?: number;
  route_number?: string;
  location?: PostLocation;
}

// 位置信息
export interface PostLocation {
  latitude: number;
  longitude: number;
  station_name?: string;
  route_number?: string;
}

// 回复数据结构
export interface PostReply {
  reply_id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar: string;
  content: string;
  images?: string[];
  timestamp: number;
  likes: number;
  is_liked: boolean;
  parent_reply_id?: string;
  parent_reply_user?: string;
}

// 附近用户信息
export interface NearbyUser {
  user_id: string;
  username: string;
  avatar: string;
  distance: number;
  is_online: boolean;
  is_same_bus: boolean;
  route_number?: string;
  latest_post?: {
    post_id: string;
    title: string;
    image_url?: string;
    timestamp: number;
  };
}

// 线路信息
export interface BusRoute {
  route_number: string;
  route_name: string;
  online_users_count: number;
  post_count: number;
  is_active: boolean;
}

// 瀑布流卡片项
export interface WaterfallItem {
  id: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  busTag?: string;
  isFeatured?: boolean;
}

// 社区 Tab 类型
export enum CommunityTab {
  RECOMMEND = 'recommend',
  ROUTE_CIRCLE = 'route_circle',
  NEARBY_PEOPLE = 'nearby_people',
  TOPICS = 'topics',
}

// API 请求参数
export interface GetCommunityFeedParams {
  userId?: string;
  filter?: FilterType;
  limit?: number;
  offset?: number;
}

export interface GetRoutePostsParams {
  userId?: string;
  routeNumber: string;
  filter?: FilterType;
  limit?: number;
  offset?: number;
}

export interface GetNearbyUsersParams {
  userId: string;
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}

export interface GetTopicPostsParams {
  userId?: string;
  category: TopicCategory;
  limit?: number;
  offset?: number;
}

export interface CreateReplyRequest {
  postId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  images?: string[];
  parentReplyId?: string;
}

export interface CreateReplyResponse {
  replyId: string;
}

export interface GetRepliesParams {
  postId: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface GetRepliesResponse {
  replies: PostReply[];
  total: number;
}
