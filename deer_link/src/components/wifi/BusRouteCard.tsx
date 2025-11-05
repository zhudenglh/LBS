// Bus Route Card Component

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface BusRouteCardProps {
  routeName: string;
  currentStation?: string;
  nextStation?: string;
}

export default function BusRouteCard({
  routeName,
  currentStation,
  nextStation,
}: BusRouteCardProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-lg p-lg mx-lg mt-lg ios:shadow-md-rn android:elevation-3">
      <View className="flex-row items-center">
        <Text className="text-2xl mr-sm">🚌</Text>
        <Text className="text-lg font-semibold text-text-primary flex-1">
          {t('wifi.bus.welcome_message', { route: routeName })}
        </Text>
      </View>
      {currentStation && nextStation && (
        <View className="mt-md pt-md border-t border-border">
          <View className="flex-row justify-between mb-sm">
            <Text className="text-sm text-text-secondary">{t('home.bus.current_station')}</Text>
            <Text className="text-sm text-text-primary font-medium">{currentStation}</Text>
          </View>
          <View className="flex-row justify-between mb-sm">
            <Text className="text-sm text-text-secondary">{t('home.bus.next_station')}</Text>
            <Text className="text-sm text-text-primary font-medium">{nextStation}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
