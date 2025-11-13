import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButtonIcon from '@components/common/BackButtonIcon';

export type ViewType = 'hot' | 'saved' | 'news';

interface CommunityHeaderProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSearchPress?: () => void;
  onAvatarPress?: () => void;
  onBackPress?: () => void;
  userAvatar?: string;
}

export default function CommunityHeader({
  selectedView,
  onViewChange,
  onSearchPress,
  onAvatarPress,
  onBackPress,
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
    <View className="bg-white border-b border-border">
      <View className="flex-row items-center justify-between px-4 h-[56px]">
        {/* Left: Back Button + Dropdown Menu */}
        <View className="flex-row items-center">
          {onBackPress && (
            <TouchableOpacity
              className="mr-2"
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <BackButtonIcon size={32} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex-row items-center gap-2 px-3 py-2 rounded-md"
            onPress={() => setDropdownVisible(true)}
            activeOpacity={0.7}
          >
            <Text className="text-base text-text-primary font-medium">{currentLabel}</Text>
            <Text className="text-[12px] text-text-secondary">▼</Text>
          </TouchableOpacity>
        </View>

        {/* Right: Search and Avatar */}
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="p-2 rounded-md"
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Text className="text-[22px]">🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.7}>
            <Image
              source={{ uri: userAvatar }}
              className="w-8 h-8 rounded-full bg-background"
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
          className="flex-1 bg-[rgba(0,0,0,0.3)] justify-start pt-[56px] pl-4"
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View className="bg-white rounded-md mt-1 ml-3 w-[120px] shadow-md">
            {views.map((view) => (
              <TouchableOpacity
                key={view.value}
                className={`py-3 px-4 border-b border-border ${
                  selectedView === view.value ? 'bg-background' : ''
                }`}
                onPress={() => handleViewSelect(view.value)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm ${
                    selectedView === view.value
                      ? 'text-primary font-semibold'
                      : 'text-text-primary'
                  }`}
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
