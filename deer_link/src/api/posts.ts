// Posts API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type {
  CreatePostRequest,
  CreatePostResponse,
  Post,
  GetPostsParams,
  LikePostRequest,
  LikePostResponse,
} from '@types';

export async function createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
  const response = await apiClient.post(API_ENDPOINTS.POSTS, data);
  return response.data;
}

export async function getPosts(params?: GetPostsParams): Promise<Post[]> {
  const response = await apiClient.get(API_ENDPOINTS.POSTS, { params });
  return response.data.posts;
}

export async function likePost(postId: string, userId: string): Promise<LikePostResponse> {
  const response = await apiClient.post(API_ENDPOINTS.POSTS_LIKE, { postId, userId });
  return response.data;
}

export async function unlikePost(postId: string, userId: string): Promise<LikePostResponse> {
  const response = await apiClient.post(API_ENDPOINTS.POSTS_UNLIKE, { postId, userId });
  return response.data;
}
