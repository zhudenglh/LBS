// Community Constants and Configuration

import { TopicCategory, FilterType, CommunityTab } from '@types';

// 社区 API 端点
export const COMMUNITY_API_ENDPOINTS = {
  // 获取推荐流
  GET_FEED: '/api/community/feed',

  // 获取线路圈内容
  GET_ROUTE_POSTS: '/api/community/route',

  // 获取附近的人
  GET_NEARBY_USERS: '/api/community/nearby',

  // 获取专题内容
  GET_TOPIC_POSTS: '/api/community/topic',

  // 回复相关
  POST_REPLY: '/api/posts/reply',
  GET_REPLIES: '/api/posts/replies',
  LIKE_REPLY: '/api/replies/like',
  UNLIKE_REPLY: '/api/replies/unlike',

  // 线路信息
  GET_ROUTES: '/api/community/routes',
  GET_ONLINE_USERS: '/api/community/routes/online',
};

// 瀑布流配置
export const WATERFALL_CONFIG = {
  // 列数
  COLUMNS: 2,

  // 间距
  COLUMN_GAP: 8,
  CARD_GAP: 12,
  HORIZONTAL_PADDING: 12,

  // 卡片配置
  CARD_BORDER_RADIUS: 8,
  CARD_SHADOW_RADIUS: 4,
  CARD_ELEVATION: 2,

  // 图片配置
  IMAGE_MIN_HEIGHT: 120,
  IMAGE_MAX_HEIGHT: 400,
  IMAGE_ASPECT_RATIO_MAX: 0.75, // 3:4

  // 分页配置
  INITIAL_LOAD: 20,
  PAGE_SIZE: 20,
  PREFETCH_THRESHOLD: 0.5,

  // 缓存配置
  CACHE_DURATION: 5 * 60 * 1000, // 5 分钟
};

// 论坛配置
export const FORUM_CONFIG = {
  // 分页
  PAGE_SIZE: 15,
  REPLY_PAGE_SIZE: 20,

  // 楼层
  MAX_NEST_LEVEL: 2, // 最多支持 2 层楼中楼

  // 内容限制
  MAX_TITLE_LENGTH: 50,
  MAX_CONTENT_LENGTH: 1000,
  MAX_REPLY_LENGTH: 500,

  // 富文本
  ALLOW_IMAGES: true,
  ALLOW_MENTION: true,
  ALLOW_EMOJI: true,
  MAX_IMAGES_PER_REPLY: 3,
};

// 位置配置
export const LOCATION_CONFIG = {
  // 默认搜索半径（米）
  DEFAULT_RADIUS: 5000,

  // 刷新间隔（秒）
  REFRESH_INTERVAL: 30,

  // 距离标识阈值
  SAME_BUS_THRESHOLD: 100, // 100米内视为同车
  NEARBY_THRESHOLD: 1000, // 1000米内视为附近

  // 位置更新频率
  UPDATE_FREQUENCY: 30000, // 30 秒
};

// 专题分类配置
export const TOPIC_CATEGORIES = [
  {
    key: TopicCategory.HOT,
    icon: '🔥',
    color: '#FF5722',
  },
  {
    key: TopicCategory.GUIDE,
    icon: '🚌',
    color: '#2196F3',
  },
  {
    key: TopicCategory.LOST_FOUND,
    icon: '❓',
    color: '#FFC107',
  },
  {
    key: TopicCategory.FEEDBACK,
    icon: '💡',
    color: '#4CAF50',
  },
  {
    key: TopicCategory.ANNOUNCEMENT,
    icon: '📢',
    color: '#9C27B0',
  },
] as const;

// 筛选器配置
export const FILTER_OPTIONS = [
  {
    key: FilterType.HOT,
    sortField: 'hot_score',
    sortOrder: 'desc',
  },
  {
    key: FilterType.LATEST,
    sortField: 'timestamp',
    sortOrder: 'desc',
  },
  {
    key: FilterType.FEATURED,
    sortField: 'is_featured',
    sortOrder: 'desc',
  },
] as const;

// Tab 配置
export const COMMUNITY_TABS = [
  {
    key: CommunityTab.RECOMMEND,
    icon: '📱',
  },
  {
    key: CommunityTab.ROUTE_CIRCLE,
    icon: '🚌',
  },
  {
    key: CommunityTab.NEARBY_PEOPLE,
    icon: '📍',
  },
  {
    key: CommunityTab.TOPICS,
    icon: '📂',
  },
] as const;

// 南京公交线路（示例数据，实际应从后端获取）
export const NANJING_BUS_ROUTES = [
  { route_number: '1', route_name: '1路', color: '#FF5722' },
  { route_number: '2', route_name: '2路', color: '#2196F3' },
  { route_number: '3', route_name: '3路', color: '#4CAF50' },
  { route_number: '9', route_name: '9路', color: '#FFC107' },
  { route_number: '13', route_name: '13路', color: '#9C27B0' },
  { route_number: '25', route_name: '25路', color: '#FF9800' },
  { route_number: '33', route_name: '33路', color: '#00BCD4' },
  { route_number: '48', route_name: '48路', color: '#E91E63' },
  { route_number: '91', route_name: '91路', color: '#3F51B5' },
  { route_number: '100', route_name: '100路', color: '#009688' },
] as const;

// 动画配置
export const ANIMATION_CONFIG = {
  // 卡片进入动画
  CARD_ENTER_DURATION: 300,
  CARD_ENTER_DELAY: 50,

  // 点赞动画
  LIKE_SCALE_DURATION: 150,
  LIKE_SCALE_MAX: 1.2,

  // Tab 切换动画
  TAB_SWITCH_DURATION: 250,

  // 下拉刷新
  REFRESH_DURATION: 400,
};

// 骨架屏配置
export const SKELETON_CONFIG = {
  CARD_COUNT: 6,
  ANIMATION_DURATION: 1000,
  BASE_COLOR: '#E0E0E0',
  HIGHLIGHT_COLOR: '#F5F5F5',
};

// 缓存键
export const CACHE_KEYS = {
  COMMUNITY_FEED: 'community:feed',
  ROUTE_POSTS: 'community:route',
  NEARBY_USERS: 'community:nearby',
  TOPIC_POSTS: 'community:topic',
  POST_DETAIL: 'community:post',
  POST_REPLIES: 'community:replies',
};
