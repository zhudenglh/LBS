import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius, shadows } from '@constants/theme';

export type ViewType = 'hot' | 'saved' | 'news';

interface CommunityHeaderProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearchPress?: () => void;
  onAvatarPress?: () => void;
  userAvatar?: string;
}

export default function CommunityHeader({
  selectedView,
  onViewChange,
  onSearchPress,
  onAvatarPress,
  userAvatar = 'https://images.unsplash.com/photo-1591461283504-48919ae873f8?w=200',
}: CommunityHeaderProps) {
  const { t } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const views: { value: ViewType; label: string }[] = [
    { value: 'hot', label: t('community.views.hot') },
    { value: 'saved', label: t('community.views.saved') },
    { value: 'news', label: t('community.views.news') },
  ];

  function handleViewSelect(view: ViewType) {
    onViewChange(view);
    setDropdownVisible(false);
  }

  const currentLabel = views.find((v) => v.value === selectedView)?.label || '热门';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left: Dropdown Menu */}
        <TouchableOpacity
          style={styles.dropdownTrigger}
          onPress={() => setDropdownVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{currentLabel}</Text>
          <Text style={styles.chevron}>▼</Text>
        </TouchableOpacity>

        {/* Right: Search and Avatar */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7}>
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdown}>
            {views.map((view) => (
              <TouchableOpacity
                key={view.value}
                style={[
                  styles.dropdownItem,
                  selectedView === view.value && styles.dropdownItemActive,
                ]}
                onPress={() => handleViewSelect(view.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedView === view.value && styles.dropdownItemTextActive,
                  ]}
                >
                  {view.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 56,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  dropdownText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  searchIcon: {
    fontSize: 22,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 56,
    paddingLeft: spacing.lg,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
    width: 120,
    ...shadows.md,
  },
  dropdownItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.background,
  },
  dropdownItemText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
