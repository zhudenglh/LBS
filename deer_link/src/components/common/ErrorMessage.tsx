// Error Message Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@constants/theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorMessage({ message, onRetry, showRetry = true }: ErrorMessageProps) {
  return (
    <View className="p-6 items-center justify-center">
      <Text className="text-5xl mb-3">❌</Text>
      <Text className="text-base text-center mb-4" style={{ color: colors.status.error }}>
        {message}
      </Text>
      {showRetry && onRetry && (
        <TouchableOpacity className="bg-primary px-6 py-2 rounded-md" onPress={onRetry}>
          <Text className="text-sm text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
