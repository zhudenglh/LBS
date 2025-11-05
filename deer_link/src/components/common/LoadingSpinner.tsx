// Loading Spinner Component

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '@constants/theme';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ text, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});
