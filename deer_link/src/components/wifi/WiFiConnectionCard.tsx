// WiFi Connection Card Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface WiFiConnectionCardProps {
  isConnected: boolean;
  networkName?: string;
  onConnect: () => void;
}

export default function WiFiConnectionCard({
  isConnected,
  networkName,
  onConnect,
}: WiFiConnectionCardProps) {
  const { t } = useTranslation();

  return (
    <View className="bg-white rounded-lg p-lg mx-lg mt-lg flex-row items-center justify-between ios:shadow-md-rn android:elevation-3">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-md bg-background items-center justify-center mr-md">
          <Text className="text-2xl">📶</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base text-text-primary font-medium">
            {isConnected
              ? t('wifi.status.connected_to', { network: networkName })
              : t('wifi.status.not_connected')}
          </Text>
          {isConnected && (
            <Text className="text-sm text-text-secondary mt-xs">{t('wifi.status.signal_good')}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity className="bg-primary px-lg py-sm rounded-md" onPress={onConnect}>
        <Text className="text-base text-white font-semibold">
          {isConnected ? t('wifi.disconnect') : t('wifi.quick_connect')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
