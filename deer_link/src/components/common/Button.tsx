// Custom Button Component

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonClassName = () => {
    const baseClasses = 'px-lg py-md rounded-md items-center justify-center min-h-[44px]';
    const variantClasses = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      outline: 'bg-transparent border border-primary',
    }[variant];
    const disabledClasses = disabled || loading ? 'opacity-50' : '';

    return `${baseClasses} ${variantClasses} ${disabledClasses}`;
  };

  const getTextClassName = () => {
    const baseClasses = 'text-md font-semibold';
    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary',
    }[variant];
    const disabledClasses = disabled || loading ? 'text-text-disabled' : '';

    return `${baseClasses} ${variantClasses} ${disabledClasses}`;
  };

  const getActivityIndicatorColor = () => {
    if (variant === 'outline') return '#2196F3'; // primary color
    return '#FFFFFF'; // white
  };

  return (
    <TouchableOpacity
      className={getButtonClassName()}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getActivityIndicatorColor()} />
      ) : (
        <Text className={getTextClassName()} style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
