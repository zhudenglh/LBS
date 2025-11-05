// Users API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type { SyncUserRequest, SyncUserResponse } from '@types';

export async function syncUser(data: SyncUserRequest): Promise<SyncUserResponse> {
  const response = await apiClient.post(API_ENDPOINTS.USER_SYNC, data);
  return response.data;
}
