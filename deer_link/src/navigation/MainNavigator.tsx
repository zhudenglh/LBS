// Main Tab Navigator - Updated with all screens

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import HomeScreen from '@screens/HomeScreen';
import DiscoverScreen from '@screens/DiscoverScreen';
import WiFiScreen from '@screens/WiFiScreen';
import FavoriteScreen from '@screens/FavoriteScreen';
import ProfileScreen from '@screens/ProfileScreen';
import AIChatScreen from '@screens/AIChatScreen';
import MyPostsScreen from '@screens/MyPostsScreen';
import { colors, fontSize } from '@constants/theme';
import type { MainTabParamList } from '@types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator();

// Profile Stack Navigator
function ProfileStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: t('nav.discover'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="WiFi"
        component={WiFiScreen}
        options={{
          title: t('nav.wifi'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📶</Text>,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          title: t('nav.favorite'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⭐</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
