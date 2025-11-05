// Publish Post Dialog Component

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import ImagePicker from './ImagePicker';
import BusSelector from './BusSelector';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>{t('common.button.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('discover.post.publish')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder={t('discover.post.title_placeholder')}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            style={styles.contentInput}
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

        <View style={styles.footer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  titleInput: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  contentInput: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    fontSize: fontSize.md,
    minHeight: 120,
    marginBottom: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
