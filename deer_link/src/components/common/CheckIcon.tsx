// Check Icon - 勾选图标
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function CheckIcon({
  size = 14,
  color = '#374151',
  strokeWidth = 2
}: CheckIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 勾选标记 */}
      <Path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
