import React, { useState } from 'react';
import { View, ScrollView, Alert, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCard from '../components/profile/StatsCard';
import SettingItem from '../components/profile/SettingItem';
import LanguageSelector from '../components/profile/LanguageSelector';
import RegisterScreen from './RegisterScreen';
import { useUser } from '@contexts/UserContext';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { nickname, avatar, userId, postCount, likeCount, collectCount, isLoggedIn } = useUser();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleEditProfile = () => {
    Alert.alert(t('profile.edit_profile'), t('profile.edit_profile_coming_soon'));
  };

  const handleMyPosts = () => {
    navigation.navigate('MyPosts' as never);
  };

  const handleLanguageSettings = () => {
    setShowLanguageSelector(true);
  };

  const handleSettings = () => {
    Alert.alert(t('profile.settings'), t('profile.settings_coming_soon'));
  };

  const getLanguageDisplayName = () => {
    const languageMap: Record<string, string> = {
      zh: '中文',
      en: 'English',
      id: 'Bahasa Indonesia',
    };
    return languageMap[i18n.language] || '中文';
  };

  return (
    <ScrollView className="flex-1 bg-[#F5F5F5]">
      <ProfileHeader
        avatar={avatar}
        nickname={nickname}
        userId={userId}
        onEditPress={handleEditProfile}
      />

      <StatsCard
        posts={postCount}
        likes={likeCount}
        collects={collectCount}
        onPostsPress={handleMyPosts}
      />

      {/* 未登录时显示注册/登录提示 */}
      {!isLoggedIn && (
        <View className="mx-4 mt-4 mb-2">
          <SettingItem
            icon="🔐"
            label="注册/登录账号"
            value="解锁更多功能"
            onPress={() => setShowRegisterModal(true)}
          />
        </View>
      )}

      <View className="mt-4">
        <SettingItem
          icon="📝"
          label={t('profile.my_posts')}
          onPress={handleMyPosts}
        />
        <SettingItem
          icon="⚙️"
          label={t('profile.settings')}
          onPress={handleSettings}
        />
        <SettingItem
          icon="🌐"
          label={t('profile.language')}
          value={getLanguageDisplayName()}
          onPress={handleLanguageSettings}
        />
      </View>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      {/* 注册Modal */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRegisterModal(false)}
      >
        <RegisterScreen
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            Alert.alert('提示', '注册成功！现在可以发布帖子了。');
          }}
        />
      </Modal>
    </ScrollView>
  );
}
