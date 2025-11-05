// Bus Route Card Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🚌</Text>
        <Text style={styles.title}>
          {t('wifi.bus.welcome_message', { route: routeName })}
        </Text>
      </View>
      {currentStation && nextStation && (
        <View style={styles.stationInfo}>
          <View style={styles.stationRow}>
            <Text style={styles.stationLabel}>{t('home.bus.current_station')}</Text>
            <Text style={styles.stationName}>{currentStation}</Text>
          </View>
          <View style={styles.stationRow}>
            <Text style={styles.stationLabel}>{t('home.bus.next_station')}</Text>
            <Text style={styles.stationName}>{nextStation}</Text>
          </View>
        </View>
      )}
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
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: fontSize.xxl,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  stationInfo: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stationLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  stationName: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
