// Authentication API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';

export interface RegisterRequest {
  phone?: string;
  email?: string;
  password: string;
  nickname: string;
  avatar?: string;
  gender?: number;
  age?: number;
}

export interface RegisterResponse {
  user_id: string;
  token: string;
}

export interface LoginRequest {
  phone?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  nickname: string;
  avatar: string;
  token: string;
}

/**
 * 注册新用户
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data);
  return response.data.data;
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, data);
  return response.data.data;
}
