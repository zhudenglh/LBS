// Tag Component

import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

interface TagProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Tag({ label, variant = 'primary', style, textStyle }: TagProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return `${colors.primary}20`;
      case 'secondary':
        return `${colors.secondary}20`;
      case 'success':
        return `${colors.status.success}20`;
      case 'warning':
        return `${colors.status.warning}20`;
      default:
        return colors.background;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      default:
        return colors.text.primary;
    }
  };

  return (
    <Text
      style={[
        styles.tag,
        { backgroundColor: getBackgroundColor(), color: getTextColor() },
        style,
        textStyle,
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
});
