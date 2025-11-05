// Bus Line Selector Component

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BUS_LINES } from '@constants/config';

interface BusSelectorProps {
  selectedBus: string;
  onSelectBus: (bus: string) => void;
}

export default function BusSelector({ selectedBus, onSelectBus }: BusSelectorProps) {
  const { t } = useTranslation();

  return (
    <View className="mb-md">
      <Text className="text-base text-text-primary mb-sm font-semibold">
        {t('discover.post.select_bus')}
      </Text>
      <View className="flex-row flex-wrap gap-sm">
        {BUS_LINES.map((bus) => (
          <TouchableOpacity
            key={bus}
            className={`px-lg py-sm rounded-md border ${
              selectedBus === bus
                ? 'bg-primary border-primary'
                : 'bg-white border-border'
            }`}
            onPress={() => onSelectBus(selectedBus === bus ? '' : bus)}
          >
            <Text
              className={`text-base ${
                selectedBus === bus
                  ? 'text-white font-bold'
                  : 'text-text-primary'
              }`}
            >
              {bus}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
