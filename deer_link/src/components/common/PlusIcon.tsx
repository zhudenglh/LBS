// Plus Icon - 粗线条十字加号图标
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PlusIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function PlusIcon({
  size = 28,
  color = '#FFFFFF',
  strokeWidth = 3
}: PlusIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 十字加号 - 垂直线 */}
      <Path
        d="M12 5L12 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 十字加号 - 水平线 */}
      <Path
        d="M5 12L19 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
