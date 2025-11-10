// Loading Spinner Component

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { colors } from '@constants/theme';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ text, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 justify-center items-center p-6">
      <ActivityIndicator size={size} color={colors.primary} />
      {text && <Text className="text-base text-text-secondary mt-3">{text}</Text>}
    </View>
  );
}
