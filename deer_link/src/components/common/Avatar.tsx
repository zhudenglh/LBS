// Avatar Component

import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface AvatarProps {
  emoji: string;
  size?: number;
  style?: ViewStyle;
}

export default function Avatar({ emoji, size = 40, style }: AvatarProps) {
  return (
    <View
      className="bg-background items-center justify-center border border-border"
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <Text style={{ fontSize: size * 0.6, lineHeight: undefined }}>{emoji}</Text>
    </View>
  );
}
