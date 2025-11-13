// ChevronDown Icon - 下拉箭头图标
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ChevronDownIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function ChevronDownIcon({
  size = 16,
  color = '#6B7280',
  strokeWidth = 2
}: ChevronDownIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 下箭头 */}
      <Path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
