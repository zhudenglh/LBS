// Bus Information Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

interface BusInfoProps {
  busLine: string;
  currentStation: string;
  nextStation: string;
  stationsLeft?: number;
}

export default function BusInfo({ busLine, currentStation, nextStation, stationsLeft }: BusInfoProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.busLine}>{busLine}</Text>

      <View style={styles.stationRow}>
        <View style={styles.stationItem}>
          <Text style={styles.stationLabel}>{t('home.bus.current_station')}</Text>
          <Text style={styles.stationName}>{currentStation}</Text>
        </View>

        <View style={styles.arrow}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>

        <View style={styles.stationItem}>
          <Text style={styles.stationLabel}>{t('home.bus.next_station')}</Text>
          <Text style={styles.stationName}>{nextStation}</Text>
        </View>
      </View>

      {stationsLeft !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>
            {t('home.bus.stations_left', { count: stationsLeft })}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  busLine: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.md,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  stationItem: {
    flex: 1,
  },
  stationLabel: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  stationName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.white,
  },
  arrow: {
    marginHorizontal: spacing.md,
  },
  arrowIcon: {
    fontSize: 24,
    color: colors.white,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 2,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.9,
  },
});
