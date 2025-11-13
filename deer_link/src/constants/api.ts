// API Constants

// 服务器地址 - 根据环境切换
export const API_BASE_URL = __DEV__
  ? 'http://47.107.130.240/api/v1'  // 开发环境：使用服务器地址
  : 'http://47.107.130.240/api/v1'; // 生产环境：使用服务器地址

export const API_ENDPOINTS = {
  // 认证相关
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',

  // 用户相关
  USERS: '/users',
  USER_DETAIL: (userId: string) => `/users/${userId}`,
  USER_POSTS: (userId: string) => `/users/${userId}/posts`,

  // 帖子相关
  POSTS: '/posts',
  POST_DETAIL: (postId: string) => `/posts/${postId}`,
  POST_LIKE: (postId: string) => `/posts/${postId}/like`,
  POST_FAVORITE: (postId: string) => `/posts/${postId}/favorite`,
  POST_COMMENTS: (postId: string) => `/posts/${postId}/comments`,

  // 评论相关
  COMMENT_DELETE: (commentId: string) => `/comments/${commentId}`,

  // 文件上传
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_IMAGES: '/upload/images',
  UPLOAD_VIDEO: '/upload/video',

  // AI 聊天
  AI_CHAT: '/ai/chat',
  AI_CHAT_HISTORY: '/ai/chat/history',

  // 健康检查
  HEALTH: '/health',

  // 批量操作（临时，用于数据同步）
  BATCH_USERS: '/users/batch',
  BATCH_POSTS: '/posts/batch',
};

export const API_TIMEOUT = 30000; // 30 seconds
