import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FlairBadgeProps {
  text: string;
  variant?: 'tech' | 'travel' | 'food' | 'gaming' | 'science' | 'music' | 'default';
  size?: 'small' | 'medium';
}

const FLAIR_COLORS = {
  tech: { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
  travel: { bg: '#D1FAE5', text: '#047857', dot: '#10B981' },
  food: { bg: '#FED7AA', text: '#C2410C', dot: '#F97316' },
  gaming: { bg: '#E9D5FF', text: '#7E22CE', dot: '#A855F7' },
  science: { bg: '#CFFAFE', text: '#0E7490', dot: '#06B6D4' },
  music: { bg: '#FCE7F3', text: '#BE185D', dot: '#EC4899' },
  default: { bg: '#F3F4F6', text: '#374151', dot: '#6B7280' },
};

export default function FlairBadge({ text, variant = 'default', size = 'medium' }: FlairBadgeProps) {
  const colors = FLAIR_COLORS[variant];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
        isSmall ? styles.containerSmall : styles.containerMedium,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          isSmall ? styles.textSmall : styles.textMedium,
        ]}
      >
        圈/{text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '500',
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 12,
  },
});
