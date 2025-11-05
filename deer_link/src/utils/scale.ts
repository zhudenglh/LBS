// 屏幕尺寸缩放工具 - 将Figma设计稿(750px基准)转换为实际屏幕尺寸

import { Dimensions } from 'react-native';

// 设计稿宽度基准（Figma设计稿宽度）
const DESIGN_WIDTH = 750;

// 获取设备屏幕宽度
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 将设计稿尺寸转换为实际屏幕尺寸
 * @param size 设计稿中的尺寸
 * @returns 缩放后的实际尺寸
 */
export function scale(size: number): number {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
}

/**
 * 垂直缩放（可选，用于高度）
 * 通常使用与宽度相同的缩放比例
 */
export function scaleVertical(size: number): number {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
}

/**
 * 字体缩放（使用与布局相同的缩放比例，保持Figma设计的精确比例）
 */
export function scaleFont(size: number): number {
  const scaleFactor = SCREEN_WIDTH / DESIGN_WIDTH;
  // 使用实际缩放比例，不做限制，以精确匹配Figma设计
  return Math.round(size * scaleFactor);
}

// 导出屏幕宽度供使用
export const screenWidth = SCREEN_WIDTH;

// 导出缩放比例
export const scaleFactor = SCREEN_WIDTH / DESIGN_WIDTH;
