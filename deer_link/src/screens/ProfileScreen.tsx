import React, { useState } from 'react';
import { View, ScrollView, Alert, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsCard from '../components/profile/StatsCard';
import SettingItem from '../components/profile/SettingItem';
import LanguageSelector from '../components/profile/LanguageSelector';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import EditProfileScreen from './EditProfileScreen';
import { useUser } from '@contexts/UserContext';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { nickname, avatar, userId, postCount, likeCount, collectCount, isLoggedIn, logout } = useUser();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const handleEditProfile = () => {
    if (!isLoggedIn) {
      Alert.alert('提示', '请先登录', [
        { text: '取消', style: 'cancel' },
        { text: '去登录', onPress: () => setShowLoginModal(true) },
      ]);
      return;
    }
    setShowEditProfileModal(true);
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

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('提示', '已退出登录');
          },
        },
      ],
      { cancelable: true }
    );
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

      {/* 未登录时显示登录/注册提示 */}
      {!isLoggedIn && (
        <View className="mx-4 mt-4 mb-2">
          <SettingItem
            icon="🔐"
            label="登录账号"
            value="解锁更多功能"
            onPress={() => setShowLoginModal(true)}
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

        {/* 已登录时显示退出登录选项 */}
        {isLoggedIn && (
          <SettingItem
            icon="🚪"
            label="退出登录"
            onPress={handleLogout}
          />
        )}
      </View>

      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />

      {/* 登录Modal */}
      <Modal
        visible={showLoginModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <LoginScreen
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      </Modal>

      {/* 注册Modal */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRegisterModal(false)}
      >
        <RegisterScreen
          onClose={() => setShowRegisterModal(false)}
        />
      </Modal>

      {/* 编辑个人信息Modal */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditProfileModal(false)}
      >
        <EditProfileScreen
          onClose={() => setShowEditProfileModal(false)}
        />
      </Modal>
    </ScrollView>
  );
}
