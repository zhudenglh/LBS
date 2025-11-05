// Setting Item Component

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, fontSize } from '@constants/theme';

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
}

export default function SettingItem({ icon, label, value, onPress, showArrow = true }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      {value && <Text style={styles.value}>{value}</Text>}
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  label: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  value: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  arrow: {
    fontSize: 24,
    color: colors.text.disabled,
  },
});
