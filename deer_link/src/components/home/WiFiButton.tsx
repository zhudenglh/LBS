// WiFi Connection Button Component

import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

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
      style={[
        styles.container,
        isConnected && styles.containerConnected,
      ]}
      onPress={handlePress}
      disabled={isConnecting || isConnected}
      activeOpacity={0.7}
    >
      {isConnecting ? (
        <ActivityIndicator color={colors.primary} style={styles.icon} />
      ) : (
        <Text style={styles.icon}>{getIcon()}</Text>
      )}
      <Text style={[styles.text, isConnected && styles.textConnected]}>
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  containerConnected: {
    backgroundColor: `${colors.status.success}10`,
    borderWidth: 1,
    borderColor: colors.status.success,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  textConnected: {
    color: colors.status.success,
  },
});
