import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

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
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(filter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {t(`filter.${filter}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.white,
  },
});
