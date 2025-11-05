// WiFi Connection Button Component

import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

interface WiFiButtonProps {
  onPress: () => void;
}

export default function WiFiButton({ onPress }: WiFiButtonProps) {
  const { t } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handlePress = async () => {
    if (isConnected) return;

    setIsConnecting(true);

    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      onPress();
    }, 2000);
  };

  const getButtonText = () => {
    if (isConnecting) return t('home.wifi.connecting');
    if (isConnected) return t('home.wifi.connected');
    return t('home.wifi.connect_button');
  };

  const getIcon = () => {
    if (isConnected) return '✅';
    return '📶';
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center bg-white p-lg rounded-lg mb-lg ${isConnected ? 'bg-success/10 border border-success' : ''}`}
      onPress={handlePress}
      disabled={isConnecting || isConnected}
      activeOpacity={0.7}
    >
      {isConnecting ? (
        <ActivityIndicator color="#0285f0" className="mr-md" size={24} />
      ) : (
        <Text className="text-2xl mr-md">{getIcon()}</Text>
      )}
      <Text className={`text-lg font-semibold ${isConnected ? 'text-success' : 'text-primary'}`}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}
