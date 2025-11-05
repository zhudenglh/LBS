// Avatar Generation Utilities

import { AVATAR_EMOJIS } from '@constants/config';

export function generateRandomAvatar(): string {
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
