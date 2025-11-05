// Emergency Services Component

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

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
    <View className="mb-xl">
      <Text className="text-lg font-bold text-text-primary mb-md">{t('home.emergency.title')}</Text>

      {/* Tabs */}
      <View className="flex-row mb-md gap-sm">
        {services.map((service) => (
          <TouchableOpacity
            key={service}
            className={`flex-1 items-center p-md rounded-md ${activeTab === service ? 'bg-primary' : 'bg-white'}`}
            onPress={() => setActiveTab(service)}
          >
            <Text className="text-2xl mb-xs">{SERVICE_ICONS[service]}</Text>
            <Text className={`text-xs ${activeTab === service ? 'text-white font-semibold' : 'text-text-secondary'}`}>
              {t(`home.emergency.${service}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="bg-white rounded-md p-sm">
        {SERVICE_PLACE_KEYS[activeTab].map((item, index) => {
          const placeName = t(`home.emergency.places.${item.key}`);
          return (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center p-md border-b border-border"
              onPress={() => onServicePress?.(activeTab, placeName)}
            >
              <Text className="text-base text-text-primary">{placeName}</Text>
              <Text className="text-sm text-text-secondary">{item.distance}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
