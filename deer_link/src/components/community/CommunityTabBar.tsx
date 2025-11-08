// Community Tab Bar Component

import React from 'react';
import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COMMUNITY_TABS } from '@constants/community';
import { CommunityTab } from '@types';

interface CommunityTabBarProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

export default function CommunityTabBar({
  activeTab,
  onTabChange,
}: CommunityTabBarProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COMMUNITY_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[
                styles.tabItem,
                isActive && styles.tabItemActive,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text style={styles.icon}>{tab.icon}</Text>
                <Text
                  style={[
                    styles.tabText,
                    isActive ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {t(`community.tabs.${tab.key}`)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#0285f0',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  tabText: {
    fontSize: 16,
  },
  tabTextActive: {
    color: '#0285f0',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#999999',
    fontWeight: '400',
  },
});
