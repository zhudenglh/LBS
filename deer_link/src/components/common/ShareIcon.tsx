import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ShareIconProps {
  size?: number;
  color?: string;
}

export default function ShareIcon({
  size = 18,
  color = '#666'
}: ShareIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Arrow shaft curving upward */}
      <Path
        d="M4 14C4 14 6 8 12 8L12 4L20 11L12 18L12 14C12 14 8 14 4 14Z"
        fill="white"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
