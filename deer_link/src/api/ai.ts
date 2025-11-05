// AI Chat API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type { AIChatRequest, AIChatResponse } from '@types';

export async function sendChatMessage(request: AIChatRequest): Promise<string> {
  const response = await apiClient.post<AIChatResponse>(API_ENDPOINTS.AI_CHAT, request);
  return response.data.reply;
}
