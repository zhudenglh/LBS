// Bus Line Selector Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';
import { BUS_LINES } from '@constants/config';

interface BusSelectorProps {
  selectedBus: string;
  onSelectBus: (bus: string) => void;
}

export default function BusSelector({ selectedBus, onSelectBus }: BusSelectorProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('discover.post.select_bus')}</Text>
      <View style={styles.busList}>
        {BUS_LINES.map((bus) => (
          <TouchableOpacity
            key={bus}
            style={[styles.busItem, selectedBus === bus && styles.busItemSelected]}
            onPress={() => onSelectBus(selectedBus === bus ? '' : bus)}
          >
            <Text style={[styles.busText, selectedBus === bus && styles.busTextSelected]}>
              {bus}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  busList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  busItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  busItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  busText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  busTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
