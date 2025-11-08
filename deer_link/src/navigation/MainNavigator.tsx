// Main Tab Navigator - Updated with all screens

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import BusPageScreenNew from '@screens/BusPageScreenNew';  // 新的公交页面（完全按Figma还原）
import LocalScreen from '@screens/LocalScreen';
import DiscoverScreen from '@screens/DiscoverScreen';  // 社区页面
import FavoriteScreen from '@screens/FavoriteScreen';
import ProfileScreen from '@screens/ProfileScreen';
import AIChatScreen from '@screens/AIChatScreen';
import MyPostsScreen from '@screens/MyPostsScreen';
import type { MainTabParamList } from '@types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

// Navigation theme colors matching tailwind.config.js
const NAV_COLORS = {
  primary: '#0285f0',
  white: '#FFFFFF',
  border: '#E0E0E0',
  textDisabled: '#999999',
};

// Profile Stack Navigator
function ProfileStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: NAV_COLORS.primary },
        headerTintColor: NAV_COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: t('nav.profile') }}
      />
      <Stack.Screen
        name="MyPosts"
        component={MyPostsScreen}
        options={{ title: t('profile.my_posts') }}
      />
      <Stack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ title: t('home.ai_chat.title') }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: NAV_COLORS.primary,
        tabBarInactiveTintColor: NAV_COLORS.textDisabled,
        tabBarStyle: {
          backgroundColor: NAV_COLORS.white,
          borderTopColor: NAV_COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
        headerStyle: {
          backgroundColor: NAV_COLORS.primary,
        },
        headerTintColor: NAV_COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={LocalScreen}
        options={{
          title: t('nav.home'),
          tabBarIcon: () => <Text className="text-xl">🏠</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Bus"
        component={BusPageScreenNew}  // 使用新的公交页面（完全按Figma还原）
        options={{
          title: t('nav.home'),
          tabBarButton: () => null, // 隐藏此tab按钮，不在底部显示
          tabBarStyle: { display: 'none' }, // 隐藏整个Tab栏
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: t('nav.discover'),
          tabBarIcon: () => <Text className="text-xl">🔍</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: t('nav.favorite'),
          tabBarIcon: () => <Text className="text-xl">⭐</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: t('nav.profile'),
          tabBarIcon: () => <Text className="text-xl">👤</Text>,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
