// Quick Action Grid Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface QuickAction {
  id: string;
  icon: string;
  labelKey: string;
  onPress: () => void;
}

interface QuickActionGridProps {
  actions: QuickAction[];
}

export default function QuickActionGrid({ actions }: QuickActionGridProps) {
  const { t } = useTranslation();

  return (
    <View className="flex-row justify-between px-lg mt-lg">
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          className="items-center w-[22%]"
          onPress={action.onPress}
        >
          <View className="w-14 h-14 rounded-md bg-white items-center justify-center mb-sm ios:shadow-sm-rn android:elevation-2">
            <Text className="text-3xl">{action.icon}</Text>
          </View>
          <Text className="text-sm text-text-primary text-center">{t(action.labelKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
