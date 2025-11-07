// Quick Action Grid - 精确按Figma还原（所有尺寸除以2）

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  labelKey: string;
  onPress: () => void;
  backgroundColor?: string;
}

interface QuickActionGridProps {
  actions: QuickAction[];
}

export default function QuickActionGrid({ actions }: QuickActionGridProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        height: 55,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingVertical: 6,
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
            paddingHorizontal: 4,
          }}
        >
          {/* 图标容器 - 68x68/2 = 34x34，带背景色 */}
          <View
            style={{
              width: 34,
              height: 34,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: action.backgroundColor || 'transparent',
              borderRadius: 8,
            }}
          >
            {action.icon}
          </View>

          {/* 文本 - 24px/2 = 12px Regular, lineHeight 16px (1.33倍) */}
          <Text
            style={{
              fontFamily: 'Noto Sans CJK SC',
              fontWeight: '400',
              fontSize: 12,
              lineHeight: 16,
              color: '#3a3c43',
              textAlign: 'center',
              marginTop: 6,
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
