// Avatar Generation Utilities

import { AVATAR_EMOJIS } from '@constants/config';

// 用户头像URL池 - 用于注册时生成随机头像
const USER_AVATAR_URLS = [
  'https://images.unsplash.com/photo-1526876917250-9c7bcecd349f?w=200',
  'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200',
  'https://images.unsplash.com/photo-1734764627104-6ad22c48af6a?w=200',
  'https://images.unsplash.com/photo-1699903905361-4d408679753f?w=200',
  'https://images.unsplash.com/photo-1705830337569-47a1a24b0ad2?w=200',
];

export function generateRandomAvatar(): string {
  // 返回 URL 字符串而不是 emoji，用于后端注册
  const randomIndex = Math.floor(Math.random() * USER_AVATAR_URLS.length);
  return USER_AVATAR_URLS[randomIndex];
}

// 如果需要 emoji 头像，使用这个函数
export function generateRandomEmojiAvatar(): string {
  const randomIndex = Math.floor(Math.random() * AVATAR_EMOJIS.length);
  return AVATAR_EMOJIS[randomIndex];
}

export function generateRandomNickname(): string {
  const adjectives = ['Happy', 'Sunny', 'Brave', 'Smart', 'Kind', 'Cool', 'Swift', 'Bright'];
  const nouns = ['Traveler', 'Explorer', 'Rider', 'Passenger', 'Commuter', 'Wanderer', 'Voyager'];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 1000);

  return `${randomAdj}${randomNoun}${randomNum}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
