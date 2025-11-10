import React from 'react';
import { View, Text } from 'react-native';

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
      className={`rounded-xl self-start ${isSmall ? 'px-2 py-[3px]' : 'px-[10px] py-1'}`}
      style={{ backgroundColor: colors.bg }}
    >
      <Text
        className={`font-medium ${isSmall ? 'text-[11px]' : 'text-xs'}`}
        style={{ color: colors.text }}
      >
        圈/{text}
      </Text>
    </View>
  );
}
