// X Icon - 关闭按钮的X图标
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface XIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function XIcon({
  size = 24,
  color = '#374151',
  strokeWidth = 2
}: XIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* X 形状 - 左上到右下 */}
      <Path
        d="M18 6L6 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* X 形状 - 右上到左下 */}
      <Path
        d="M6 6L18 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
