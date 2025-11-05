// Tag Component

import React from 'react';
import { Text, ViewStyle, TextStyle } from 'react-native';

interface TagProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Tag({ label, variant = 'primary', style, textStyle }: TagProps) {
  const getClassName = () => {
    const baseClasses = 'text-sm font-semibold px-md py-xs rounded-sm';
    const variantClasses = {
      primary: 'bg-primary/20 text-primary',
      secondary: 'bg-secondary/20 text-secondary',
      success: 'bg-success/20 text-success',
      warning: 'bg-warning/20 text-warning',
    }[variant];

    return `${baseClasses} ${variantClasses}`;
  };

  return (
    <Text
      className={getClassName()}
      style={[style, textStyle]}
    >
      {label}
    </Text>
  );
}
