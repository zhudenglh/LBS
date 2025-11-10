/**
 * Responsive Design Utilities
 * Design base: 750px width (iPhone 6/7/8 Plus @2x)
 * Automatically scales for different screen sizes
 */

import { Dimensions, PixelRatio } from 'react-native';

// Design constants
const DESIGN_WIDTH = 750;
const DESIGN_HEIGHT = 2658;

// Get device dimensions
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

/**
 * Scale value based on device width
 * @param size - Design size in px (from Figma 750px canvas)
 * @returns Scaled size for current device
 */
export const scaleWidth = (size: number): number => {
  return (DEVICE_WIDTH / DESIGN_WIDTH) * size;
};

/**
 * Scale value based on device height
 * @param size - Design size in px (from Figma 2658px canvas)
 * @returns Scaled size for current device
 */
export const scaleHeight = (size: number): number => {
  return (DEVICE_HEIGHT / DESIGN_HEIGHT) * size;
};

/**
 * Scale font size (with minimum readable size limit)
 * @param size - Font size from Figma
 * @returns Scaled font size, minimum 10px
 */
export const scaleFont = (size: number): number => {
  const scaled = scaleWidth(size);
  return Math.max(scaled, 10); // Minimum 10px for readability
};

/**
 * Moderate scale - balances between full scaling and fixed size
 * Good for spacing and margins
 * @param size - Design size
 * @param factor - Scale factor (0-1), default 0.5
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const baseScale = scaleWidth(size);
  return size + (baseScale - size) * factor;
};

/**
 * Get responsive style values
 * Converts Figma absolute values to responsive React Native values
 */
export const responsive = {
  // Width scaling
  w: scaleWidth,
  width: scaleWidth,

  // Height scaling
  h: scaleHeight,
  height: scaleHeight,

  // Font scaling
  f: scaleFont,
  font: scaleFont,

  // Moderate scaling (for padding, margin, borderRadius)
  m: moderateScale,
  moderate: moderateScale,
};

/**
 * Get device info for conditional rendering
 */
export const deviceInfo = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  isSmallDevice: DEVICE_WIDTH < 375,
  isMediumDevice: DEVICE_WIDTH >= 375 && DEVICE_WIDTH < 414,
  isLargeDevice: DEVICE_WIDTH >= 414,
  pixelRatio: PixelRatio.get(),
};

/**
 * Percentage-based width
 * @param percentage - 0-100
 */
export const wp = (percentage: number): number => {
  return (DEVICE_WIDTH * percentage) / 100;
};

/**
 * Percentage-based height
 * @param percentage - 0-100
 */
export const hp = (percentage: number): number => {
  return (DEVICE_HEIGHT * percentage) / 100;
};

export default responsive;
