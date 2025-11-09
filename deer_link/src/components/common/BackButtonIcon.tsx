import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface BackButtonIconProps {
  size?: number;
}

export default function BackButtonIcon({ size = 40 }: BackButtonIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
    >
      {/* 深灰色圆形背景 */}
      <Circle cx="24" cy="24" r="24" fill="#6B7280" />

      {/* 白色返回箭头 */}
      <Path
        d="M28 14L18 24L28 34"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
