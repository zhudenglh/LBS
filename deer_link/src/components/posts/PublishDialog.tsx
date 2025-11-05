// Publish Post Dialog Component

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import ImagePicker from './ImagePicker';
import BusSelector from './BusSelector';
import { validatePostTitle, validatePostContent } from '@utils/validator';
import { uploadMultipleImages } from '@api/images';
import { createPost } from '@api/posts';
import { useUser } from '@contexts/UserContext';

interface PublishDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PublishDialog({ visible, onClose, onSuccess }: PublishDialogProps) {
  const { t } = useTranslation();
  const { userId, nickname, avatar } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    // Validate inputs
    const titleValidation = validatePostTitle(title);
    if (!titleValidation.valid) {
      Alert.alert(t('common.validation.required'), t(titleValidation.error!));
      return;
    }

    const contentValidation = validatePostContent(content);
    if (!contentValidation.valid) {
      Alert.alert(t('common.validation.required'), t(contentValidation.error!));
      return;
    }

    try {
      setLoading(true);

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadMultipleImages(selectedImages);
      }

      // Create post
      await createPost({
        title,
        content,
        busTag: selectedBus,
        imageUrls,
        userId,
        username: nickname,
        avatar,
      });

      // Reset form
      setTitle('');
      setContent('');
      setSelectedImages([]);
      setSelectedBus('');

      Alert.alert(t('discover.post.publish_success'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to publish post:', error);
      Alert.alert(t('discover.validation.image_upload_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-background">
        <View className="flex-row justify-between items-center p-lg bg-white border-b border-border">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-base text-primary">{t('common.button.cancel')}</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-text-primary">{t('discover.post.publish')}</Text>
          <View className="w-12" />
        </View>

        <ScrollView className="flex-1 p-lg">
          <TextInput
            className="bg-white p-lg rounded-md text-base mb-md"
            placeholder={t('discover.post.title_placeholder')}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            className="bg-white p-lg rounded-md text-base min-h-[120px] mb-md"
            placeholder={t('discover.post.content_placeholder')}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />

          <ImagePicker images={selectedImages} onImagesChange={setSelectedImages} />

          <BusSelector selectedBus={selectedBus} onSelectBus={setSelectedBus} />
        </ScrollView>

        <View className="p-lg bg-white border-t border-border">
          <Button
            title={loading ? t('discover.post.publishing') : t('discover.post.publish')}
            onPress={handlePublish}
            disabled={loading}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
}
