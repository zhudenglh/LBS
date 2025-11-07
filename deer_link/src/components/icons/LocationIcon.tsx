// LocationIcon - 定位图标（精确Figma尺寸：30×30px）
// Node ID: 1:588 - Frame

import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LocationIconProps {
  size?: number;
  color?: string;
}

export default function LocationIcon({
  size = 30,
  color = '#111111'
}: LocationIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={color}
      />
    </Svg>
  );
}
