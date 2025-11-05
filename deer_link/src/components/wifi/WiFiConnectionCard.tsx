// WiFi Connection Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

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
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📶</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.statusText}>
            {isConnected
              ? t('wifi.status.connected_to', { network: networkName })
              : t('wifi.status.not_connected')}
          </Text>
          {isConnected && (
            <Text style={styles.signalText}>{t('wifi.status.signal_good')}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onConnect}>
        <Text style={styles.buttonText}>
          {isConnected ? t('wifi.disconnect') : t('wifi.quick_connect')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: fontSize.xxl,
  },
  textContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '500',
  },
  signalText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: '600',
  },
});
