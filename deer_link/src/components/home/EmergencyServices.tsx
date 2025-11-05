// Emergency Services Component

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

type ServiceType = 'toilet' | 'store' | 'pharmacy' | 'bank';

interface EmergencyServicesProps {
  onServicePress?: (type: ServiceType, place: string) => void;
}

const SERVICE_ICONS: Record<ServiceType, string> = {
  toilet: '🚻',
  store: '🏪',
  pharmacy: '💊',
  bank: '🏦',
};

// Service place keys for translations
const SERVICE_PLACE_KEYS: Record<ServiceType, Array<{ key: string; distance: string }>> = {
  toilet: [
    { key: 'xinjiekou_metro', distance: '50m' },
    { key: 'deji_plaza', distance: '120m' },
    { key: 'central_mall', distance: '200m' },
  ],
  store: [
    { key: 'familymart', distance: '80m' },
    { key: 'seven_eleven', distance: '150m' },
    { key: 'lawson', distance: '250m' },
  ],
  pharmacy: [
    { key: 'laobaixing', distance: '100m' },
    { key: 'yifeng', distance: '180m' },
    { key: 'guoyao', distance: '300m' },
  ],
  bank: [
    { key: 'icbc_atm', distance: '60m' },
    { key: 'ccb_atm', distance: '140m' },
    { key: 'abc_atm', distance: '220m' },
  ],
};

export default function EmergencyServices({ onServicePress }: EmergencyServicesProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ServiceType>('toilet');

  const services: ServiceType[] = ['toilet', 'store', 'pharmacy', 'bank'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.emergency.title')}</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {services.map((service) => (
          <TouchableOpacity
            key={service}
            style={[styles.tab, activeTab === service && styles.tabActive]}
            onPress={() => setActiveTab(service)}
          >
            <Text style={styles.tabIcon}>{SERVICE_ICONS[service]}</Text>
            <Text style={[styles.tabText, activeTab === service && styles.tabTextActive]}>
              {t(`home.emergency.${service}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {SERVICE_PLACE_KEYS[activeTab].map((item, index) => {
          const placeName = t(`home.emergency.places.${item.key}`);
          return (
            <TouchableOpacity
              key={index}
              style={styles.serviceItem}
              onPress={() => onServicePress?.(activeTab, placeName)}
            >
              <Text style={styles.serviceName}>{placeName}</Text>
              <Text style={styles.serviceDistance}>{item.distance}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  tabText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceName: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  serviceDistance: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});
