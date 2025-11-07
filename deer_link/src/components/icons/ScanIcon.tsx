// ScanIcon - 扫码图标（精确Figma尺寸：68×68px）
// Node ID: 1:590 - Frame 167
// 设计说明：QR码扫描框图标，带四个角框和扫描线

import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

interface ScanIconProps {
  size?: number;
  color?: string;
}

export default function ScanIcon({
  size = 68,
  color = '#111111'
}: ScanIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 左上角 */}
      <Path
        d="M3 3h5v2H5v3H3V3z"
        fill={color}
      />
      {/* 右上角 */}
      <Path
        d="M21 3v5h-2V5h-3V3h5z"
        fill={color}
      />
      {/* 左下角 */}
      <Path
        d="M3 16v5h5v-2H5v-3H3z"
        fill={color}
      />
      {/* 右下角 */}
      <Path
        d="M21 16h-2v3h-3v2h5v-5z"
        fill={color}
      />
      {/* 扫描线 */}
      <Rect
        x="5"
        y="11"
        width="14"
        height="2"
        fill={color}
        opacity="0.5"
      />
    </Svg>
  );
}
