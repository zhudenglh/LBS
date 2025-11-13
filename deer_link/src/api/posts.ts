// Posts API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  GetPostsParams,
  LikePostResponse,
} from '@types';

/**
 * 创建帖子
 */
export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await apiClient.post(API_ENDPOINTS.POSTS, data);
  return response.data.data;
}

/**
 * 获取帖子列表
 */
export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  const response = await apiClient.get(API_ENDPOINTS.POSTS, { params });
  return response.data.data.posts;
}

/**
 * 获取帖子详情
 */
export async function getPostDetail(postId: string, userId?: string): Promise<Post> {
  const params = userId ? { user_id: userId } : {};
  const response = await apiClient.get(API_ENDPOINTS.POST_DETAIL(postId), { params });
  return response.data.data;
}

/**
 * 删除帖子
 */
export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.POST_DETAIL(postId));
}

/**
 * 点赞帖子
 */
export async function likePost(postId: string): Promise<LikePostResponse> {
  const response = await apiClient.post(API_ENDPOINTS.POST_LIKE(postId));
  return response.data.data;
}

/**
 * 取消点赞帖子
 */
export async function unlikePost(postId: string): Promise<LikePostResponse> {
  const response = await apiClient.delete(API_ENDPOINTS.POST_LIKE(postId));
  return response.data.data;
}

/**
 * 收藏帖子
 */
export async function favoritePost(postId: string): Promise<void> {
  await apiClient.post(API_ENDPOINTS.POST_FAVORITE(postId));
}

/**
 * 取消收藏帖子
 */
export async function unfavoritePost(postId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.POST_FAVORITE(postId));
}

/**
 * 批量创建帖子（临时接口，用于数据同步）
 */
export async function batchCreatePosts(posts: Array<{
  user_id: string;
  title: string;
  content: string;
  images?: string[];
  bus_tag: string;
  location?: string;
}>): Promise<Post[]> {
  const response = await apiClient.post(API_ENDPOINTS.BATCH_POSTS, { posts });
  return response.data.data;
}
