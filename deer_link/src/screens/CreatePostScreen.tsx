// Create Post Screen - 南京公交创建帖子页面
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import FlairSelector from '../components/community/FlairSelector';
import ImagePicker from '../components/posts/ImagePicker';
import XIcon from '../components/common/XIcon';
import { useUser } from '@contexts/UserContext';
import { createPost } from '@api/posts';
import { uploadMultipleImages } from '@api/images';

interface CreatePostScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
  subredditName?: string;
}

// Flair color mapping - same as FlairSelector
const getFlairColor = (flair: string): { bg: string; text: string } => {
  if (flair.startsWith('s') || flair.startsWith('S')) {
    return { bg: '#A855F7', text: '#FFFFFF' };
  } else if (flair.includes('轮渡')) {
    return { bg: '#06B6D4', text: '#FFFFFF' };
  } else if (flair.startsWith('y') || flair.startsWith('Y')) {
    return { bg: '#6366F1', text: '#FFFFFF' };
  } else if (flair === '攻略' || flair === '推荐') {
    return { bg: '#3B82F6', text: '#FFFFFF' };
  } else if (flair === '求助') {
    return { bg: '#9CA3AF', text: '#FFFFFF' };
  } else if (flair === '优惠') {
    return { bg: '#F97316', text: '#FFFFFF' };
  } else if (flair === '暖心') {
    return { bg: '#10B981', text: '#FFFFFF' };
  } else if (flair === '吐槽') {
    return { bg: '#EF4444', text: '#FFFFFF' };
  } else if (flair === '有轨电车') {
    return { bg: '#14B8A6', text: '#FFFFFF' };
  } else if (flair === '机场巴士') {
    return { bg: '#EC4899', text: '#FFFFFF' };
  } else if (flair === '地铁') {
    return { bg: '#9333EA', text: '#FFFFFF' };
  } else {
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF' },
      { bg: '#10B981', text: '#FFFFFF' },
      { bg: '#F97316', text: '#FFFFFF' },
      { bg: '#EF4444', text: '#FFFFFF' },
      { bg: '#EC4899', text: '#FFFFFF' },
      { bg: '#14B8A6', text: '#FFFFFF' },
    ];
    const hash = flair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
};

export default function CreatePostScreen({
  onClose,
  onSuccess,
  subredditName = '南京公交',
}: CreatePostScreenProps) {
  const { t } = useTranslation();
  const { userId, nickname, avatar } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFlair, setSelectedFlair] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isFlairSelectorOpen, setIsFlairSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const canPost = title.trim().length > 0 && selectedFlair.length > 0;

  const handlePost = async () => {
    if (!canPost) {
      Alert.alert('提示', '请填写标题并选择标识');
      return;
    }

    try {
      setLoading(true);

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadMultipleImages(selectedImages);
      }

      // Create post with flair as busTag
      await createPost({
        title,
        content,
        busTag: selectedFlair,
        imageUrls,
        userId,
        username: nickname,
        avatar,
      });

      Alert.alert('成功', '帖子发布成功！');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert('错误', '发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={onClose}
          className="p-2 -ml-2 rounded-full active:bg-gray-100"
        >
          <XIcon size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePost}
          disabled={!canPost || loading}
          className={`px-6 py-1.5 rounded-full ${
            canPost && !loading ? 'bg-blue-500' : 'bg-gray-100'
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              className={`text-sm font-medium ${
                canPost ? 'text-white' : 'text-gray-400'
              }`}
            >
              发帖
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Subreddit Selector */}
      <View className="px-4 py-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-2 self-start">
          <FastImage
            source={{
              uri: 'https://images.unsplash.com/photo-1756723701257-46513cd36fc1?w=100',
              priority: FastImage.priority.normal,
            }}
            className="w-8 h-8 rounded-full"
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text className="ml-2 text-sm font-medium text-gray-900">圈/{subredditName}</Text>
        </View>
        <TouchableOpacity className="ml-2 px-3 py-2">
          <Text className="text-sm text-gray-600">规则</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Title Section */}
        <View className="px-4 mb-4">
          <Text className="text-base font-medium text-gray-900 mb-2">标题</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="添加标记和标题（必需）"
            placeholderTextColor="#9CA3AF"
            className="text-base text-gray-900 py-2"
            maxLength={200}
          />
        </View>

        {/* Flair Section */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            onPress={() => setIsFlairSelectorOpen(true)}
            className="flex-row items-center"
          >
            {selectedFlair ? (
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: getFlairColor(selectedFlair).bg }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: getFlairColor(selectedFlair).text }}
                >
                  {selectedFlair}
                </Text>
              </View>
            ) : (
              <View className="px-4 py-2 bg-gray-100 rounded-full">
                <Text className="text-sm text-gray-700">选择标识(必需)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="px-4 mb-6">
          <Text className="text-sm text-gray-500 mb-2">正文文本（可选）</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder=""
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="text-base text-gray-900 py-2"
            maxLength={500}
          />
        </View>

        {/* Image Picker */}
        <View className="px-4 mb-6">
          <ImagePicker images={selectedImages} onImagesChange={setSelectedImages} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-gray-200 px-4 py-3 bg-white">
        <View className="flex-row items-center justify-around">
          <TouchableOpacity className="p-2 active:bg-gray-50 rounded">
            <Icon name="link" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 active:bg-gray-50 rounded">
            <Icon name="image" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 active:bg-gray-50 rounded">
            <Icon name="videocam" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 active:bg-gray-50 rounded">
            <Icon name="bar-chart" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Flair Selector Modal */}
      <FlairSelector
        visible={isFlairSelectorOpen}
        onClose={() => setIsFlairSelectorOpen(false)}
        onSelect={setSelectedFlair}
        selectedFlair={selectedFlair}
      />
    </SafeAreaView>
  );
}
