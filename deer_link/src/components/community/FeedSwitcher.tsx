import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@constants/theme';

export type FeedType = 'home' | 'hot' | 'news';

interface FeedSwitcherProps {
  currentFeed: FeedType;
  onFeedChange: (feed: FeedType) => void;
}

export default function FeedSwitcher({ currentFeed, onFeedChange }: FeedSwitcherProps) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const feedOptions: { value: FeedType; label: string }[] = [
    { value: 'home', label: t('feed.home') },
    { value: 'hot', label: t('feed.hot') },
    { value: 'news', label: t('feed.news') },
  ];

  const currentLabel = feedOptions.find((f) => f.value === currentFeed)?.label || t('feed.home');

  function handleSelect(feed: FeedType) {
    onFeedChange(feed);
    setModalVisible(false);
  }

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        className="flex-row items-center px-3 py-2"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text className="text-lg font-bold text-text-primary mr-1">{currentLabel}</Text>
        <Text className="text-sm text-text-secondary">▼</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.5)] justify-start pt-[60px] pl-4"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-md w-[160px] overflow-hidden">
            {feedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`flex-row items-center justify-between py-3 px-4 border-b border-border ${currentFeed === option.value ? 'bg-background' : ''}`}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base ${currentFeed === option.value ? 'font-bold text-primary' : 'text-text-primary'}`}
                >
                  {option.label}
                </Text>
                {currentFeed === option.value && (
                  <Text className="text-base text-primary">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
