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

  const response = await apiClient.post<UploadImageResponse>(API_ENDPOINTS.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}

export async function uploadMultipleImages(imageUris: string[]): Promise<string[]> {
  const uploadPromises = imageUris.map((uri) => uploadImage(uri));
  return Promise.all(uploadPromises);
}
