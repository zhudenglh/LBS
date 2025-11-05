// useImageUpload Hook - Image Upload Logic

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadMultipleImages } from '@api/images';
import { IMAGE_CONFIG } from '@constants/config';

export function useImageUpload(maxImages: number = IMAGE_CONFIG.MAX_COUNT) {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const pickImages = useCallback(async () => {
    if (images.length >= maxImages) {
      Alert.alert('Maximum images reached', `You can only upload ${maxImages} images`);
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
        setImages((prev) => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Failed to pick images:', error);
      Alert.alert('Error', 'Failed to select images');
    }
  }, [images.length, maxImages]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const uploadImages = useCallback(async (): Promise<string[]> => {
    if (images.length === 0) {
      return [];
    }

    try {
      setUploading(true);
      const urls = await uploadMultipleImages(images);
      setUploadedUrls(urls);
      return urls;
    } catch (error) {
      console.error('Failed to upload images:', error);
      Alert.alert('Error', 'Failed to upload images');
      throw error;
    } finally {
      setUploading(false);
    }
  }, [images]);

  const reset = useCallback(() => {
    setImages([]);
    setUploadedUrls([]);
    setUploading(false);
  }, []);

  return {
    images,
    uploading,
    uploadedUrls,
    pickImages,
    removeImage,
    uploadImages,
    reset,
  };
}
