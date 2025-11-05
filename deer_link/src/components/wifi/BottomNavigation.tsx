// 底部导航栏 - 按Figma设计

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, scaleFont } from '../../utils/scale';

interface BottomNavigationProps {
  activeTab?: 'home' | 'square' | 'profile';
  onTabPress?: (tab: 'home' | 'square' | 'profile') => void;
}

export default function BottomNavigation({
  activeTab = 'home',
  onTabPress,
}: BottomNavigationProps) {
  const { t } = useTranslation();

  const handleTabPress = (tab: 'home' | 'square' | 'profile') => {
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        height: scale(136),
        borderTopLeftRadius: scale(20),
        borderTopRightRadius: scale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: scale(54),
        paddingTop: scale(9),
      }}
    >
      {/* 首页 Tab */}
      <TouchableOpacity
        onPress={() => handleTabPress('home')}
        activeOpacity={0.7}
        style={{
          width: scale(100),
          height: scale(80),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 首页图标 */}
        <View style={{ width: scale(56), height: scale(56), marginBottom: scale(4) }}>
          <Text style={{ fontSize: scaleFont(40), textAlign: 'center' }}>🏠</Text>
        </View>
        <Text
          style={{
            fontFamily: 'Noto Sans CJK SC',
            fontWeight: activeTab === 'home' ? '500' : '400',
            fontSize: scaleFont(20),
            color: '#1c1c1c',
          }}
        >
          首页
        </Text>
      </TouchableOpacity>

      {/* 广场 Tab */}
      <TouchableOpacity
        onPress={() => handleTabPress('square')}
        activeOpacity={0.7}
        style={{
          width: scale(100),
          height: scale(80),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 广场图标 */}
        <View style={{ width: scale(56), height: scale(56), marginBottom: scale(4) }}>
          <View
            style={{
              width: scale(56),
              height: scale(56),
              borderRadius: scale(28),
              backgroundColor: '#f0f0f0',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleFont(32) }}>▶️</Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: 'Source Han Sans CN',
            fontWeight: activeTab === 'square' ? '500' : '400',
            fontSize: scaleFont(20),
            color: '#1c1c1c',
          }}
        >
          广场
        </Text>
      </TouchableOpacity>

      {/* 我的 Tab */}
      <TouchableOpacity
        onPress={() => handleTabPress('profile')}
        activeOpacity={0.7}
        style={{
          width: scale(100),
          height: scale(80),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 我的图标 */}
        <View style={{ width: scale(56), height: scale(56), marginBottom: scale(4) }}>
          <View
            style={{
              width: scale(56),
              height: scale(56),
              borderRadius: scale(28),
              backgroundColor: '#2196F3',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: scaleFont(32), color: 'white' }}>👤</Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: 'Source Han Sans CN',
            fontWeight: activeTab === 'profile' ? '500' : '400',
            fontSize: scaleFont(20),
            color: '#1c1c1c',
          }}
        >
          我的
        </Text>
      </TouchableOpacity>
    </View>
  );
}
