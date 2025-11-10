// WiFi Network List Item Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { WiFiNetwork } from '@types';

interface WiFiListItemProps {
  network: WiFiNetwork;
  onConnect: (ssid: string) => void;
}

export default function WiFiListItem({ network, onConnect }: WiFiListItemProps) {
  const { t } = useTranslation();

  const getSignalIcon = () => {
    switch (network.signal) {
      case 'strong':
        return '📶';
      case 'medium':
        return '📡';
      case 'weak':
        return '📉';
      default:
        return '📶';
    }
  };

  const getSignalText = () => {
    switch (network.signal) {
      case 'strong':
        return t('wifi.signal_strong');
      case 'weak':
        return t('wifi.signal_weak');
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 mb-3 rounded-md ${network.isConnected ? 'bg-[rgba(33,150,243,0.06)] border border-primary' : 'bg-white'}`}
      onPress={() => !network.isConnected && onConnect(network.ssid)}
      disabled={network.isConnected}
    >
      <View className="mr-3">
        <Text className="text-3xl">{getSignalIcon()}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-text-primary mb-1">{network.ssid}</Text>
        <Text className="text-sm text-text-secondary">{getSignalText()}</Text>
      </View>

      {network.isConnected ? (
        <View className="px-4 py-2 bg-status-success rounded-md">
          <Text className="text-sm text-white font-semibold">{t('wifi.connected')}</Text>
        </View>
      ) : (
        <TouchableOpacity className="px-4 py-2 bg-primary rounded-md" onPress={() => onConnect(network.ssid)}>
          <Text className="text-sm text-white font-semibold">{t('wifi.connect')}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
