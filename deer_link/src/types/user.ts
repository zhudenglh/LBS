// User Related Types

export interface User {
  userId: string;
  nickname: string;
  avatar: string;
  postCount: number;
  likeCount: number;
  collectCount: number;
}

export interface UserProfile extends User {
  bio?: string;
  createdAt: number;
}

export interface NearbyPerson {
  userId: string;
  nickname: string;
  avatar: string;
  location: string;
  distance: number;
  signature: string;
  isSameBus: boolean;
}
