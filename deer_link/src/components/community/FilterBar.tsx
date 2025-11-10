import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export type FilterType = 'hot' | 'new' | 'top';

interface FilterBarProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({
  selectedFilter,
  onFilterChange,
}: FilterBarProps) {
  const { t } = useTranslation();

  const filters: FilterType[] = ['hot', 'new', 'top'];

  return (
    <View className="bg-white border-b border-border">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            className={`px-3 py-2 rounded-full ${
              selectedFilter === filter ? 'bg-primary' : 'bg-background'
            }`}
            onPress={() => onFilterChange(filter)}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                selectedFilter === filter ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {t(`filter.${filter}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
