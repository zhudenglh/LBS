// Avatar Component

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, fontSize } from '@constants/theme';

interface AvatarProps {
  emoji: string;
  size?: number;
  style?: ViewStyle;
}

export default function Avatar({ emoji, size = 40, style }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    lineHeight: undefined,
  },
});
