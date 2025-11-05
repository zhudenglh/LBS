// User Context for Global User State

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@utils/storage';
import { generateRandomAvatar, generateRandomNickname, generateUUID } from '@utils/avatar';
import { STORAGE_KEYS } from '@constants/config';

interface UserContextType {
  userId: string;
  nickname: string;
  avatar: string;
  isFirstLaunch: boolean;
  postCount: number;
  likeCount: number;
  collectCount: number;
  updateProfile: (nickname: string, avatar: string) => Promise<void>;
  generateNewAvatar: () => void;
  generateNewNickname: () => void;
  completeWelcome: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [collectCount, setCollectCount] = useState(0);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const savedUserId = await storage.get(STORAGE_KEYS.USER_ID);
    const savedNickname = await storage.get(STORAGE_KEYS.NICKNAME);
    const savedAvatar = await storage.get(STORAGE_KEYS.AVATAR);
    const firstLaunch = await storage.get(STORAGE_KEYS.FIRST_LAUNCH);

    if (savedUserId && savedNickname && savedAvatar) {
      setUserId(savedUserId);
      setNickname(savedNickname);
      setAvatar(savedAvatar);
      setIsFirstLaunch(false);
    } else {
      const newUserId = generateUUID();
      const newNickname = generateRandomNickname();
      const newAvatar = generateRandomAvatar();

      setUserId(newUserId);
      setNickname(newNickname);
      setAvatar(newAvatar);
      setIsFirstLaunch(firstLaunch !== 'false');
    }
  }

  async function updateProfile(newNickname: string, newAvatar: string) {
    setNickname(newNickname);
    setAvatar(newAvatar);
    await storage.set(STORAGE_KEYS.NICKNAME, newNickname);
    await storage.set(STORAGE_KEYS.AVATAR, newAvatar);
  }

  function generateNewAvatar() {
    const newAvatar = generateRandomAvatar();
    setAvatar(newAvatar);
  }

  function generateNewNickname() {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
  }

  async function completeWelcome() {
    await storage.set(STORAGE_KEYS.USER_ID, userId);
    await storage.set(STORAGE_KEYS.NICKNAME, nickname);
    await storage.set(STORAGE_KEYS.AVATAR, avatar);
    await storage.set(STORAGE_KEYS.FIRST_LAUNCH, 'false');
    setIsFirstLaunch(false);
  }

  const value: UserContextType = {
    userId,
    nickname,
    avatar,
    isFirstLaunch,
    postCount,
    likeCount,
    collectCount,
    updateProfile,
    generateNewAvatar,
    generateNewNickname,
    completeWelcome,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
