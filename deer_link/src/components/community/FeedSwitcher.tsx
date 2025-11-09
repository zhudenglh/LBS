import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

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
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText}>{currentLabel}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {feedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  currentFeed === option.value && styles.optionActive,
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    currentFeed === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {currentFeed === option.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  triggerText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  arrow: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingLeft: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    width: 160,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  optionTextActive: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkmark: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
});
