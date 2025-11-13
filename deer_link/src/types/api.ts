// API Request and Response Types

export interface CreatePostRequest {
  title: string;
  content: string;
  busTag: string;
  imageUrls?: string[];
  userId: string;
  username: string;
  avatar: string;
}

export interface CreatePostResponse {
  postId: string;
}

export interface Post {
  post_id: string;
  title: string;
  content?: string;
  username: string;
  avatar: string;
  timestamp: number;
  bus_tag: string;
  likes: number;
  comments: number;
  image_urls?: string[] | string;
  is_liked?: boolean;
  isLiked?: boolean; // For component compatibility
  user_id: string;
}

export interface LikePostRequest {
  postId: string;
  userId: string;
}

export interface LikePostResponse {
  likes: number;
}

export interface GetPostsParams {
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface UploadImageResponse {
  url: string;
}

export interface AIChatRequest {
  message: string;
  history?: ChatHistoryItem[];
}

export interface AIChatResponse {
  reply: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface SyncUserRequest {
  userId: string;
  nickname: string;
  avatar: string;
}

export interface SyncUserResponse {
  success: boolean;
}
