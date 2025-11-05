// Image Picker Component

import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { IMAGE_CONFIG } from '@constants/config';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImagePicker({
  images,
  onImagesChange,
  maxImages = IMAGE_CONFIG.MAX_COUNT,
}: ImagePickerProps) {
  const { t } = useTranslation();

  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert(t('discover.post.max_images'));
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: IMAGE_CONFIG.MAX_WIDTH,
        maxHeight: IMAGE_CONFIG.MAX_HEIGHT,
        quality: IMAGE_CONFIG.QUALITY as any,
        selectionLimit: maxImages - images.length,
      });

      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map((asset) => asset.uri!).filter(Boolean);
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Failed to pick image:', error);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View className="mb-md">
      <View className="flex-row flex-wrap gap-md">
        {images.map((uri, index) => (
          <View key={index} className="relative">
            <Image source={{ uri }} className="w-[100px] h-[100px] rounded-md" />
            <TouchableOpacity
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary items-center justify-center"
              onPress={() => handleRemoveImage(index)}
            >
              <Text className="text-sm text-white font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity
            className="w-[100px] h-[100px] rounded-md border-2 border-dashed border-border items-center justify-center bg-background"
            onPress={handleAddImage}
          >
            <Text className="text-[32px] mb-xs">📷</Text>
            <Text className="text-xs text-text-secondary">{t('discover.post.add_image')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
