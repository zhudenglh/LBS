// Figma Asset URL Helper
// 将localhost URL转换为适配Android模拟器的URL

import { Platform } from 'react-native';

/**
 * 转换Figma localhost URL为React Native可访问的URL
 * - iOS模拟器: localhost可以直接访问开发机器
 * - Android模拟器: 需要使用10.0.2.2替代localhost
 * - 真机: 使用开发机器的IP地址（需要在同一网络）
 */
export function getFigmaAssetUrl(localhostUrl: string): string {
  if (Platform.OS === 'android') {
    // Android模拟器需要使用10.0.2.2来访问开发机器的localhost
    return localhostUrl.replace('localhost', '10.0.2.2');
  }
  // iOS模拟器可以直接使用localhost
  return localhostUrl;
}

/**
 * 批量转换Figma资源URL对象
 */
export function convertFigmaImages<T extends Record<string, string>>(
  images: T
): T {
  const converted = {} as T;
  for (const key in images) {
    converted[key] = getFigmaAssetUrl(images[key]) as T[Extract<keyof T, string>];
  }
  return converted;
}
