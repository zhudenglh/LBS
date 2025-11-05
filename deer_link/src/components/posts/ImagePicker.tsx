// Image Picker Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';
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
    <View style={styles.container}>
      <View style={styles.imagesGrid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
            <Text style={styles.addIcon}>📷</Text>
            <Text style={styles.addText}>{t('discover.post.add_image')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  addIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  addText: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
  },
});
