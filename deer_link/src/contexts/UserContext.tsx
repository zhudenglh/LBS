// User Context for Global User State

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@utils/storage';
import { generateRandomAvatar, generateRandomNickname, generateUUID } from '@utils/avatar';
import { STORAGE_KEYS } from '@constants/config';
import { register, login } from '@api/auth';

interface UserContextType {
  userId: string;
  nickname: string;
  avatar: string;
  token: string | null;
  isFirstLaunch: boolean;
  isLoggedIn: boolean;
  postCount: number;
  likeCount: number;
  collectCount: number;
  updateProfile: (nickname: string, avatar: string) => Promise<void>;
  generateNewAvatar: () => void;
  generateNewNickname: () => void;
  completeWelcome: () => Promise<void>;
  registerWithEmail: (data: {
    email: string;
    password: string;
    nickname: string;
    gender?: number;
    age?: number;
  }) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const savedToken = await storage.get(STORAGE_KEYS.TOKEN);
    const firstLaunch = await storage.get(STORAGE_KEYS.FIRST_LAUNCH);

    if (savedUserId && savedNickname && savedAvatar && savedToken) {
      // 已登录用户
      setUserId(savedUserId);
      setNickname(savedNickname);
      setAvatar(savedAvatar);
      setToken(savedToken);
      setIsLoggedIn(true);
      setIsFirstLaunch(false);
    } else {
      // 未登录用户 - 生成临时数据
      const tempNickname = generateRandomNickname();
      const tempAvatar = generateRandomAvatar();

      setNickname(tempNickname);
      setAvatar(tempAvatar);
      setIsLoggedIn(false);
      setIsFirstLaunch(firstLaunch !== 'false');
    }
  }

  async function registerWithEmail(data: {
    phone: string;
    email?: string;
    password: string;
    nickname: string;
    avatar?: string;
    gender?: number;
    age?: number;
  }) {
    // 如果没有提供头像，生成默认头像
    const finalAvatar = data.avatar || generateRandomAvatar();

    const response = await register({
      phone: data.phone,
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      avatar: finalAvatar,
      gender: data.gender,
      age: data.age,
    });

    // 保存用户信息
    await storage.set(STORAGE_KEYS.USER_ID, response.user_id);
    await storage.set(STORAGE_KEYS.TOKEN, response.token);
    await storage.set(STORAGE_KEYS.NICKNAME, data.nickname);
    await storage.set(STORAGE_KEYS.AVATAR, finalAvatar);

    setUserId(response.user_id);
    setNickname(data.nickname);
    setAvatar(finalAvatar);
    setToken(response.token);
    setIsLoggedIn(true);
  }

  async function loginWithEmail(account: string, password: string) {
    // 判断是手机号还是邮箱
    const isPhone = /^1[3-9]\d{9}$/.test(account);

    const response = await login(
      isPhone
        ? { phone: account, password }
        : { email: account, password }
    );

    // 保存用户信息
    await storage.set(STORAGE_KEYS.USER_ID, response.user_id);
    await storage.set(STORAGE_KEYS.TOKEN, response.token);
    await storage.set(STORAGE_KEYS.NICKNAME, response.nickname);
    await storage.set(STORAGE_KEYS.AVATAR, response.avatar);

    setUserId(response.user_id);
    setNickname(response.nickname);
    setAvatar(response.avatar);
    setToken(response.token);
    setIsLoggedIn(true);
  }

  async function updateProfile(newNickname: string, newAvatar: string) {
    setNickname(newNickname);
    setAvatar(newAvatar);
    await storage.set(STORAGE_KEYS.NICKNAME, newNickname);
    // 只在 avatar 有值时才保存
    if (newAvatar) {
      await storage.set(STORAGE_KEYS.AVATAR, newAvatar);
    }
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
    token,
    isFirstLaunch,
    isLoggedIn,
    postCount,
    likeCount,
    collectCount,
    updateProfile,
    generateNewAvatar,
    generateNewNickname,
    completeWelcome,
    registerWithEmail,
    loginWithEmail,
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
