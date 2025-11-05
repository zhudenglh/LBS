// Quick Action Grid - 精确按Figma还原（响应式适配）

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, scaleFont } from '../../utils/scale';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  labelKey: string;
  onPress: () => void;
}

interface QuickActionGridProps {
  actions: QuickAction[];
}

export default function QuickActionGrid({ actions }: QuickActionGridProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        height: scale(110),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingVertical: scale(12),
      }}
    >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          onPress={action.onPress}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: scale(8),
          }}
        >
          {/* 图标容器 - 68x68 */}
          <View
            style={{
              width: scale(68),
              height: scale(68),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {action.icon}
          </View>

          {/* 文本 - 24px Regular, lineHeight 24px */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '400',
              fontSize: scaleFont(24),
              lineHeight: scaleFont(24),
              color: '#3a3c43',
              textAlign: 'center',
              marginTop: scale(12),
            }}
            numberOfLines={1}
          >
            {t(action.labelKey)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
