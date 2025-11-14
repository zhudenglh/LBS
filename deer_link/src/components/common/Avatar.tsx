// Avatar Component

import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';

interface AvatarProps {
  emoji?: string; // Emoji 字符串（已废弃）
  uri?: string; // 图片 URL
  size?: number;
  style?: ViewStyle;
}

// 验证是否是有效的 URL
function isValidUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

export default function Avatar({ emoji, uri, size = 40, style }: AvatarProps) {
  // 优先使用 uri，其次使用 emoji
  const imageUrl = uri || emoji;
  const isUrl = isValidUrl(imageUrl);

  return (
    <View
      className="bg-background items-center justify-center border border-border overflow-hidden"
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
    >
      {isUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : (
        <Text style={{ fontSize: size * 0.6, lineHeight: undefined }}>
          {imageUrl || '👤'}
        </Text>
      )}
    </View>
  );
}
