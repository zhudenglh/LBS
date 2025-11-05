// Setting Item Component

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
}

export default function SettingItem({ icon, label, value, onPress, showArrow = true }: SettingItemProps) {
  return (
    <TouchableOpacity className="flex-row items-center p-4 bg-white border-b border-[#E5E5E5]" onPress={onPress}>
      <Text className="text-xl mr-3">{icon}</Text>
      <Text className="flex-1 text-base text-[#333333]">{label}</Text>
      {value && <Text className="text-sm text-[#666666] mr-2">{value}</Text>}
      {showArrow && <Text className="text-2xl text-[#999999]">›</Text>}
    </TouchableOpacity>
  );
}
