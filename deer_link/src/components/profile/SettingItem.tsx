// Setting Item Component

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  value: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#999999',
  },
});
