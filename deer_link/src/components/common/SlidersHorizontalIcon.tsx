// SlidersHorizontal Icon - 筛选图标
import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface SlidersHorizontalIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function SlidersHorizontalIcon({
  size = 18,
  color = '#374151',
  strokeWidth = 2
}: SlidersHorizontalIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 顶部滑块线条和圆圈 */}
      <Path d="M4 6L11 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M15 6L20 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="13" cy="6" r="2" stroke={color} strokeWidth={strokeWidth} fill="none" />

      {/* 中间滑块线条和圆圈 */}
      <Path d="M4 12L7 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M11 12L20 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="9" cy="12" r="2" stroke={color} strokeWidth={strokeWidth} fill="none" />

      {/* 底部滑块线条和圆圈 */}
      <Path d="M4 18L13 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M17 18L20 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="15" cy="18" r="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
    </Svg>
  );
}
