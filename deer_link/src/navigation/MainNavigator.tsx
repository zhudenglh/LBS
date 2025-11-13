// Main Tab Navigator - Updated with all screens

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import BusPageScreenNew from '@screens/BusPageFigmaScreen';
import LocalScreen from '@screens/LocalScreen';
import CommunityFeedScreen from '@screens/community/CommunityFeedScreen';  // Reddit-like 社区主页
import SubredditPage from '@screens/community/SubredditPage';  // 圈子详情页面（如南京公交圈）
import PostDetailScreen from '@screens/PostDetailScreen';  // 帖子详情页面
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

// Community/Discover Stack Navigator
function CommunityStack() {
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
        name="CommunityFeed"
        component={CommunityFeedScreen}
        options={{
          title: t('nav.discover'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SubredditPage"
        component={SubredditPage}
        options={{
          title: '南京公交',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          title: '帖子详情',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

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
        component={BusPageScreenNew}
        options={{
          title: t('nav.home'),
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={CommunityStack}
        options={({ route }) => ({
          title: t('nav.discover'),
          tabBarIcon: () => <Text className="text-xl">🔍</Text>,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        })}
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
