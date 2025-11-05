// Input Component

import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View className="mb-md">
      {label && <Text className="text-md font-semibold text-text-primary mb-sm">{label}</Text>}
      <TextInput
        className={`bg-white border rounded-md p-lg text-md text-text-primary ${
          error ? 'border-error' : 'border-border'
        }`}
        placeholderTextColor="#999999"
        style={style}
        {...props}
      />
      {error && <Text className="text-sm text-error mt-xs">{error}</Text>}
    </View>
  );
}
