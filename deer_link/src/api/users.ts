// Users API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type { User, Post } from '@types';

/**
 * 注册用户
 */
export async function register(
  phone: string,
  nickname: string,
  password: string
): Promise<{ user_id: string; token: string; expires_at: string }> {
  const response = await apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
    phone,
    nickname,
    password,
  });
  return response.data.data;
}

/**
 * 用户登录
 */
export async function login(
  phone: string,
  password: string
): Promise<{
  user_id: string;
  nickname: string;
  avatar: string;
  token: string;
  expires_at: string;
}> {
  const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
    phone,
    password,
  });
  return response.data.data;
}

/**
 * 刷新 Token
 */
export async function refreshToken(): Promise<{ token: string; expires_at: string }> {
  const response = await apiClient.post(API_ENDPOINTS.AUTH_REFRESH);
  return response.data.data;
}

/**
 * 获取用户信息
 */
export async function getUserInfo(userId: string): Promise<User> {
  const response = await apiClient.get(API_ENDPOINTS.USER_DETAIL(userId));
  return response.data.data;
}

/**
 * 更新当前用户信息
 */
export async function updateCurrentUserInfo(data: {
  nickname?: string;
  avatar?: string;
  bio?: string;
}): Promise<User> {
  const response = await apiClient.put(API_ENDPOINTS.USER_ME, data);
  return response.data.data.user;
}

/**
 * 更新用户信息（已废弃，使用 updateCurrentUserInfo）
 */
export async function updateUserInfo(
  userId: string,
  data: {
    nickname?: string;
    avatar?: string;
    bio?: string;
    gender?: number;
    birthday?: string;
    location?: string;
  }
): Promise<User> {
  const response = await apiClient.put(API_ENDPOINTS.USER_DETAIL(userId), data);
  return response.data.data;
}

/**
 * 获取用户的帖子列表
 */
export async function getUserPosts(
  userId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<{ posts: Post[]; total: number }> {
  const response = await apiClient.get(API_ENDPOINTS.USER_POSTS(userId), {
    params: { page, page_size: pageSize },
  });
  return response.data.data;
}

/**
 * 批量创建用户（临时接口，用于数据同步）
 */
export async function batchCreateUsers(users: Array<{
  nickname: string;
  avatar: string;
  bio?: string;
  location?: string;
}>): Promise<User[]> {
  const response = await apiClient.post(API_ENDPOINTS.BATCH_USERS, { users });
  return response.data.data;
}
