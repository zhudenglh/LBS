// Bus Information Component

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface BusInfoProps {
  busLine: string;
  currentStation: string;
  nextStation: string;
  stationsLeft?: number;
}

export default function BusInfo({ busLine, currentStation, nextStation, stationsLeft }: BusInfoProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-primary p-lg rounded-lg mb-lg">
      <Text className="text-xl font-bold text-white mb-md">{busLine}</Text>

      <View className="flex-row items-center justify-between mb-md">
        <View className="flex-1">
          <Text className="text-sm text-white opacity-80 mb-xs">{t('home.bus.current_station')}</Text>
          <Text className="text-lg font-semibold text-white">{currentStation}</Text>
        </View>

        <View className="mx-md">
          <Text className="text-2xl text-white">→</Text>
        </View>

        <View className="flex-1">
          <Text className="text-sm text-white opacity-80 mb-xs">{t('home.bus.next_station')}</Text>
          <Text className="text-lg font-semibold text-white">{nextStation}</Text>
        </View>
      </View>

      {stationsLeft !== undefined && (
        <View className="mt-sm">
          <View className="h-1 bg-white/30 rounded-sm mb-xs">
            <View className="h-full bg-white rounded-sm" style={{ width: '30%' }} />
          </View>
          <Text className="text-sm text-white opacity-90">
            {t('home.bus.stations_left', { count: stationsLeft })}
          </Text>
        </View>
      )}
    </View>
  );
}
