// Edit Profile Screen - 编辑个人信息页面
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '@contexts/UserContext';
import { uploadImage } from '@api/images';
import { updateCurrentUserInfo } from '@api/users';
import Avatar from '@components/common/Avatar';

interface EditProfileScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditProfileScreen({ onClose, onSuccess }: EditProfileScreenProps) {
  const { t } = useTranslation();
  const { nickname: currentNickname, avatar: currentAvatar, updateProfile } = useUser();

  const [nickname, setNickname] = useState(currentNickname);
  const [avatar, setAvatar] = useState(currentAvatar);
  const [loading, setLoading] = useState(false);

  const handleSelectAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
      });

      if (result.didCancel || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];
      if (!asset.uri) return;

      // 先显示本地图片（即时反馈）
      setAvatar(asset.uri);

      // 上传图片到服务器
      console.log('[EditProfile] Uploading avatar...');
      const imageUrl = await uploadImage(asset.uri);
      console.log('[EditProfile] Avatar uploaded:', imageUrl);

      // 更新为服务器返回的URL
      setAvatar(imageUrl);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      Alert.alert('错误', '头像上传失败，请重试');
    }
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        nickname: nickname.trim(),
        avatar: avatar,
      };

      console.log('[EditProfile] Saving profile with data:', updateData);

      // 调用后端 API 更新用户信息
      const result = await updateCurrentUserInfo(updateData);
      console.log('[EditProfile] Profile updated, result:', result);

      // 更新本地状态
      await updateProfile(nickname.trim(), avatar);

      Alert.alert('成功', '个人信息已更新！', [
        {
          text: '确定',
          onPress: () => {
            onSuccess?.();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const message = error.response?.data?.message || '更新失败，请重试';
      Alert.alert('错误', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity
            onPress={onClose}
            className="p-2 -ml-2 rounded-full active:bg-gray-100"
          >
            <Icon name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">编辑个人信息</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="px-4 py-1 rounded-full bg-blue-500"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-sm text-white font-medium">保存</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* 头像 */}
          <View className="mb-6 items-center">
            <TouchableOpacity onPress={handleSelectAvatar} activeOpacity={0.7}>
              <View className="relative">
                <Avatar uri={avatar} size={96} />
                <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                  <Icon name="camera" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 mt-2">点击更换头像</Text>
          </View>

          {/* 昵称 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">昵称</Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="person-outline" size={20} color="#6B7280" />
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="请输入昵称"
                placeholderTextColor="#9CA3AF"
                className="flex-1 ml-3 text-base text-gray-900"
                maxLength={20}
              />
            </View>
          </View>

          {/* 提示信息 */}
          <View className="bg-blue-50 rounded-lg p-4">
            <View className="flex-row items-start">
              <Icon name="information-circle-outline" size={20} color="#3B82F6" />
              <Text className="flex-1 ml-2 text-sm text-blue-700 leading-5">
                昵称和头像可以随时修改。其他信息（手机号、邮箱等）如需修改，请联系客服。
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
