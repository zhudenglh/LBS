// Pin Icon - 图钉图标
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PinIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function PinIcon({
  size = 16,
  color = '#374151',
  strokeWidth = 2
}: PinIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* 图钉形状 */}
      <Path
        d="M9 9V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V9C16.6569 9 18 10.3431 18 12V13C18 13.5523 17.5523 14 17 14H13V20M12 20V14M11 14H7C6.44772 14 6 13.5523 6 13V12C6 10.3431 7.34315 9 9 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
