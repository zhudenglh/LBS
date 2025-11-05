// Card Component

import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function Card({ children, style, padding = 16 }: CardProps) {
  return (
    <View
      className="bg-white rounded-md ios:shadow-md-rn android:elevation-3"
      style={[{ padding }, style]}
    >
      {children}
    </View>
  );
}
