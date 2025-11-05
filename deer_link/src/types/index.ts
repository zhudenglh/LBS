// Barrel Export for All Types

export * from './api';
export * from './user';
export * from './post';
export * from './chat';
export * from './wifi';

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  PostDetail: { postId: string };
  MyPosts: undefined;
  AIChat: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  WiFi: undefined;
  Favorite: undefined;
  Profile: undefined;
};
