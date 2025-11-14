// Login Screen - 登录页面
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

interface LoginScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginScreen({ onClose, onSuccess, onSwitchToRegister }: LoginScreenProps) {
  const { t } = useTranslation();
  const { loginWithEmail } = useUser();

  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone'); // 默认手机号登录
  const [countryCode, setCountryCode] = useState('+86');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // 验证输入
    if (loginType === 'phone') {
      if (!phone.trim()) {
        Alert.alert('提示', '请输入手机号');
        return;
      }
      if (phone.length < 11) {
        Alert.alert('提示', '请输入有效的手机号');
        return;
      }
    } else {
      if (!email.trim()) {
        Alert.alert('提示', '请输入邮箱地址');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('提示', '请输入有效的邮箱地址');
        return;
      }
    }

    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    try {
      setLoading(true);

      await loginWithEmail(
        loginType === 'phone' ? phone.trim() : email.trim(),
        password.trim()
      );

      Alert.alert('成功', '登录成功！', [
        {
          text: '确定',
          onPress: () => {
            onSuccess?.();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || '登录失败，请检查账号密码';
      Alert.alert('登录失败', message);
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
          <Text className="text-lg font-semibold text-gray-900">登录</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* 登录方式切换 */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
            <TouchableOpacity
              onPress={() => setLoginType('phone')}
              className={`flex-1 py-2 rounded-md ${
                loginType === 'phone' ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  loginType === 'phone' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                手机号登录
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLoginType('email')}
              className={`flex-1 py-2 rounded-md ${
                loginType === 'email' ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-center text-sm font-medium ${
                  loginType === 'email' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                邮箱登录
              </Text>
            </TouchableOpacity>
          </View>

          {/* 手机号登录 */}
          {loginType === 'phone' && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">手机号</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <TouchableOpacity
                  className="flex-row items-center pr-3 border-r border-gray-300"
                  onPress={() => {
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
          )}

          {/* 邮箱登录 */}
          {loginType === 'email' && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">邮箱</Text>
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
          )}

          {/* 密码 */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">密码</Text>
            <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <Icon name="lock-closed-outline" size={20} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="请输入密码"
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

          {/* 忘记密码 */}
          <TouchableOpacity className="mb-6" activeOpacity={0.7}>
            <Text className="text-sm text-blue-600 text-right">忘记密码？</Text>
          </TouchableOpacity>

          {/* 登录按钮 */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`py-4 rounded-lg ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-center text-white text-base font-semibold">登录</Text>
            )}
          </TouchableOpacity>

          {/* 注册提示 */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-sm text-gray-600">还没有账号？</Text>
            <TouchableOpacity
              onPress={onSwitchToRegister}
              className="ml-2"
              activeOpacity={0.7}
            >
              <Text className="text-sm text-blue-600 font-medium">立即注册</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
