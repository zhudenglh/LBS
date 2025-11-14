// Register Screen - 邮箱注册页面
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
import { generateRandomNickname, generateRandomAvatar } from '@utils/avatar';
import { uploadImage } from '@api/images';
import Avatar from '@components/common/Avatar';

interface RegisterScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterScreen({ onClose, onSuccess }: RegisterScreenProps) {
  const { t } = useTranslation();
  const { registerWithEmail } = useUser();

  const [countryCode, setCountryCode] = useState('+86'); // 默认中国
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState(generateRandomNickname());
  const [avatar, setAvatar] = useState(''); // 用户选择的头像URL
  const [randomAvatar, setRandomAvatar] = useState(generateRandomAvatar()); // 随机生成的默认头像
  const [gender, setGender] = useState<number>(0); // 0=未知, 1=男, 2=女
  const [age, setAge] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // 验证输入
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (phone.length < 11) {
      Alert.alert('提示', '请输入有效的手机号');
      return;
    }

    // 邮箱可选，但如果填写了需要验证格式
    if (email.trim() && !validateEmail(email)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }

    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    if (password.length < 6) {
      Alert.alert('提示', '密码长度至少为6位');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    if (!nickname.trim()) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    try {
      setLoading(true);

      await registerWithEmail({
        phone: phone.trim(),
        email: email.trim() || undefined, // 邮箱可选
        password: password.trim(),
        nickname: nickname.trim(),
        avatar: avatar || randomAvatar, // 用户上传的或随机生成的
        gender,
        age: age ? parseInt(age) : undefined,
      });

      Alert.alert('成功', '注册成功！', [
        {
          text: '确定',
          onPress: () => {
            onSuccess?.();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const message = error.response?.data?.message || '注册失败，请重试';
      Alert.alert('注册失败', message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNickname = () => {
    setNickname(generateRandomNickname());
  };

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
      console.log('[Register] Uploading avatar...');
      const imageUrl = await uploadImage(asset.uri);
      console.log('[Register] Avatar uploaded:', imageUrl);

      // 更新为服务器返回的URL
      setAvatar(imageUrl);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      Alert.alert('错误', '头像上传失败，将使用系统默认头像');
      // 恢复为随机头像
      setAvatar('');
    }
  };

  // 获取显示的头像URL - 用户上传的优先，否则显示随机生成的
  const displayAvatar = avatar || randomAvatar;

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
          <Text className="text-lg font-semibold text-gray-900">注册账号</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* 头像选择 */}
          <View className="mb-6 items-center">
            <TouchableOpacity onPress={handleSelectAvatar} activeOpacity={0.7}>
              <View className="relative">
                <Avatar uri={displayAvatar} size={96} />
                <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                  <Icon name="camera" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 mt-2">点击上传头像（可选）</Text>
          </View>

          {/* 手机号 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              手机号 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <TouchableOpacity
                className="flex-row items-center pr-3 border-r border-gray-300"
                onPress={() => {
                  // 可以扩展为国家代码选择器
                  Alert.alert('国家代码', '当前仅支持中国 +86');
                }}
              >
                <Text className="text-base text-gray-900 mr-1">{countryCode}</Text>
                <Icon name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="请输入手机号"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                maxLength={11}
                className="flex-1 ml-3 text-base text-gray-900"
              />
            </View>
          </View>

          {/* 邮箱（可选） */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              邮箱地址（可选）
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="mail-outline" size={20} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="选填，用于找回密码"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 ml-3 text-base text-gray-900"
              />
            </View>
          </View>

          {/* 密码 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              密码 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="至少6位密码"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 ml-3 text-base text-gray-900"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 确认密码 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              确认密码 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="再次输入密码"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                className="flex-1 ml-3 text-base text-gray-900"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 昵称 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              昵称 <Text className="text-red-500">*</Text>
            </Text>
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
              <TouchableOpacity
                onPress={handleGenerateNickname}
                className="ml-2 px-3 py-1 bg-blue-50 rounded-md"
              >
                <Text className="text-xs text-blue-600 font-medium">随机生成</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 性别（可选） */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">性别（可选）</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setGender(0)}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-lg border ${
                  gender === 0
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Icon
                  name="help-circle-outline"
                  size={20}
                  color={gender === 0 ? '#3B82F6' : '#6B7280'}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    gender === 0 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  保密
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGender(1)}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-lg border ${
                  gender === 1
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Icon
                  name="male-outline"
                  size={20}
                  color={gender === 1 ? '#3B82F6' : '#6B7280'}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    gender === 1 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  男
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setGender(2)}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-lg border ${
                  gender === 2
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Icon
                  name="female-outline"
                  size={20}
                  color={gender === 2 ? '#3B82F6' : '#6B7280'}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    gender === 2 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  女
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 年龄（可选） */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">年龄（可选）</Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="calendar-outline" size={20} color="#6B7280" />
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="请输入年龄"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={3}
                className="flex-1 ml-3 text-base text-gray-900"
              />
            </View>
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className={`py-4 rounded-lg ${
              loading ? 'bg-gray-300' : 'bg-blue-500'
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white text-base font-semibold">
                注册
              </Text>
            )}
          </TouchableOpacity>

          {/* 用户协议提示 */}
          <Text className="text-xs text-gray-500 text-center mt-4 px-4 leading-5">
            注册即表示您同意我们的{' '}
            <Text className="text-blue-600">服务条款</Text> 和{' '}
            <Text className="text-blue-600">隐私政策</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
