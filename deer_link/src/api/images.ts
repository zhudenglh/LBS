// Image Upload API

import { apiClient } from './client';
import { API_ENDPOINTS } from '@constants/api';
import type { UploadImageResponse } from '@types';

export async function uploadImage(imageUri: string): Promise<string> {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);

  console.log('[uploadImage] Uploading image:', imageUri);

  const response = await apiClient.post<UploadImageResponse>(API_ENDPOINTS.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('[uploadImage] Response:', response.data);

  // 后端返回格式: { code: 200, message: "...", data: { image_url: "...", image_id: "...", file_size: ... } }
  const imageUrl = response.data.data?.image_url || response.data.image_url || response.data.url;
  console.log('[uploadImage] Extracted URL:', imageUrl);

  if (!imageUrl) {
    console.error('[uploadImage] No URL found in response:', response.data);
    throw new Error('Failed to get image URL from server response');
  }

  return imageUrl;
}

export async function uploadMultipleImages(imageUris: string[]): Promise<string[]> {
  const uploadPromises = imageUris.map((uri) => uploadImage(uri));
  return Promise.all(uploadPromises);
}
