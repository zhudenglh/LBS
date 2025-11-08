// Community API

import { apiClient } from './client';
import { COMMUNITY_API_ENDPOINTS } from '@constants/community';
import type {
  CommunityPost,
  PostReply,
  NearbyUser,
  BusRoute,
  GetCommunityFeedParams,
  GetRoutePostsParams,
  GetNearbyUsersParams,
  GetTopicPostsParams,
  CreateReplyRequest,
  CreateReplyResponse,
  GetRepliesParams,
  GetRepliesResponse,
} from '@types';

// 获取推荐流
export async function getCommunityFeed(
  params?: GetCommunityFeedParams
): Promise<CommunityPost[]> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_FEED, {
    params,
  });
  return response.data.posts;
}

// 获取线路圈内容
export async function getRoutePosts(
  params: GetRoutePostsParams
): Promise<CommunityPost[]> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_ROUTE_POSTS, {
    params,
  });
  return response.data.posts;
}

// 获取附近的人
export async function getNearbyUsers(
  params: GetNearbyUsersParams
): Promise<NearbyUser[]> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_NEARBY_USERS, {
    params,
  });
  return response.data.users;
}

// 获取专题内容
export async function getTopicPosts(
  params: GetTopicPostsParams
): Promise<CommunityPost[]> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_TOPIC_POSTS, {
    params,
  });
  return response.data.posts;
}

// 创建回复
export async function createReply(
  data: CreateReplyRequest
): Promise<CreateReplyResponse> {
  const response = await apiClient.post(COMMUNITY_API_ENDPOINTS.POST_REPLY, data);
  return response.data;
}

// 获取回复列表
export async function getReplies(
  params: GetRepliesParams
): Promise<GetRepliesResponse> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_REPLIES, {
    params,
  });
  return response.data;
}

// 点赞回复
export async function likeReply(
  replyId: string,
  userId: string
): Promise<{ likes: number }> {
  const response = await apiClient.post(COMMUNITY_API_ENDPOINTS.LIKE_REPLY, {
    replyId,
    userId,
  });
  return response.data;
}

// 取消点赞回复
export async function unlikeReply(
  replyId: string,
  userId: string
): Promise<{ likes: number }> {
  const response = await apiClient.post(COMMUNITY_API_ENDPOINTS.UNLIKE_REPLY, {
    replyId,
    userId,
  });
  return response.data;
}

// 获取线路列表
export async function getBusRoutes(): Promise<BusRoute[]> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_ROUTES);
  return response.data.routes;
}

// 获取线路在线用户数
export async function getOnlineUsersCount(
  routeNumber: string
): Promise<number> {
  const response = await apiClient.get(COMMUNITY_API_ENDPOINTS.GET_ONLINE_USERS, {
    params: { routeNumber },
  });
  return response.data.count;
}
