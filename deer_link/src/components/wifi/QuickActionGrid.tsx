// Quick Action Grid Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

interface QuickAction {
  id: string;
  icon: string;
  labelKey: string;
  onPress: () => void;
}

interface QuickActionGridProps {
  actions: QuickAction[];
}

export default function QuickActionGrid({ actions }: QuickActionGridProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={action.onPress}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{action.icon}</Text>
          </View>
          <Text style={styles.label}>{t(action.labelKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  icon: {
    fontSize: fontSize.xxxl,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
