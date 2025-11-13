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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '@contexts/UserContext';
import { generateRandomNickname } from '@utils/avatar';

interface RegisterScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterScreen({ onClose, onSuccess }: RegisterScreenProps) {
  const { t } = useTranslation();
  const { registerWithEmail } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState(generateRandomNickname());
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
    if (!email.trim()) {
      Alert.alert('提示', '请输入邮箱地址');
      return;
    }

    if (!validateEmail(email)) {
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
        email: email.trim(),
        password: password.trim(),
        nickname: nickname.trim(),
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
          {/* 邮箱 */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              邮箱地址 <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="mail-outline" size={20} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="请输入邮箱地址"
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
