// Comments API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type { Comment } from '@types';

/**
 * 获取帖子的评论列表
 */
export async function getComments(
  postId: string,
  userId?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<Comment[]> {
  const params: any = { page, page_size: pageSize };
  if (userId) {
    params.user_id = userId;
  }

  const response = await apiClient.get(API_ENDPOINTS.POST_COMMENTS(postId), { params });
  return response.data.data.comments;
}

/**
 * 发表评论
 */
export async function createComment(
  postId: string,
  content: string,
  parentId?: string | null,
  replyToUserId?: string | null
): Promise<{ comment_id: string; created_at: string }> {
  const data: any = { content };

  if (parentId) {
    data.parent_id = parentId;
  }
  if (replyToUserId) {
    data.reply_to_user_id = replyToUserId;
  }

  const response = await apiClient.post(API_ENDPOINTS.POST_COMMENTS(postId), data);
  return response.data.data;
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.COMMENT_DELETE(commentId));
}

/**
 * 点赞评论
 */
export async function likeComment(commentId: string): Promise<{ like_count: number }> {
  const response = await apiClient.post(`/comments/${commentId}/like`);
  return response.data.data;
}

/**
 * 取消点赞评论
 */
export async function unlikeComment(commentId: string): Promise<{ like_count: number }> {
  const response = await apiClient.delete(`/comments/${commentId}/like`);
  return response.data.data;
}
