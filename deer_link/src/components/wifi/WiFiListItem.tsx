// WiFi Network List Item Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';
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
      style={[styles.container, network.isConnected && styles.containerConnected]}
      onPress={() => !network.isConnected && onConnect(network.ssid)}
      disabled={network.isConnected}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getSignalIcon()}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.ssid}>{network.ssid}</Text>
        <Text style={styles.signal}>{getSignalText()}</Text>
      </View>

      {network.isConnected ? (
        <View style={styles.connectedBadge}>
          <Text style={styles.connectedText}>{t('wifi.connected')}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.connectButton} onPress={() => onConnect(network.ssid)}>
          <Text style={styles.connectText}>{t('wifi.connect')}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
  },
  containerConnected: {
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  ssid: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  signal: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  connectButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  connectText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: '600',
  },
  connectedBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.status.success,
    borderRadius: borderRadius.md,
  },
  connectedText: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: '600',
  },
});
