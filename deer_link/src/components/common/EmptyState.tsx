// Empty State Component

import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-xl">
      <Text className="text-[64px] mb-lg">{icon}</Text>
      <Text className="text-lg font-semibold text-text-primary mb-sm text-center">{title}</Text>
      {description && <Text className="text-md text-text-secondary text-center">{description}</Text>}
    </View>
  );
}
