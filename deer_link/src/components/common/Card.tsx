// Card Component

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function Card({ children, style, padding = spacing.lg }: CardProps) {
  return <View style={[styles.container, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
});
