// App Configuration Constants

export const APP_CONFIG = {
  APP_NAME: 'XiaoLuYou',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'zh',
  SUPPORTED_LANGUAGES: ['zh', 'en', 'id'],
};

export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_COUNT: 3,
  QUALITY: 0.8,
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
};

export const STORAGE_KEYS = {
  USER_ID: '@user_id',
  NICKNAME: '@nickname',
  AVATAR: '@avatar',
  LANGUAGE: '@language',
  FIRST_LAUNCH: '@first_launch',
};

export const AVATAR_EMOJIS = [
  '👨‍💼', '👩‍🎓', '👨‍🎤', '👩‍💻', '👨‍⚕️', '👩‍🏫',
  '👨‍🔬', '👩‍🚀', '👨‍🎨', '👩‍🔧', '🧑‍🌾', '🧑‍🍳',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
  '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
];

export const BUS_LINES = ['2路', '5路', '11路', '33路'];
